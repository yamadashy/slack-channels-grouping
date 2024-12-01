// modules
import 'requestidlecallback-polyfill';
import { logger } from './logger';
import {
  ChannelItemContext,
  ChannelItemContextGroupType,
  ChannelManipulator,
  ConnectedGroupedChannelItemContext,
  ConnectionType,
  GroupedChannelItemContext,
  hasDownConnection,
  hasLeftConnection,
  hasUpConnection,
  removeDownConnection,
  removeRightConnection,
} from './channel-manipulators/channel-manipulator';

// constants
const GROUPING_IDLE_CALLBACK_TIMEOUT = 3 * 1000;
const UPDATE_CHANNEL_LIST_MIN_INTERVAL = 200;
const REGEX_CHANNEL_MATCH = /(^.+?)[-_]/;
const REGEX_CHANNEL_MATCH_FOR_SPLIT = /[-_]/;
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

  private applyGroupingToContexts(channelItemContexts: ChannelItemContext[]): ConnectedGroupedChannelItemContext[] {
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

    // Grouping
    const items = channelItemContexts.map((context, index): GroupedChannelItemContext => {
      // If channelItemType is 'im' or 'mpim', skip grouping
      if (context.channelItemType === 'im' || context.channelItemType === 'mpim') {
        return {
          ...context,
          prefix: null,
          prefix2: null,
          prefix3: null,
        };
      }
      const split = context.name.split(REGEX_CHANNEL_MATCH_FOR_SPLIT);
      return {
        ...context,
        prefix: split[0] || null,
        prefix2: split[1] || null,
        prefix3: split[2] || null,
      };
    });
    let connectedItems = items.map((context, index): ConnectedGroupedChannelItemContext => {
      // If channelItemType is 'im' or 'mpim', skip grouping
      if (context.channelItemType === 'im' || context.channelItemType === 'mpim') {
        return {
          ...context,
          connection1: null,
          connection2: null,
          connection3: null,
        };
      }
      const prev = items[index - 1];
      const next = items[index + 1];

      let connection1: ConnectionType | null = null;
      if (context.prefix != prev?.prefix && context.prefix != next?.prefix) {
        connection1 = null;
      } else if (context.prefix != prev?.prefix && context.prefix == next?.prefix) {
        connection1 = '┬';
      } else if (context.prefix == prev?.prefix && context.prefix == next?.prefix) {
        connection1 = '├';
      } else if (context.prefix == prev?.prefix && context.prefix != next?.prefix) {
        connection1 = '└';
      }

      let connection2: ConnectionType | null = null;
      if (connection1 == null) {
        connection2 = null;
      } else if (context.prefix2 == null || context.prefix2 != prev?.prefix2 && context.prefix2 != next?.prefix2) {
        connection2 = null;
      } else if (context.prefix2 != prev?.prefix2 && context.prefix2 == next?.prefix2) {
        connection2 = '┬';
      } else if (context.prefix2 == prev?.prefix2 && context.prefix2 == next?.prefix2) {
        connection2 = '├';
      } else if (context.prefix2 == prev?.prefix2 && context.prefix2 != next?.prefix2) {
        connection2 = '└';
      }

      let connection3: ConnectionType | null = null;
      if (connection1 == null || connection2 == null) {
        connection2 = null;
      } else if (context.prefix3 == null || context.prefix3 != prev?.prefix3 && context.prefix3 != next?.prefix3) {
        connection3 = null;
      } else if (context.prefix3 != prev?.prefix3 && context.prefix3 == next?.prefix3) {
        connection3 = '┬';
      } else if (context.prefix3 == prev?.prefix3 && context.prefix3 == next?.prefix3) {
        connection3 = '├';
      } else if (context.prefix3 == prev?.prefix3 && context.prefix3 != next?.prefix3) {
        connection3 = '└';
      }

      return {
        ...context,
          connection1,
          connection2,
          connection3,
      };
    });

    // change connections
    connectedItems = connectedItems.reverse().map((context, index): ConnectedGroupedChannelItemContext => {
      // If channelItemType is 'im' or 'mpim', skip grouping
      if (context.channelItemType === 'im' || context.channelItemType === 'mpim') {
        return {
          ...context,
          connection1: null,
          connection2: null,
          connection3: null,
        };
      }
      const prev = connectedItems[index + 1]; // reversed array
      const next = connectedItems[index - 1];

      if (context.connection3 !== null && !hasLeftConnection(context.connection3)) {
        context.connection2 = removeRightConnection(context.connection2);
        context.connection1 = removeRightConnection(context.connection1);
      }
      if (context.connection2 !== null && !hasLeftConnection(context.connection2)) {
        context.connection1 = removeRightConnection(context.connection1);
      }

      if (hasDownConnection(context.connection1!) && !hasUpConnection(next?.connection1!)) {
        context.connection1 = removeDownConnection(context.connection1)
      }
      if (hasDownConnection(context.connection2!) && !hasUpConnection(next?.connection2!)) {
        context.connection2 = removeDownConnection(context.connection2)
      }
      if (hasDownConnection(context.connection3!) && !hasUpConnection(next?.connection3!)) {
        context.connection3 = removeDownConnection(context.connection3)
      }

      if (context.connection1 === '┬' && context.prefix2 == null) {
        context.connection1 = '┐';
      }
      if (context.connection2 === '┬' && context.prefix3 == null) {
        context.connection2 = '┐';
      }
      if (context.connection3 === '┬' && context.name.substring(context.prefix!.length + 1 + context.prefix2!.length + 1 + context.prefix3!.length).length === 0) {
        context.connection3 = '┐';
      }

      return context;
    }).reverse();
    return connectedItems;
  }
}
