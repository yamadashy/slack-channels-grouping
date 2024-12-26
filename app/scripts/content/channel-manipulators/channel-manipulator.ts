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
  prefix2: string | null;
  prefix3: string | null;
}

export type ConnectionType = '┬' | '└' | '├' | '│' | "─" | '┐' | "　";
export const hasUpConnection = (conn: ConnectionType | null): boolean => {
  return conn == '└' || conn == '├' || conn == '│';
}
export const hasDownConnection = (conn: ConnectionType | null): boolean => {
  return conn == '┬' || conn == '├' || conn == '│' || conn == '┐';
}
export const hasLeftConnection = (conn: ConnectionType | null): boolean => {
  return conn == '┬' || conn == '─' || conn == '┐';
}
export const hasRightConnection = (conn: ConnectionType | null): boolean => {
  return conn == '┬' || conn == '└' || conn == '├' || conn == '─';
}
export const removeRightConnection = (conn: ConnectionType | null): ConnectionType | null => {
  if (conn === '┬') {
    return '┐';
  // } else if (conn === '└' || conn === "─") {
  //   return "　";
  } else if (conn === '├') {
    return '│';
  } else if (conn === '│') {
    return '│';
  } else if (conn === '┐') {
    return '┐';
  }
  return "　";
}

export const removeDownConnection = (conn: ConnectionType | null): ConnectionType | null => {
  // '┬' | '└' | '├' | '│' | "─" | '┐'
  if (conn === '┬') {
    return '─';
  } else if (conn === '├') {
    return '└';
  }
  return "　";
}

export interface ConnectedGroupedChannelItemContext extends GroupedChannelItemContext {
  connection1: ConnectionType | null;
  connection2: ConnectionType | null;
  connection3: ConnectionType | null;
}

export interface ChannelManipulator {
  getChannelItemContexts(): ChannelItemContext[];
  persistGroupedChannelItemContexts(channelItemContexts: GroupedChannelItemContext[]): void;
  updateChannelItems(channelItemContexts: GroupedChannelItemContext[]): void;
}
