import $ from "jquery";

class ChannelGrouper {
    constructor() {
        this.$channelItems = $(".p-channel_sidebar__static_list [role=listitem]");
        this.selectedChannelFontColor = "#ffffff";
        this.selectedChannelBGColor = "#000000";
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
        const regContainPrefix = /(\w+)[-_].+/;

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
            .css({
                backgroundColor: this.selectedChannelBGColor,
                color: this.selectedChannelFontColor
            })
            // .append($("<i>").addClass("ts_icon ts_icon_user_groups"))
            .append($("<span>").text(groupName));

        groupingWrapper
            .addClass("scg-grouping-wrapper")
            .css({
                // backgroundColor: this._replaceRGBColorWithOpacity(this.selectedChannelBGColor, 0.2),
                background: `linear-gradient(to left, ${this._replaceRGBColorWithOpacity(this.selectedChannelBGColor, 0.2)}, transparent)`,
                borderColor: this.selectedChannelBGColor
            })
            .insertBefore(this.$channelItems.eq(start))
            .append(groupingWrapperHeader)
            .append(this.$channelItems.slice(start, end));
    }

    _replaceRGBColorWithOpacity(rgbValue = "rgba(255, 255, 255, 1)", opacity) {
        return rgbValue.replace(")", `,${opacity})`).replace('rgb', 'rgba')
    }
}

setTimeout(function () {
    const channelGrouper = new ChannelGrouper();
    channelGrouper.groupingAllByPrefix();
}, 3000);
