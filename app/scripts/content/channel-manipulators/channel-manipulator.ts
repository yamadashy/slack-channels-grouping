export enum ChannelItemContextGroupType {
  Parent = 'parent',
  Child = 'child',
  LastChild = 'lastChild',
  Alone = 'alone',
}

export type ChannelItemType = 'channel' | 'private' | 'im' | 'mpim';

export interface ChannelItemContext {
  index: number;
  name: string;
  channelItemType: ChannelItemType | null;
}

export interface GroupedChannelItemContext extends ChannelItemContext {
  prefix: string | null;
  groupType: ChannelItemContextGroupType;
}

export interface ChannelManipulator {
  getChannelItemContexts(): ChannelItemContext[];
  persistGroupedChannelItemContexts(channelItemContexts: GroupedChannelItemContext[]): void;
  updateChannelItems(channelItemContexts: GroupedChannelItemContext[]): void;
}
