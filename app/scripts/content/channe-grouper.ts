// modules
import $ from 'jquery/dist/jquery.slim';
import 'requestidlecallback-polyfill';
import * as domConstants from './dom-constants';
import { DATA_KEY_CHANNEL_NAME, DATA_KEY_CHANNEL_PREFIX, DATA_KEY_RAW_CHANNEL_NAME } from './dom-constants';

// constants
const CHANNEL_NAME_ROOT = '-/';
const GROUPING_IDLE_CALLBACK_TIMEOUT = 3 * 1000;

/**
 * Channel Grouping Class
 */
export default class ChannelGrouper {
  private idleCallbackId: number | null;

  constructor() {
    this.idleCallbackId = null;
  }

  groupingAllByPrefixOnIdle(): void {
    if (this.idleCallbackId !== null) {
      window.cancelIdleCallback(this.idleCallbackId);
    }

    this.idleCallbackId = window.requestIdleCallback(
      () => {
        this.groupingAllByPrefix();
      },
      {
        timeout: GROUPING_IDLE_CALLBACK_TIMEOUT,
      },
    );
  }

  protected groupingAllByPrefix(): void {
    const $channelItems = $(domConstants.SELECTOR_CHANNEL_LIST_ITEMS);

    if ($channelItems.length === 0) {
      return;
    }

    let prefixes: string[] = this.getPrefixes($channelItems);
    prefixes = this.preprocessForRootChannels($channelItems, prefixes);
    this.applyGrouping($channelItems, prefixes);
  }

  protected getPrefixes($channelItems: JQuery): string[] {
    const regChannelMatch = /(^.+?)[-_].*/;
    const prefixes: string[] = [];

    $channelItems.each((index: number, channelItem: HTMLElement) => {
      const $channelName = $(channelItem).find(domConstants.SELECTOR_CHANNEL_ITEM_NAME_SELECTOR);
      const isApplied = $channelName.find('span.scg').length > 0;
      let channelName: string;
      let prefix: string;

      // Get ch name
      if (isApplied && $channelName.data(DATA_KEY_CHANNEL_NAME)) {
        channelName = $channelName.data(DATA_KEY_CHANNEL_NAME);
      } else {
        channelName = $channelName.text().trim();
        // Store raw channel name
        $channelName.data(DATA_KEY_RAW_CHANNEL_NAME, channelName);
      }

      // Get ch name prefix
      if (isApplied && $channelName.data(DATA_KEY_CHANNEL_PREFIX)) {
        prefix = $channelName.data(DATA_KEY_CHANNEL_PREFIX);
      } else if (regChannelMatch.test(channelName)) {
        prefix = channelName.match(regChannelMatch)![1];
      } else {
        prefix = '';
      }

      $channelName.data(DATA_KEY_CHANNEL_NAME, channelName);
      $channelName.data(DATA_KEY_CHANNEL_PREFIX, prefix);
      prefixes[index] = prefix;
    });

    return prefixes;
  }

  protected preprocessForRootChannels($channelItems: JQuery, prefixes: string[]): string[] {
    const retPrefixes: string[] = [];

    $channelItems.each((index: number, channelItem: HTMLElement) => {
      const $channelName = $(channelItem).find(domConstants.SELECTOR_CHANNEL_ITEM_NAME_SELECTOR);
      const channelName: string = $channelName.data(DATA_KEY_CHANNEL_NAME);
      const isRoot = prefixes[index + 1] === channelName;

      if (isRoot) {
        retPrefixes[index] = channelName;
        $channelName.data(DATA_KEY_CHANNEL_NAME, `${channelName}${CHANNEL_NAME_ROOT}`);
        $channelName.data(DATA_KEY_CHANNEL_PREFIX, channelName);
      } else {
        retPrefixes[index] = prefixes[index];
      }
    });

    return retPrefixes;
  }

  protected applyGrouping($channelItems: JQuery, prefixes: string[]): void {
    $channelItems.each((index: number, channelItem: HTMLElement) => {
      const $channelContentsContainer = $(channelItem).find(domConstants.SELECTOR_CHANNEL_ITEM_CONTENTS_CONTAINER);
      const $channelName = $(channelItem).find(domConstants.SELECTOR_CHANNEL_ITEM_NAME_SELECTOR);
      const channelItemType = $channelContentsContainer.attr(
        domConstants.DATA_KEY_CHANNEL_ITEM_CONTENTS_CONTAINER_CHANNEL_TYPE,
      );
      const prefix: string = prefixes[index];
      const isLoneliness = prefixes[index - 1] !== prefix && prefixes[index + 1] !== prefix;
      const isParent = prefixes[index - 1] !== prefix && prefixes[index + 1] === prefix;
      const isLastChild = prefixes[index - 1] === prefix && prefixes[index + 1] !== prefix;
      let separator = '';

      // Skip direct message
      if (channelItemType === 'im') {
        return;
      }

      // Skip blank item
      if ($channelName.length === 0) {
        return;
      }

      // Skip no prefix
      if (prefixes[index] === '') {
        return;
      }

      if (isLoneliness) {
        $channelName.removeClass('scg-ch-parent scg-ch-child').text($channelName.data(DATA_KEY_RAW_CHANNEL_NAME));
      } else {
        let separatorPseudoClass: string;

        if (isParent) {
          separator = '┬';
          separatorPseudoClass = 'scg-ch-separator-pseudo-bottom';
        } else if (isLastChild) {
          separator = '└';
          separatorPseudoClass = 'scg-ch-separator-pseudo-top';
        } else {
          separator = '├';
          separatorPseudoClass = 'scg-ch-separator-pseudo-both';
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
            $('<span>')
              .addClass('scg scg-ch-separator ' + separatorPseudoClass)
              .text(separator),
            $('<span>')
              .addClass('scg scg-ch-name')
              .text($channelName.data(DATA_KEY_CHANNEL_NAME).replace(/(^.+?)[-_](.*)/, '$2')),
          ]);
      }
    });
  }
}
