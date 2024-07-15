import 'requestidlecallback-polyfill';
import { logger } from './logger';
import {
  ChannelItemContext,
  ChannelItemContextGroupType,
  ChannelManipulator,
  GroupedChannelItemContext,
} from './channel-manipulators/channel-manipulator';

// constants
const GROUPING_IDLE_CALLBACK_TIMEOUT = 3 * 1000;
const UPDATE_CHANNEL_LIST_MIN_INTERVAL = 200;
const CHANNEL_NAME_ROOT = '-/';

/**
 * Channel Grouping Class
 */
export default class ChannelGrouper {
  private debounceEmitUpdateTimeoutId: number | null;
  private idleCallbackId: number | null;
  private multiLevelGrouping: boolean;

  constructor(private readonly adapter: ChannelManipulator) {
    this.debounceEmitUpdateTimeoutId = null;
    this.idleCallbackId = null;
    this.multiLevelGrouping = false;

    this.loadSettingsFromStorage();

    // Set up message listener
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'settingsUpdated') {
        this.loadSettingsFromStorage();
        sendResponse({ success: true });
      }
      return true; // Needed for asynchronous response
    });
  }

  private loadSettingsFromStorage(): void {
    chrome.storage.local.get(['multiLevelGrouping'], (result) => {
      if (result.multiLevelGrouping !== undefined) {
        this.multiLevelGrouping = result.multiLevelGrouping;
        this.groupingOnIdleAndDebounce();
      }
    });
  }

  groupingOnIdleAndDebounce(): void {
    if (this.debounceEmitUpdateTimeoutId !== null) {
      window.clearTimeout(this.debounceEmitUpdateTimeoutId);
    }

    // Reduce infinity loop impact
    this.debounceEmitUpdateTimeoutId = window.setTimeout(() => {
      if (this.idleCallbackId !== null) {
        window.cancelIdleCallback(this.idleCallbackId);
      }

      this.idleCallbackId = window.requestIdleCallback(
        () => {
          this.grouping();
        },
        {
          timeout: GROUPING_IDLE_CALLBACK_TIMEOUT,
        },
      );
    }, UPDATE_CHANNEL_LIST_MIN_INTERVAL);
  }

  public grouping(): GroupedChannelItemContext[] | null {
    logger.labeledLog('Grouping all by prefix');

    let channelItemContexts = this.adapter.getChannelItemContexts();
    if (!channelItemContexts) {
      return null;
    }

    const groupedChannelItemContext = this.applyGroupingToContexts(channelItemContexts);

    logger.labeledLog('Grouped channelItemContexts:', groupedChannelItemContext);

    this.adapter.persistGroupedChannelItemContexts(groupedChannelItemContext);

    this.adapter.updateChannelItems(groupedChannelItemContext);

    return groupedChannelItemContext;
  }

  private applyGroupingToContexts(channelItemContexts: ChannelItemContext[]): GroupedChannelItemContext[] {
    let prefixMap = new Map<number, string[]>();

    // Get prefix map
    for (const context of channelItemContexts) {
      const prefixes = context.name.split(/[-_]/);
      prefixMap.set(context.index, prefixes);
    }

    // Grouping
    return channelItemContexts.map((context, index): GroupedChannelItemContext => {
      const currentPrefixes = prefixMap.get(index) ?? [];
      const prevPrefixes = prefixMap.get(index - 1) ?? [];
      const nextPrefixes = prefixMap.get(index + 1) ?? [];

      let groupType: ChannelItemContextGroupType;
      let prefix: string | null = null;

      // If channelItemType is 'im' or 'mpim', skip grouping
      if (context.channelItemType === 'im' || context.channelItemType === 'mpim') {
        return {
          ...context,
          prefix: null,
          groupType: ChannelItemContextGroupType.Alone,
        };
      }

      if (this.multiLevelGrouping) {
        const commonPrefixLength = this.getCommonPrefixLength(currentPrefixes, prevPrefixes, nextPrefixes);
        prefix = currentPrefixes.slice(0, commonPrefixLength).join('-');

        if (commonPrefixLength === 0) {
          groupType = ChannelItemContextGroupType.Alone;
        } else if (this.getCommonPrefixLength(currentPrefixes, prevPrefixes, nextPrefixes) < commonPrefixLength) {
          groupType = ChannelItemContextGroupType.Parent;
        } else if (this.getCommonPrefixLength(currentPrefixes, nextPrefixes, nextPrefixes) < commonPrefixLength) {
          groupType = ChannelItemContextGroupType.LastChild;
        } else {
          groupType = ChannelItemContextGroupType.Child;
        }
      } else {
        // Original single-level grouping logic
        prefix = currentPrefixes[0] ?? null;
        if (prefix === null || (prefix !== prevPrefixes[0] && prefix !== nextPrefixes[0])) {
          groupType = ChannelItemContextGroupType.Alone;
        } else if (prefix !== prevPrefixes[0] && prefix === nextPrefixes[0]) {
          groupType = ChannelItemContextGroupType.Parent;
        } else if (prefix !== nextPrefixes[0]) {
          groupType = ChannelItemContextGroupType.LastChild;
        } else {
          groupType = ChannelItemContextGroupType.Child;
        }
      }

      return {
        ...context,
        prefix,
        groupType,
      };
    });
  }

  private getCommonPrefixLength(current: string[], prev: string[], next: string[]): number {
    let length = 0;
    while (
      length < current.length &&
      ((length < prev.length && current[length] === prev[length]) ||
        (length < next.length && current[length] === next[length]))
    ) {
      length++;
    }
    return length;
  }
}
