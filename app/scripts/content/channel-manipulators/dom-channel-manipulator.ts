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
import {
  ChannelItemContext,
  ChannelItemContextGroupType,
  ChannelItemType,
  ChannelManipulator, ConnectedGroupedChannelItemContext, ConnectionType,
  GroupedChannelItemContext, hasLeftConnection, hasRightConnection,
} from './channel-manipulator';
import { logger } from '../logger';

export class DomChannelManipulator implements ChannelManipulator {
  public getChannelItemContexts(): ChannelItemContext[] {
    const $channelItems = $(SELECTOR_CHANNEL_LIST_ITEMS);

    const channelItemContexts = Array.from($channelItems).map((channelItemElement, index): ChannelItemContext => {
      const $channelName = $(channelItemElement).find(SELECTOR_CHANNEL_ITEM_NAME_SELECTOR);
      const $channelContentsContainer = $(channelItemElement).find(SELECTOR_CHANNEL_ITEM_CONTENTS_CONTAINER);
      const dataChannelItemType = $channelContentsContainer.attr(DATA_KEY_CHANNEL_ITEM_CONTENTS_CONTAINER_CHANNEL_TYPE);
      const channelItemType = (dataChannelItemType ?? null) as ChannelItemType;
      const isAlreadyApplied = $channelName.find('span.scg').length > 0;
      let channelName: string;

      // Get ch name
      if (isAlreadyApplied && $channelName.data(DATA_KEY_CHANNEL_NAME)) {
        channelName = $channelName.data(DATA_KEY_CHANNEL_NAME);
      } else {
        channelName = $channelName.text().trim();
      }

      return {
        index,
        name: channelName,
        channelItemType,
      };
    });

    return channelItemContexts;
  }

  public persistGroupedChannelItemContexts(channelItemContexts: GroupedChannelItemContext[]): void {
    const $channelItems = $(SELECTOR_CHANNEL_LIST_ITEMS);

    channelItemContexts.forEach((context, index) => {
      const $channelName = $channelItems.eq(index).find(SELECTOR_CHANNEL_ITEM_NAME_SELECTOR);
      $channelName.data(DATA_KEY_CHANNEL_NAME, context.name);
      $channelName.data(DATA_KEY_CHANNEL_PREFIX, context.prefix);
    });
  }

  public updateChannelItems(channelItemContexts: ConnectedGroupedChannelItemContext[]): void {
    const $channelItems = $(SELECTOR_CHANNEL_LIST_ITEMS);

    $channelItems.each((index: number, channelItem: HTMLElement) => {
      const context = channelItemContexts[index];
      const $channelName = $(channelItem).find(SELECTOR_CHANNEL_ITEM_NAME_SELECTOR);
      const channelItemType = context.channelItemType;
      const prefix: string | null = context.prefix;
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

      if (context.connection1 === null) {
        $channelName.removeClass('scg-ch-parent scg-ch-child').text($channelName.data(DATA_KEY_RAW_CHANNEL_NAME));
      } else {
        let separatorPseudoClass: string;

        // Skip no changed
        if (context.connection1 === $channelName.find('.scg-ch-separator').text()) {
          return;
        }

        $channelName
          .removeClass('scg scg-ch-parent scg-ch-child')
          .addClass(hasLeftConnection(context.connection1!) ? 'scg scg-ch-parent' : 'scg scg-ch-child')
          .empty()
          .append(this.getSpans(context));
      }
    });
  }

  getSpans(item: ConnectedGroupedChannelItemContext) {

    let regex = new RegExp(`${item.prefix}[-_]?`, "g")
    if (item.connection2 == null && item.connection3 == null) {
      return [
        $('<span>')
          .addClass('scg scg-ch-prefix')
          .text(item.prefix ?? ''),
        $('<span>')
          .addClass(this.getPseudoClass(item.connection1!))
          .text(item.connection1!),
        $('<span>')
          .addClass('scg scg-ch-name')
          .text(item.name.replace(regex, "")),
      ];
    }
    if (item.connection3 == null) {
      regex = new RegExp(`${item.prefix}[-_]${item.prefix2}[-_]?`, "g")
      logger.labeledLog(item.name, item.connection1, hasLeftConnection(item.connection1!))
      return [
        $('<span>')
          .addClass('scg ' + (hasLeftConnection(item.connection1!) ? 'scg-ch-name' : 'scg-ch-prefix'))
          .text(item.prefix ?? ''),
        $('<span>')
          .addClass(this.getPseudoClass(item.connection1!))
          .text(item.connection1!),
        $('<span>')
          .addClass('scg ' + (hasRightConnection(item.connection1!) ? 'scg-ch-name' : 'scg-ch-prefix'))
          .text(item.prefix2 ?? ''),
        $('<span>')
          .addClass(this.getPseudoClass(item.connection2!))
          .text(item.connection2!),
        $('<span>')
          .addClass('scg scg-ch-name')
          .text(item.name.replace(regex, "")),
      ];
    }
    regex = new RegExp(`${item.prefix}[-_]${item.prefix2}[-_]${item.prefix3}[-_]?`, "g")
    return [
      $('<span>')
        .addClass('scg ' + (hasLeftConnection(item.connection1!) ? 'scg-ch-name' : 'scg-ch-prefix'))
        .text(item.prefix ?? ''),
      $('<span>')
        .addClass(this.getPseudoClass(item.connection1!))
        .text(item.connection1!),
      $('<span>')
        .addClass('scg ' + (hasRightConnection(item.connection1!) ? 'scg-ch-name' : 'scg-ch-prefix'))
        .text(item.prefix2 ?? ''),
      $('<span>')
        .addClass(this.getPseudoClass(item.connection2!))
        .text(item.connection2!),
      $('<span>')
        .addClass('scg ' + (hasRightConnection(item.connection2!) ? 'scg-ch-name' : 'scg-ch-prefix'))
        .text(item.prefix3 ?? ''),
      $('<span>')
        .addClass(this.getPseudoClass(item.connection3!))
        .text(item.connection3!),
      $('<span>')
        .addClass('scg scg-ch-name')
        .text(item.name.replace(regex, "")),
    ];
  }

  getPseudoClass(conn: ConnectionType) {
    if (conn === '┬' || conn === '┐') {
      return 'scg scg-ch-separator scg-ch-separator-pseudo-bottom';
    } else if (conn === '└') {
      return 'scg scg-ch-separator scg-ch-separator-pseudo-top';
    } else if (conn === '　' || conn === '─') {
      return 'scg scg-ch-separator-no-vertical-line scg-ch-separator-pseudo-both';
    }
    return 'scg scg-ch-separator scg-ch-separator-pseudo-both';
  }
}
