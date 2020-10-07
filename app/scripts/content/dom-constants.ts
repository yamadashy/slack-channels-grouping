const SELECTOR_CHANNEL_LIST = '.p-channel_sidebar__static_list';

// selectors
export const SELECTOR_CHANNEL_LIST_CONTAINER = SELECTOR_CHANNEL_LIST + ' .c-virtual_list__scroll_container';
export const SELECTOR_CHANNEL_LIST_ITEMS =
  SELECTOR_CHANNEL_LIST + ' [role=listitem], ' + SELECTOR_CHANNEL_LIST + ' [role=treeitem]';
export const SELECTOR_CHANNEL_ITEM_CONTENTS_CONTAINER = '.p-channel_sidebar__channel';
export const SELECTOR_CHANNEL_ITEM_NAME_SELECTOR = '.p-channel_sidebar__name';

// data attr key
export const DATA_KEY_CHANNEL_ITEM_CONTENTS_CONTAINER_CHANNEL_TYPE = 'data-qa-channel-sidebar-channel-type';

// data attr key for extension
export const DATA_KEY_RAW_CHANNEL_NAME = 'data-scg-raw-channel-name';
export const DATA_KEY_CHANNEL_NAME = 'data-scg-channel-name';
export const DATA_KEY_CHANNEL_PREFIX = 'scg-channel-prefix';
