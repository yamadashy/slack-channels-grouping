import $ from "jquery";

class ChannelGrouper {
    constructor() {
        this.$channelItems = $(".p-channel_sidebar__static_list [role=listitem]");
    }

    groupingAllByPrefix() {
        var previousPrefix = "";
        let prefixes = [];

        this.$channelItems.each(function (index, elem) {
            var $item = $(elem)
            var $span = $item.find("a > span");
            var channelName = $.trim($span.text());

            if (/^.+?[-_].*/.test(channelName)) {
                const prefix = channelName.match(/(^.+?)[-_].*/)[1];
                prefixes[index] = prefix;
            }
        });

        this.$channelItems.each(function (index, elem) {
            var $item = $(elem)
            var $span = $item.find("a > span");
            var channelName = $.trim($span.text());

            if (/^.+?[-_].*/.test(channelName)) {
                const prefix = prefixes[index];
                const isLoneliness = prefixes[index - 1] !== prefix && prefixes[index + 1] !== prefix;

                if (isLoneliness) {
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
            }
        });
    }
}

setTimeout(function () {
    const channelGrouper = new ChannelGrouper();
    channelGrouper.groupingAllByPrefix();
}, 3000);
