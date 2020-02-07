// modules
import * as $ from 'jquery';
import * as EventEmitter from 'eventemitter3';
import 'requestidlecallback-polyfill';

// constants
const CHANNEL_LIST_SELECTOR = '.p-channel_sidebar__static_list';
const CHANNEL_LIST_CONTAINER_SELECTOR = CHANNEL_LIST_SELECTOR + ' .c-virtual_list__scroll_container';
const CHANNEL_LIST_ITEMS_SELECTOR = CHANNEL_LIST_SELECTOR + ' [role=listitem]';
const CHANNEL_NAME_SELECTOR = '.p-channel_sidebar__name';
const CHANNEL_NAME_ROOT = '-/';
const WAIT_RENDER_CHANNEL_LIST_INTERVAL = 100;
const WAIT_RENDER_CHANNEL_LIST_TIMEOUT = 1000 * 30;
const UPDATE_CHANNEL_LIST_MIN_INTERVAL = 100;

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
        if (Date.now() - loopStartTime > WAIT_RENDER_CHANNEL_LIST_TIMEOUT) {
          resolve();
          return;
        }

        setTimeout(checkChannelListLoop, WAIT_RENDER_CHANNEL_LIST_INTERVAL);
      };

      checkChannelListLoop();
    });
  }

  enableObserver(): void {
    if (this.isObserving) {
      return;
    }
    if (!this.observer) {
      this.observer = new MutationObserver((): void => {
        const nextUpdateInterval = Math.max(0, this.lastUpdatedTime + UPDATE_CHANNEL_LIST_MIN_INTERVAL - Date.now());

        if (this.updateTimeoutId !== null) {
          window.clearTimeout(this.updateTimeoutId);
        }

        // Reduce infinity loop impact
        this.updateTimeoutId = setTimeout(() => {
          this.emit('update');
          this.lastUpdatedTime = Date.now();
        }, nextUpdateInterval);
      });
    }

    const observeTarget = document.querySelector(CHANNEL_LIST_CONTAINER_SELECTOR);
    if (!observeTarget) {
      return;
    }
    this.observer.observe(observeTarget, {
      childList: true,
      // If set true, cause infinity loop. b/c observe channel name dom change.
      subtree: false,
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
  private idleCallbackId: number;

  groupingAllByPrefixOnIdle(): void {
    if (this.idleCallbackId !== null) {
      window.cancelIdleCallback(this.idleCallbackId);
    }

    this.idleCallbackId = window.requestIdleCallback(() => {
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
    this.applyGrouping($channelItems, prefixes);
  }

  protected getPrefixes($channelItems: JQuery): string[] {
    const regChannelMatch = /(^.+?)[-_].*/;
    const prefixes: string[] = [];

    $channelItems.each(function (index: number, channelItem: HTMLElement) {
      const $channelName = $(channelItem).find(CHANNEL_NAME_SELECTOR);
      const isApplied = $channelName.find('span.scg').length > 0;
      let channelName: string;
      let prefix: string;

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

  protected applyGrouping($channelItems: JQuery, prefixes: string[]): void {
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

        // Skip no changed
        if (separator === $channelName.find('.scg-ch-separator').text()) {
          return;
        }

        $channelName
          .removeClass('scg scg-ch-parent scg-ch-child')
          .addClass(isParent ? 'scg scg-ch-parent' : 'scg scg-ch-child')
          .empty()
          .append($('<span>').addClass('scg scg-ch-prefix').text(prefix))
          .append($('<span>').addClass('scg scg-ch-separator').text(separator))
          .append($('<span>').addClass('scg scg-ch-name').text($channelName.data('scg-channel-name').replace(/(^.+?)[-_](.*)/, '$2')));
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
