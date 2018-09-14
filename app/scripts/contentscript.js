import $ from "jquery";

class ChannelGrouper {
    constructor() {
        this.$channelItems = $(".p-channel_sidebar__static_list [role=listitem]");
        this.selectedChannelFontColor = "#fff";
        this.selectedChannelBGColor = "#000";
    }

    getThemeColors() {
        const selectedChannel = $(".p-channel_sidebar__channel--selected");

        if (selectedChannel.length > 0) {
            this.selectedChannelFontColor = selectedChannel.css("color");
            this.selectedChannelBGColor = selectedChannel.css("background-color");
        }
    }

    groupingAllByPrefix() {
        this.getThemeColors();
        
        let prevPrefix = "";
        let groupStartIndex = 0;
        let groupEndIndex = 0;
        const regContainPrefix = /(\w+)-.+/;

        this.$channelItems.each((index, channelItem) => {
            const $channelItem = $(channelItem);
            const channelType = $channelItem.find("a").data("drag-type");
            const channelName = $channelItem.find("a span").text() + "";
            const isMatched = regContainPrefix.test(channelName);

            if (channelType !== "channel" || !isMatched) {
                if (index > groupStartIndex + 2) {
                    this.groupingByRange(groupStartIndex, index, prevPrefix)
                }

                prevPrefix = "";
                groupStartIndex = index;
                groupEndIndex = index;
                return
            }

            const prefix = channelName.match(regContainPrefix)[1];

            if (prefix != prevPrefix) {
                if (index > groupStartIndex + 1) {
                    this.groupingByRange(groupStartIndex, index, prevPrefix)
                }

                groupStartIndex = index;
                groupEndIndex = index;
            } else {
                groupEndIndex = index;
            }

            prevPrefix = prefix;
        });
    }

    groupingByRange(start = 0, end = 0, groupName = "-") {
        const groupingWrapper = $("<div>")
        const groupingWrapperHeader = $("<div>");
        groupingWrapperHeader
            .addClass("scg-grouping-wrapper-header")
            .text(groupName)
            .css({
                backgroundColor: this.selectedChannelBGColor,
                color: this.selectedChannelFontColor
            });
        groupingWrapper
            .addClass("scg-grouping-wrapper")
            .css({
                borderColor: this.selectedChannelBGColor
            })
            .insertBefore(this.$channelItems.eq(start))
            .append(groupingWrapperHeader)
            .append(this.$channelItems.slice(start, end));
    }
}

setTimeout(function () {
    const channelGrouper = new ChannelGrouper();
    channelGrouper.groupingAllByPrefix();
}, 3000);
