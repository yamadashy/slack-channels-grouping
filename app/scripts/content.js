import $ from 'jquery';

const CHANNEL_LIST_CLASS_NAME = '.p-channel_sidebar__static_list';

class ChannelGrouper {
  constructor() {
    this.observer = null;
  }

  waitRenderChannelList() {
    return new Promise((resolve, reject) => {
      const loopStartTime = Date.now();

      const checkChannelListLoop = () => {
        if (document.querySelectorAll(CHANNEL_LIST_CLASS_NAME + ' [role=listitem]').length > 0) {
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
    document.addEventListener("visibilitychange", () => {
      const isHidden = document.hidden;

      if (isHidden) {
        this.disableObserver();
      } else {
        this.groupingAllByPrefix();
        this.enableObserver();
      }
    });
  }

  enableObserver() {
    if (!this.observer) {
      this.observer = new MutationObserver((mutations) => {
        this.groupingAllByPrefix();
      });
    }

    this.observer.observe(document.querySelector(CHANNEL_LIST_CLASS_NAME), {
      childList: true,
    });
  }

  disableObserver() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  groupingAllByPrefix() {
    const $channelItems = $(CHANNEL_LIST_CLASS_NAME + ' [role=listitem]');
    let prefixes = [];
    const regChannelMatch = /(^.+?)[-_].*/;

    // Get prefixes
    $channelItems.each(function (index, channelItem) {
      const $span = $(channelItem).find('a > span');
      const isApplied = $span.find('span').length > 0;
      let channelName = '';
      let prefix = '';

      // Get ch name
      if (isApplied && $span.data('scg-channel-name')) {
        channelName = $span.data('scg-channel-name');
      } else {
        channelName = $.trim($span.text());
      }

      // Get ch name prefix
      if (isApplied && $span.data('scg-channel-prefix')) {
        prefix = $span.data('scg-channel-prefix');
      } else {
        if (regChannelMatch.test(channelName)) {
          prefix = channelName.match(regChannelMatch)[1];
        } else {
          prefix = '';
        }
      }

      $span.data('scg-channel-name', channelName);
      $span.data('scg-channel-prefix', prefix);
      prefixes[index] = prefix;
    });

    // Apply
    $channelItems.each(function (index, channelItem) {
      const $span = $(channelItem).find('a > span');
      const prefix = prefixes[index];
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

      $span
        .empty()
        .removeClass('scg-ch-parent scg-ch-child')
        .addClass(isParent ? 'scg-ch-parent' : 'scg-ch-child')
        .append($('<span>').addClass('scg-ch-prefix').text(prefix))
        .append($('<span>').addClass('scg-ch-separator').text(separator))
        .append($('<span>').addClass('scg-ch-name').text($span.data('scg-channel-name').replace(/(^.+?)[-_](.*)/, '$2')));
    });
  }
}

(async () => {
  const channelGrouper = new ChannelGrouper();
  await channelGrouper.waitRenderChannelList();
  channelGrouper.start();
})();
