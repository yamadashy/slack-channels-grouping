import $ from 'jquery/dist/jquery.slim';
import {
  DATA_KEY_CHANNEL_ITEM_CONTENTS_CONTAINER_CHANNEL_TYPE,
  DATA_KEY_CHANNEL_NAME,
  DATA_KEY_CHANNEL_PREFIX,
  DATA_KEY_RAW_CHANNEL_NAME,
  SELECTOR_CHANNEL_ITEM_CONTENTS_CONTAINER,
  SELECTOR_CHANNEL_ITEM_NAME_SELECTOR,
  SELECTOR_CHANNEL_LIST_ITEMS,
} from '../dom-constants';
import {
  type ChannelItemContext,
  ChannelItemContextGroupType,
  type ChannelItemType,
  type ChannelManipulator,
  type GroupedChannelItemContext,
} from './channel-manipulator';

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

  public updateChannelItems(channelItemContexts: GroupedChannelItemContext[]): void {
    const $channelItems = $(SELECTOR_CHANNEL_LIST_ITEMS);

    // First, clean up all existing grouping elements
    this.cleanupAllGroupingElements($channelItems);

    $channelItems.each((index: number, channelItem: HTMLElement) => {
      const context = channelItemContexts[index];
      const $channelName = $(channelItem).find(SELECTOR_CHANNEL_ITEM_NAME_SELECTOR);
      const channelItemType = context.channelItemType;
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
        this.resetChannelName($channelName, context.name);
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

        this.applyGroupingToChannelName($channelName, context, separator, separatorPseudoClass, isParent);
      }
    });
  }

  private cleanupAllGroupingElements($channelItems: JQuery<HTMLElement>): void {
    $channelItems.each((index: number, channelItem: HTMLElement) => {
      const $channelName = $(channelItem).find(SELECTOR_CHANNEL_ITEM_NAME_SELECTOR);
      if ($channelName.hasClass('scg')) {
        const originalName = $channelName.data(DATA_KEY_CHANNEL_NAME);
        if (originalName) {
          this.resetChannelName($channelName, originalName as string);
        }
      }
    });
  }

  private resetChannelName($channelName: JQuery<HTMLElement>, originalName: string): void {
    $channelName
      .removeClass('scg scg-ch-parent scg-ch-child')
      .empty()
      .text(originalName);
  }

  private applyGroupingToChannelName(
    $channelName: JQuery<HTMLElement>,
    context: GroupedChannelItemContext,
    separator: string,
    separatorPseudoClass: string,
    isParent: boolean
  ): void {
    $channelName
      .removeClass('scg scg-ch-parent scg-ch-child')
      .addClass(isParent ? 'scg scg-ch-parent' : 'scg scg-ch-child')
      .empty()
      .append([
        $('<span>')
          .addClass('scg scg-ch-prefix')
          .text(context.prefix ?? ''),
        $('<span>').addClass(`scg scg-ch-separator ${separatorPseudoClass}`).text(separator),
        $('<span>')
          .addClass('scg scg-ch-name')
          .text(context.name.replace(/(^.+?)[-_](.*)/, '$2')),
      ]);
  }
}
