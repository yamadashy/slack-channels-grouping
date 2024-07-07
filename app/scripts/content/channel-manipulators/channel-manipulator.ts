export enum ChannelItemContextGroupType {
  None = 'none',
  Parent = 'parent',
  Child = 'child',
  LastChild = 'lastChild',
  Alone = 'alone',
}

export interface ChannelItemContext {
  index: number;
  name: string;
  prefix: string | null;
  groupType: ChannelItemContextGroupType;
}

export interface ChannelManipulator {
  getChannelItemContexts(): ChannelItemContext[];
  persistChannelItemContexts(channelItemContexts: ChannelItemContext[]): void;
  updateChannelItems(channelItemContexts: ChannelItemContext[]): void;
}
