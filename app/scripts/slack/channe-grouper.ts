// modules
import * as $ from 'jquery';
import 'requestidlecallback-polyfill';
import { CHANNEL_LIST_ITEMS_SELECTOR, CHANNEL_NAME_SELECTOR } from './selectors';

// constants
const CHANNEL_NAME_ROOT = '-/';

/**
 * Channel Grouping Class
 */
export default class ChannelGrouper {
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
          .append([
            $('<span>').addClass('scg scg-ch-prefix').text(prefix),
            $('<span>').addClass('scg scg-ch-separator').text(separator),
            $('<span>').addClass('scg scg-ch-name').text($channelName.data('scg-channel-name').replace(/(^.+?)[-_](.*)/, '$2'))
          ]);
      }
    });
  }
}
