// modules
import * as $ from 'jquery';
import * as EventEmitter from 'eventemitter3';

// constants
const CHANNEL_LIST_SELECTOR = '.p-channel_sidebar__static_list';
const CHANNEL_LIST_ITEMS_SELECTOR = CHANNEL_LIST_SELECTOR + ' [role=listitem]';
const CHANNEL_NAME_SELECTOR = '.p-channel_sidebar__name';
const CHANNEL_NAME_ROOT = '-/';

// types
type RequestIdleCallbackHandle = any;
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
class ChannelObserver extends EventEmitter<"update"> {
  private observer: MutationObserver
  private isObserving: boolean

  constructor() {
    super();
    this.observer = null;
    this.isObserving = false;
  }

  waitRenderChannelList() {
    return new Promise((resolve, reject) => {
      const loopStartTime = Date.now();

      const checkChannelListLoop = () => {
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
      }

      checkChannelListLoop();
    });
  }

  async start() {
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

  enableObserver() {
    if (this.isObserving) {
      return;
    }
    if (!this.observer) {
      this.observer = new MutationObserver((mutations) => {
        this.emit('update');
      });
    }

    const observeTarget = document.querySelector(CHANNEL_LIST_SELECTOR);
    if (!observeTarget) {
      return;
    }
    this.observer.observe(observeTarget, {
      childList: true,
    });
    this.isObserving = true;
  }

  disableObserver() {
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
  groupingAllByPrefixOnIdle() {
    window.requestIdleCallback(() => {
      this.groupingAllByPrefix();
    }, {
      timeout: 10 * 1000
    })
  }

  groupingAllByPrefix() {
    const $channelItems = $(CHANNEL_LIST_ITEMS_SELECTOR);
    let prefixes: string[] = [];
    const regChannelMatch = /(^.+?)[-_].*/;

    if ($channelItems.length === 0) {
      return;
    }

    // Get prefixes
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

      // Store raw channel name
      if (!isApplied) {
        $channelName.data('scg-raw-channel-name', $channelName.text());
      }

      $channelName.data('scg-channel-name', channelName);
      $channelName.data('scg-channel-prefix', prefix);
      prefixes[index] = prefix;
    });

    // Find channels with same name as prefix
    $channelItems.each(function (index: number, channelItem: HTMLElement) {
      const $channelName = $(channelItem).find(CHANNEL_NAME_SELECTOR);
      const channelName: string = $channelName.data('scg-channel-name');

      if (prefixes[index + 1] === channelName) {
        prefixes[index] = channelName;
        $channelName.data('scg-channel-name', `${channelName}${CHANNEL_NAME_ROOT}`);
        $channelName.data('scg-channel-prefix', channelName);
      }
    });

    // Apply
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

(() => {
  const channelObserver = new ChannelObserver();
  const channelGrouper = new ChannelGrouper();
  channelObserver.on("update", () => {
    channelGrouper.groupingAllByPrefixOnIdle();
  });
  channelObserver.start();
})();
