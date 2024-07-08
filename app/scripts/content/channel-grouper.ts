// modules
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
const REGEX_CHANNEL_MATCH = /(^.+?)[-_].*/;
const CHANNEL_NAME_ROOT = '-/';

/**
 * Channel Grouping Class
 */
export default class ChannelGrouper {
  private debounceEmitUpdateTimeoutId: number | null;
  private idleCallbackId: number | null;

  constructor(private readonly adapter: ChannelManipulator) {
    this.debounceEmitUpdateTimeoutId = null;
    this.idleCallbackId = null;
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
    let prefixeMap = new Map<number, string | null>();

    // Process for root
    // If next channel name is same as prefix, rename it like 'prefix-/'
    channelItemContexts.forEach((context, index) => {
      const nextName = channelItemContexts[index + 1]?.name ?? null;
      if (nextName === null) {
        return;
      }

      const nextPrefix = nextName.match(REGEX_CHANNEL_MATCH)?.[1] ?? null;
      const isRoot = nextPrefix === context.name;

      if (isRoot) {
        context.name = `${context.name}${CHANNEL_NAME_ROOT}`;
      }
    });

    // Get prefix map
    for (const context of channelItemContexts) {
      const prefix = context.name.match(REGEX_CHANNEL_MATCH)?.[1] ?? null;
      prefixeMap.set(context.index, prefix);
    }

    // Grouping
    return channelItemContexts.map((context, index): GroupedChannelItemContext => {
      const currentPrefix = prefixeMap.get(index) ?? null;
      const prevPrefix = prefixeMap.get(index - 1) ?? null;
      const nextPrefix = prefixeMap.get(index + 1) ?? null;

      let groupType: ChannelItemContextGroupType | null = null;

      // If channelItemType is 'im' or 'mpim', skip grouping
      if (context.channelItemType === 'im' || context.channelItemType === 'mpim') {
        return {
          ...context,
          prefix: null,
          groupType: ChannelItemContextGroupType.Alone,
        };
      }

      if (currentPrefix === null || (currentPrefix !== prevPrefix && currentPrefix !== nextPrefix)) {
        groupType = ChannelItemContextGroupType.Alone;
      } else {
        if (prevPrefix !== currentPrefix && nextPrefix === currentPrefix) {
          groupType = ChannelItemContextGroupType.Parent;
        } else {
          if (nextPrefix !== currentPrefix) {
            groupType = ChannelItemContextGroupType.LastChild;
          } else {
            groupType = ChannelItemContextGroupType.Child;
          }
        }
      }

      return {
        ...context,
        prefix: currentPrefix,
        groupType,
      };
    });
  }
}
