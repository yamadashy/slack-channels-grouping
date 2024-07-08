import { describe, it, expect } from 'vitest';
import ChannelGrouper from '../app/scripts/content/channel-grouper';
import {
  ChannelItemContext,
  ChannelItemContextGroupType,
  ChannelManipulator,
  GroupedChannelItemContext,
} from '../app/scripts/content/channel-manipulators/channel-manipulator';

class MockChannelManipulator implements ChannelManipulator {
  private channels: ChannelItemContext[] = [];
  private groupedChannels: GroupedChannelItemContext[] = [];

  getChannelItemContexts(): ChannelItemContext[] {
    return this.channels;
  }

  persistGroupedChannelItemContexts(channelItemContexts: GroupedChannelItemContext[]): void {
    this.groupedChannels = channelItemContexts;
  }

  updateChannelItems(channelItemContexts: GroupedChannelItemContext[]): void {
    this.groupedChannels = channelItemContexts;
  }

  getGroupedChannelItemContexts(): GroupedChannelItemContext[] {
    return this.groupedChannels;
  }

  setChannels(channels: ChannelItemContext[]): void {
    this.channels = channels;
  }
}

describe('ChannelGrouper test with multiple scenarios', () => {
  const testCases: {
    name: string;
    channels: ChannelItemContext[];
    expected: Partial<GroupedChannelItemContext>[];
  }[] = [
    {
      name: 'only one channel',
      channels: [{ index: 0, name: 'general', channelItemType: 'channel' }],
      expected: [{ prefix: null, groupType: ChannelItemContextGroupType.Alone }],
    },
    {
      name: 'should group channels correctly with various patterns',
      channels: [
        { index: 0, name: 'general', channelItemType: 'channel' },
        { index: 1, name: 'prefix-aaa', channelItemType: 'channel' },
        { index: 2, name: 'prefix-bbb', channelItemType: 'channel' },
        { index: 3, name: 'prefix-ccc', channelItemType: 'channel' },
        { index: 4, name: 'another-xxx', channelItemType: 'channel' },
        { index: 5, name: 'another-yyy', channelItemType: 'channel' },
        { index: 6, name: 'solo-aaa', channelItemType: 'channel' },
        { index: 7, name: 'random', channelItemType: 'channel' },
      ],
      expected: [
        { prefix: null, groupType: ChannelItemContextGroupType.Alone },
        { prefix: 'prefix', groupType: ChannelItemContextGroupType.Parent },
        { prefix: 'prefix', groupType: ChannelItemContextGroupType.Child },
        { prefix: 'prefix', groupType: ChannelItemContextGroupType.LastChild },
        { prefix: 'another', groupType: ChannelItemContextGroupType.Parent },
        { prefix: 'another', groupType: ChannelItemContextGroupType.LastChild },
        { prefix: 'solo', groupType: ChannelItemContextGroupType.Alone },
        { prefix: null, groupType: ChannelItemContextGroupType.Alone },
      ],
    },
    {
      name: 'should handle all channels without prefix',
      channels: [
        { index: 0, name: 'general', channelItemType: 'channel' },
        { index: 1, name: 'random', channelItemType: 'channel' },
        { index: 2, name: 'announcements', channelItemType: 'channel' },
      ],
      expected: [
        { prefix: null, groupType: ChannelItemContextGroupType.Alone },
        { prefix: null, groupType: ChannelItemContextGroupType.Alone },
        { prefix: null, groupType: ChannelItemContextGroupType.Alone },
      ],
    },
    {
      name: 'should handle single group correctly',
      channels: [
        { index: 0, name: 'prefix-aaa', channelItemType: 'channel' },
        { index: 1, name: 'prefix-bbb', channelItemType: 'channel' },
      ],
      expected: [
        { prefix: 'prefix', groupType: ChannelItemContextGroupType.Parent },
        { prefix: 'prefix', groupType: ChannelItemContextGroupType.LastChild },
      ],
    },
    {
      name: 'should handle multiple different prefixes',
      channels: [
        { index: 0, name: 'a-1', channelItemType: 'channel' },
        { index: 1, name: 'b-1', channelItemType: 'channel' },
        { index: 2, name: 'c-1', channelItemType: 'channel' },
        { index: 3, name: 'a-2', channelItemType: 'channel' },
      ],
      expected: [
        { prefix: 'a', groupType: ChannelItemContextGroupType.Alone },
        { prefix: 'b', groupType: ChannelItemContextGroupType.Alone },
        { prefix: 'c', groupType: ChannelItemContextGroupType.Alone },
        { prefix: 'a', groupType: ChannelItemContextGroupType.Alone },
      ],
    },
    {
      name: 'should handle mix of prefixed and non-prefixed channels',
      channels: [
        { index: 0, name: 'general', channelItemType: 'channel' },
        { index: 1, name: 'a-1', channelItemType: 'channel' },
        { index: 2, name: 'a-2', channelItemType: 'channel' },
        { index: 3, name: 'random', channelItemType: 'channel' },
      ],
      expected: [
        { prefix: null, groupType: ChannelItemContextGroupType.Alone },
        { prefix: 'a', groupType: ChannelItemContextGroupType.Parent },
        { prefix: 'a', groupType: ChannelItemContextGroupType.LastChild },
        { prefix: null, groupType: ChannelItemContextGroupType.Alone },
      ],
    },
    {
      name: 'should handle single channel groups (Alone cases)',
      channels: [
        { index: 0, name: 'a-1', channelItemType: 'channel' },
        { index: 1, name: 'b-1', channelItemType: 'channel' },
        { index: 2, name: 'c-1', channelItemType: 'channel' },
      ],
      expected: [
        { prefix: 'a', groupType: ChannelItemContextGroupType.Alone },
        { prefix: 'b', groupType: ChannelItemContextGroupType.Alone },
        { prefix: 'c', groupType: ChannelItemContextGroupType.Alone },
      ],
    },
    {
      name: 'should handle prefixes starting with numbers',
      channels: [
        { index: 0, name: '1-project-a', channelItemType: 'channel' },
        { index: 1, name: '1-project-b', channelItemType: 'channel' },
        { index: 2, name: '2-project-a', channelItemType: 'channel' },
      ],
      expected: [
        { prefix: '1', groupType: ChannelItemContextGroupType.Parent },
        { prefix: '1', groupType: ChannelItemContextGroupType.LastChild },
        { prefix: '2', groupType: ChannelItemContextGroupType.Alone },
      ],
    },
    {
      name: 'should handle prefixes with special characters',
      channels: [
        { index: 0, name: 'a_b-1', channelItemType: 'channel' },
        { index: 1, name: 'a_b-2', channelItemType: 'channel' },
        { index: 2, name: 'a.c-1', channelItemType: 'channel' },
      ],
      expected: [
        { prefix: 'a', groupType: ChannelItemContextGroupType.Parent },
        { prefix: 'a', groupType: ChannelItemContextGroupType.LastChild },
        { prefix: 'a.c', groupType: ChannelItemContextGroupType.Alone },
      ],
    },
    {
      name: 'should handle very long channel names',
      channels: [
        { index: 0, name: 'very-long-prefix-'.repeat(10) + '1', channelItemType: 'channel' },
        { index: 1, name: 'very-long-prefix-'.repeat(10) + '2', channelItemType: 'channel' },
      ],
      expected: [
        { prefix: 'very', groupType: ChannelItemContextGroupType.Parent },
        { prefix: 'very', groupType: ChannelItemContextGroupType.LastChild },
      ],
    },
    {
      name: 'should handle large number of channels',
      channels: Array.from({ length: 1000 }, (_, i) => ({
        index: i,
        name: `prefix-${i}`,
        channelItemType: 'channel',
      })),
      expected: [
        { prefix: 'prefix', groupType: ChannelItemContextGroupType.Parent },
        ...Array(998).fill({ prefix: 'prefix', groupType: ChannelItemContextGroupType.Child }),
        { prefix: 'prefix', groupType: ChannelItemContextGroupType.LastChild },
      ],
    },
    {
      name: 'should group channels with same prefix regardless of different structure',
      channels: [
        { index: 0, name: 'prefix-a', channelItemType: 'channel' },
        { index: 1, name: 'prefix-b-c', channelItemType: 'channel' },
      ],
      expected: [
        { prefix: 'prefix', groupType: ChannelItemContextGroupType.Parent },
        { prefix: 'prefix', groupType: ChannelItemContextGroupType.LastChild },
      ],
    },
    {
      name: 'should handle empty channel list',
      channels: [],
      expected: [],
    },
    {
      name: 'should group channels with including im channels',
      channels: [
        { index: 0, name: 'prefix-a', channelItemType: 'channel' },
        { index: 1, name: 'im-1', channelItemType: 'im' },
        { index: 2, name: 'im-2', channelItemType: 'im' },
        { index: 3, name: 'prefix-b-c', channelItemType: 'channel' },
        { index: 4, name: 'prefix-b-d', channelItemType: 'channel' },
        { index: 5, name: 'mpim-1', channelItemType: 'mpim' },
        { index: 6, name: 'mpim-2', channelItemType: 'mpim' },
        { index: 7, name: 'prefix-b-c', channelItemType: 'channel' },
      ],
      expected: [
        { prefix: 'prefix', groupType: ChannelItemContextGroupType.Alone },
        { prefix: null, groupType: ChannelItemContextGroupType.Alone },
        { prefix: null, groupType: ChannelItemContextGroupType.Alone },
        { prefix: 'prefix', groupType: ChannelItemContextGroupType.Parent },
        { prefix: 'prefix', groupType: ChannelItemContextGroupType.LastChild },
        { prefix: null, groupType: ChannelItemContextGroupType.Alone },
        { prefix: null, groupType: ChannelItemContextGroupType.Alone },
        { prefix: 'prefix', groupType: ChannelItemContextGroupType.Alone },
      ],
    },
    {
      name: 'should handle realistic channel grouping scenario',
      channels: [
        { index: 0, name: 'a-b-c-a', channelItemType: 'channel' },
        { index: 1, name: 'a-b-c-a-c', channelItemType: 'channel' },
        { index: 2, name: 'chat-cat-c', channelItemType: 'channel' },
        { index: 3, name: 'chat-dog-ed', channelItemType: 'channel' },
        { index: 4, name: 'chat-game', channelItemType: 'channel' },
        { index: 5, name: 'chat-lunch', channelItemType: 'channel' },
        { index: 6, name: 'dev-extension', channelItemType: 'channel' },
        { index: 7, name: 'dev-readme', channelItemType: 'channel' },
        { index: 8, name: 'dev-todo', channelItemType: 'channel' },
        { index: 9, name: 'feed-tech-blog', channelItemType: 'channel' },
        { index: 10, name: 'feed-twitter', channelItemType: 'channel' },
        { index: 11, name: 'general', channelItemType: 'channel' },
        { index: 12, name: 'timeline', channelItemType: 'channel' },
        { index: 13, name: 'zzz-aaa', channelItemType: 'channel' },
        { index: 14, name: 'zzz-aac', channelItemType: 'channel' },
        { index: 15, name: 'zzz-aab', channelItemType: 'channel' },
      ],
      expected: [
        { prefix: 'a', groupType: ChannelItemContextGroupType.Parent },
        { prefix: 'a', groupType: ChannelItemContextGroupType.LastChild },
        { prefix: 'chat', groupType: ChannelItemContextGroupType.Parent },
        { prefix: 'chat', groupType: ChannelItemContextGroupType.Child },
        { prefix: 'chat', groupType: ChannelItemContextGroupType.Child },
        { prefix: 'chat', groupType: ChannelItemContextGroupType.LastChild },
        { prefix: 'dev', groupType: ChannelItemContextGroupType.Parent },
        { prefix: 'dev', groupType: ChannelItemContextGroupType.Child },
        { prefix: 'dev', groupType: ChannelItemContextGroupType.LastChild },
        { prefix: 'feed', groupType: ChannelItemContextGroupType.Parent },
        { prefix: 'feed', groupType: ChannelItemContextGroupType.LastChild },
        { prefix: null, groupType: ChannelItemContextGroupType.Alone },
        { prefix: null, groupType: ChannelItemContextGroupType.Alone },
        { prefix: 'zzz', groupType: ChannelItemContextGroupType.Parent },
        { prefix: 'zzz', groupType: ChannelItemContextGroupType.Child },
        { prefix: 'zzz', groupType: ChannelItemContextGroupType.LastChild },
      ],
    },
  ];

  testCases.forEach(({ name, channels, expected }) => {
    it(name, () => {
      const mockManipulator = new MockChannelManipulator();
      const channelGrouper = new ChannelGrouper(mockManipulator);

      mockManipulator.setChannels(channels);
      const result = channelGrouper.grouping();

      expect(result).not.toBeNull();
      if (result) {
        expect(result.length).toBe(expected.length);
        result.forEach((channel, index) => {
          expect(channel.prefix).toBe(expected[index].prefix);
          expect(channel.groupType).toBe(expected[index].groupType);
        });
      }
    });
  });
});
