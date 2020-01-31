// modules
import * as $ from 'jquery';
import * as EventEmitter from 'eventemitter3';

// constants
const CHANNEL_LIST_SELECTOR = '.p-channel_sidebar__static_list';
const CHANNEL_LIST_ITEMS_SELECTOR = CHANNEL_LIST_SELECTOR + ' [role=listitem]';
const CHANNEL_NAME_SELECTOR = '.p-channel_sidebar__name';
const CHANNEL_NAME_ROOT = '-/';
const MIN_UPDATE_INTERVAL = 3000;

// types
type RequestIdleCallbackHandle = number;
type RequestIdleCallbackOptions = {
  timeout: number;
};
type RequestIdleCallbackDeadline = {
  readonly didTimeout: boolean;
  timeRemaining: (() => number);
};

declare global {
  interface Window {
    requestIdleCallback: ((
      callback: ((deadline: RequestIdleCallbackDeadline) => void),
      opts?: RequestIdleCallbackOptions,
    ) => RequestIdleCallbackHandle);
    cancelIdleCallback: ((handle: RequestIdleCallbackHandle) => void);
  }
}

/**
 * Channel Observing Class
 * @extends EventEmitter
 */
class ChannelObserver extends EventEmitter<'update'> {
  private observer: MutationObserver;
  private isObserving: boolean;
  private lastUpdatedTime: number;
  private updateTimeoutId: number;

  constructor() {
    super();
    this.observer = null;
    this.isObserving = false;
    this.lastUpdatedTime = Date.now();
    this.updateTimeoutId = null
  }

  async start(): Promise<void> {
    await this.waitRenderChannelList();
    this.emit('update');
    this.enableObserver();

    document.addEventListener('visibilitychange', () => {
      switch (document.visibilityState) {
        case 'visible':
          this.emit('update');
          this.enableObserver();
          break;
        case 'hidden':
          this.disableObserver();
          break;
      }
    });
  }

  protected waitRenderChannelList(): Promise<null> {
    return new Promise((resolve): void => {
      const loopStartTime = Date.now();

      const checkChannelListLoop = (): void => {
        if (document.querySelectorAll(CHANNEL_LIST_ITEMS_SELECTOR).length > 0) {
          resolve();
          return;
        }

        // timeout 30 seconds
        if (Date.now() - loopStartTime > 1000 * 30) {
          resolve();
          return;
        }

        setTimeout(checkChannelListLoop, 100);
      };

      checkChannelListLoop();
    });
  }

  enableObserver(): void {
    if (this.isObserving) {
      return;
    }
    if (!this.observer) {
      this.observer = new MutationObserver((records): void => {
        if (this.updateTimeoutId !== null) {
          window.clearTimeout(this.updateTimeoutId);
        }

        const nextUpdateInterval = Math.max(0, this.lastUpdatedTime + MIN_UPDATE_INTERVAL - Date.now());

        this.updateTimeoutId = setTimeout(() => {
          this.emit('update');
          this.lastUpdatedTime = Date.now();
        }, nextUpdateInterval);
      });
    }

    const observeTarget = document.querySelector(CHANNEL_LIST_SELECTOR);
    if (!observeTarget) {
      return;
    }
    this.observer.observe(observeTarget, {
      childList: true,
      subtree: true,
    });
    this.isObserving = true;
  }

  disableObserver(): void {
    if (!this.isObserving) {
      return;
    }
    if (this.observer) {
      this.observer.disconnect();
      this.isObserving = false;
    }
  }
}

/**
 * Channel Grouping Class
 */
class ChannelGrouper {
  groupingAllByPrefixOnIdle(): void {
    window.requestIdleCallback(() => {
      this.groupingAllByPrefix();
    }, {
      timeout: 10 * 1000
    });
  }

  groupingAllByPrefix(): void {
    const $channelItems = $(CHANNEL_LIST_ITEMS_SELECTOR);

    if ($channelItems.length === 0) {
      return;
    }

    const prefixes: string[] = this.getPrefixes($channelItems);
    this.preprocessForRootChannels($channelItems, prefixes);
    this.applyGrouing($channelItems, prefixes);
  }

  protected getPrefixes($channelItems: JQuery): string[] {
    const regChannelMatch = /(^.+?)[-_].*/;
    const prefixes: string[] = [];

    $channelItems.each(function (index: number, channelItem: HTMLElement) {
      const $channelName = $(channelItem).find(CHANNEL_NAME_SELECTOR);
      const isApplied = $channelName.find('span').length > 0;
      let channelName = '';
      let prefix = '';

      // Get ch name
      if (isApplied && $channelName.data('scg-channel-name')) {
        channelName = $channelName.data('scg-channel-name');
      } else {
        channelName = $.trim($channelName.text());
        // Store raw channel name
        $channelName.data('scg-raw-channel-name', channelName);
      }

      // Get ch name prefix
      if (isApplied && $channelName.data('scg-channel-prefix')) {
        prefix = $channelName.data('scg-channel-prefix');
      } else {
        if (regChannelMatch.test(channelName)) {
          prefix = channelName.match(regChannelMatch)[1];
        } else {
          prefix = '';
        }
      }

      $channelName.data('scg-channel-name', channelName);
      $channelName.data('scg-channel-prefix', prefix);
      prefixes[index] = prefix;
    });

    return prefixes;
  }

  protected preprocessForRootChannels($channelItems: JQuery, prefixes: string[]): void {
    $channelItems.each(function (index: number, channelItem: HTMLElement) {
      const $channelName = $(channelItem).find(CHANNEL_NAME_SELECTOR);
      const channelName: string = $channelName.data('scg-channel-name');
      const isRoot = prefixes[index + 1] === channelName;

      if (isRoot) {
        prefixes[index] = channelName;
        $channelName.data('scg-channel-name', `${channelName}${CHANNEL_NAME_ROOT}`);
        $channelName.data('scg-channel-prefix', channelName);
      }
    });
  }

  protected applyGrouing($channelItems: JQuery, prefixes: string[]): void {
    $channelItems.each(function (index: number, channelItem: HTMLElement) {
      const $channelName = $(channelItem).find(CHANNEL_NAME_SELECTOR);
      const prefix: string = prefixes[index];
      const isLoneliness = prefixes[index - 1] !== prefix && prefixes[index + 1] !== prefix;
      const isParent = prefixes[index - 1] !== prefix && prefixes[index + 1] === prefix;
      const isLastChild = prefixes[index - 1] === prefix && prefixes[index + 1] !== prefix;
      let separator = '';

      // Skip blank item
      if ($channelName.length === 0) {
        return;
      }

      // Skip no prefix
      if (prefixes[index] === '') {
        return;
      }

      if (isLoneliness) {
        $channelName
          .removeClass('scg-ch-parent scg-ch-child')
          .text($channelName.data('scg-raw-channel-name'));
      } else {
        if (isParent) {
          separator = '┬';
        } else if (isLastChild) {
          separator = '└';
        } else {
          separator = '├';
        }

        $channelName
          .removeClass('scg-ch-parent scg-ch-child')
          .addClass(isParent ? 'scg-ch-parent' : 'scg-ch-child')
          .empty()
          .append($('<span>').addClass('scg-ch-prefix').text(prefix))
          .append($('<span>').addClass('scg-ch-separator').text(separator))
          .append($('<span>').addClass('scg-ch-name').text($channelName.data('scg-channel-name').replace(/(^.+?)[-_](.*)/, '$2')));
      }
    });
  }
}

((): void => {
  const channelObserver = new ChannelObserver();
  const channelGrouper = new ChannelGrouper();
  channelObserver.on('update', () => {
    channelGrouper.groupingAllByPrefixOnIdle();
  });
  channelObserver.start();
})();
