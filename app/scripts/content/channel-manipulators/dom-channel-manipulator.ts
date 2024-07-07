import {
  DATA_KEY_CHANNEL_ITEM_CONTENTS_CONTAINER_CHANNEL_TYPE,
  DATA_KEY_CHANNEL_NAME,
  DATA_KEY_CHANNEL_PREFIX,
  DATA_KEY_RAW_CHANNEL_NAME,
  SELECTOR_CHANNEL_ITEM_CONTENTS_CONTAINER,
  SELECTOR_CHANNEL_ITEM_NAME_SELECTOR,
  SELECTOR_CHANNEL_LIST_ITEMS,
} from '../dom-constants';
import $ from 'jquery/dist/jquery.slim';
import { ChannelItemContext, ChannelItemContextGroupType, ChannelManipulator } from './channel-manipulator';
import { logger } from '../logger';

const CHANNEL_NAME_ROOT = '-/';
const REGEX_CHANNEL_MATCH = /(^.+?)[-_].*/;

export class DomChannelManipulator implements ChannelManipulator {
  public getChannelItemContexts(): ChannelItemContext[] {
    const $channelItems = $(SELECTOR_CHANNEL_LIST_ITEMS);

    const channelItemContexts = Array.from($channelItems).map((channelItemElement, index): ChannelItemContext => {
      const $channelName = $(channelItemElement).find(SELECTOR_CHANNEL_ITEM_NAME_SELECTOR);
      const isAlreadyApplied = $channelName.find('span.scg').length > 0;
      let channelName: string;
      let prefix: string | null = null;

      // Get ch name
      if (isAlreadyApplied && $channelName.data(DATA_KEY_CHANNEL_NAME)) {
        channelName = $channelName.data(DATA_KEY_CHANNEL_NAME);
      } else {
        channelName = $channelName.text().trim();
        // Store raw channel name
        $channelName.data(DATA_KEY_RAW_CHANNEL_NAME, channelName);
      }

      // Get ch name prefix
      if (isAlreadyApplied && $channelName.data(DATA_KEY_CHANNEL_PREFIX)) {
        prefix = $channelName.data(DATA_KEY_CHANNEL_PREFIX);
      } else if (REGEX_CHANNEL_MATCH.test(channelName)) {
        prefix = channelName.match(REGEX_CHANNEL_MATCH)?.[1] ?? '';
      }

      return {
        index,
        name: channelName,
        prefix: prefix,
        groupType: ChannelItemContextGroupType.None,
      };
    });

    // Process for root
    channelItemContexts.forEach((context, index) => {
      const nextPrefix = channelItemContexts[index + 1]?.prefix ?? null;
      const isRoot = nextPrefix === context.name;

      if (isRoot) {
        context.prefix = context.name;
        context.name = `${context.name}${CHANNEL_NAME_ROOT}`;
        logger.labeledLog('Root channel:', context.name);
      }
    });

    return channelItemContexts;
  }

  public persistChannelItemContexts(channelItemContexts: ChannelItemContext[]): void {
    const $channelItems = $(SELECTOR_CHANNEL_LIST_ITEMS);

    channelItemContexts.forEach((context, index) => {
      const $channelName = $channelItems.eq(index).find(SELECTOR_CHANNEL_ITEM_NAME_SELECTOR);

      $channelName.data(DATA_KEY_CHANNEL_NAME, context.name);
      $channelName.data(DATA_KEY_CHANNEL_PREFIX, context.prefix);
    });
  }

  public updateChannelItems(channelItemContexts: ChannelItemContext[]): void {
    const $channelItems = $(SELECTOR_CHANNEL_LIST_ITEMS);

    $channelItems.each((index: number, channelItem: HTMLElement) => {
      const context = channelItemContexts[index];
      const $channelContentsContainer = $(channelItem).find(SELECTOR_CHANNEL_ITEM_CONTENTS_CONTAINER);
      const $channelName = $(channelItem).find(SELECTOR_CHANNEL_ITEM_NAME_SELECTOR);
      const channelItemType = $channelContentsContainer.attr(DATA_KEY_CHANNEL_ITEM_CONTENTS_CONTAINER_CHANNEL_TYPE);
      const prefix: string | null = context.prefix;
      const isParent = context.groupType === ChannelItemContextGroupType.Parent;
      const isLastChild = context.groupType === ChannelItemContextGroupType.LastChild;
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
      if (prefix === null) {
        return;
      }

      if (context.groupType === ChannelItemContextGroupType.Alone) {
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
            $('<span>')
              .addClass('scg scg-ch-prefix')
              .text(prefix ?? ''),
            $('<span>')
              .addClass('scg scg-ch-separator ' + separatorPseudoClass)
              .text(separator),
            $('<span>')
              .addClass('scg scg-ch-name')
              .text(context.name.replace(/(^.+?)[-_](.*)/, '$2')),
          ]);
      }
    });
  }
}
