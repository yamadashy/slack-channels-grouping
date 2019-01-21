import $ from "jquery";

class ChannelGrouper {
  constructor() {

  }

  waitChannelList() {
    return new Promise((resolve, reject) => {
      const loopStartTime = Date.now();

      const checkChannelListLoop = () => {
        if (document.getElementsByClassName(".p-channel_sidebar__static_list").length === 0) {
          resolve();
          return;
        }

        if (Date.now() - loopStartTime > 1000 * 10) {
          return;
        }

        setTimeout(checkChannelListLoop, 100);
      }

      checkChannelListLoop();
    });
  }

  groupingAllByPrefix() {
    const channelItems = document.querySelectorAll(".p-channel_sidebar__static_list [role=listitem]");
    let previousPrefix = "";
    let prefixes = [];

    channelItems.each(function (elem, index) {
      const $item = $(elem)
      const $span = $item.find("a > span");
      const channelName = $.trim($span.text());

      if (/^.+?[-_].*/.test(channelName)) {
        const prefix = channelName.match(/(^.+?)[-_].*/)[1];
        prefixes[index] = prefix;
      }
    });

    channelItems.each(function (elem, index) {
      const $item = $(elem)
      const $span = $item.find("a > span");
      const channelName = $.trim($span.text());
      const prefix = prefixes[index];
      const isLoneliness = prefixes[index - 1] !== prefix && prefixes[index + 1] !== prefix;

      if ($span.hasClass("scg-ch-parent") || $span.hasClass("scg-ch-child")) {
        return;
      }

      if (isLoneliness) {
        return;
      }

      if (prefixes[index] == null) {
        return;
      }

      const isParent = prefix !== previousPrefix;
      const isLastChild = prefixes[index + 1] !== prefix;
      const separator = isParent ? "┬" : (isLastChild ? "└" : "├");

      $span
        .empty()
        .addClass(isParent ? "scg-ch-parent" : "scg-ch-child")
        .append($("<span>").addClass("scg-ch-prefix").text(prefix))
        .append($("<span>").addClass("scg-ch-separator").text(separator))
        .append($("<span>").addClass("scg-ch-name").text(channelName.replace(/(^.+?)[-_](.*)/, "$2")));

      previousPrefix = prefix;
    });
  }

  watchChannelList() {
    const watchTarget = document.querySelector(".p-channel_sidebar__static_list");
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

  await channelGrouper.waitChannelList();

  channelGrouper.groupingAllByPrefix();
  // channelGrouper.watchChannelList();
})();
