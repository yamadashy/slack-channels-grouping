import $ from 'jquery';

const CHANNEL_LIST_CLASS_NAME = '.p-channel_sidebar__static_list';

class ChannelGrouper {
  constructor() {

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

  watchUpdateChannelList() {
    const watchTarget = document.querySelector(CHANNEL_LIST_CLASS_NAME);
    const observer = new MutationObserver((mutations) => {
      this.groupingAllByPrefix();
    });

    observer.observe(watchTarget, {
      childList: true,
    });
  }
}

(async () => {
  const channelGrouper = new ChannelGrouper();
  await channelGrouper.waitRenderChannelList();
  channelGrouper.groupingAllByPrefix();
  channelGrouper.watchUpdateChannelList();
})();
