// modules
import * as $ from 'jquery';

// constants
const CHANNEL_LIST_SELECTOR = '.p-channel_sidebar__static_list';
const CHANNEL_LIST_ITEMS_SELECTOR = CHANNEL_LIST_SELECTOR + ' [role=listitem]';
const CHANNEL_NAME_SELECTOR = '.p-channel_sidebar__name';

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
 * Channel Grouping Class
 */
class ChannelGrouper {
  observer: MutationObserver
  isObserving: boolean

  constructor() {
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
          return;
        }

        setTimeout(checkChannelListLoop, 100);
      }

      checkChannelListLoop();
    });
  }

  start() {
    this.groupingAllByPrefixOnIdle();

    window.addEventListener("blur", () => {
      this.disableObserver();
    }, false);
    window.addEventListener("focus", () => {
      this.groupingAllByPrefixOnIdle();
      this.enableObserver();
    }, false)
  }

  enableObserver() {
    if (this.isObserving) {
      return;
    }
    if (!this.observer) {
      this.observer = new MutationObserver((mutations) => {
        this.groupingAllByPrefixOnIdle();
      });
    }

    this.observer.observe(document.querySelector(CHANNEL_LIST_SELECTOR), {
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

      $channelName.data('scg-channel-name', channelName);
      $channelName.data('scg-channel-prefix', prefix);
      prefixes[index] = prefix;
    });

    // Apply
    $channelItems.each(function (index: number, channelItem: HTMLElement) {
      const $channelName = $(channelItem).find(CHANNEL_NAME_SELECTOR);
      const prefix: string = prefixes[index];
      const isLoneliness = prefixes[index - 1] !== prefix && prefixes[index + 1] !== prefix;
      const isParent = prefixes[index - 1] !== prefix && prefixes[index + 1] === prefix;
      const isLastChild = prefixes[index - 1] === prefix && prefixes[index + 1] !== prefix;
      let separator = '';

      if (isLoneliness || prefixes[index] === '') {
        return;
      }

      if (isParent) {
        separator = '┬';
      } else if (isLastChild) {
        separator = '└';
      } else {
        separator = '├';
      }

      $channelName
        .empty()
        .removeClass('scg-ch-parent scg-ch-child')
        .addClass(isParent ? 'scg-ch-parent' : 'scg-ch-child')
        .append($('<span>').addClass('scg-ch-prefix').text(prefix))
        .append($('<span>').addClass('scg-ch-separator').text(separator))
        .append($('<span>').addClass('scg-ch-name').text($channelName.data('scg-channel-name').replace(/(^.+?)[-_](.*)/, '$2')));
    });
  }
}

(async () => {
  const channelGrouper = new ChannelGrouper();
  await channelGrouper.waitRenderChannelList();
  channelGrouper.start();
})();
