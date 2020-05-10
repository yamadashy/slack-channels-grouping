const CHANNEL_LIST_SELECTOR = '.p-channel_sidebar__static_list';

// selectors
export const CHANNEL_LIST_CONTAINER_SELECTOR = CHANNEL_LIST_SELECTOR + ' .c-virtual_list__scroll_container';
export const CHANNEL_LIST_ITEMS_SELECTOR = CHANNEL_LIST_SELECTOR + ' [role=listitem], ' + CHANNEL_LIST_SELECTOR + ' [role=treeitem]';
export const CHANNEL_ITEM_CONTENTS_CONTAINER = '.p-channel_sidebar__channel';
export const CHANNEL_ITEM_NAME_SELECTOR = '.p-channel_sidebar__name';

// data attr
export const DATA_CHANNEL_ITEM_CONTENTS_CONTAINER_CHANNEL_TYPE = 'data-qa-channel-sidebar-channel-type';

// data attr for extension
export const DATA_KEY_BODY_EXTENSION_APPLIED_FLAG = 'data-slack-channels-grouping-applied';
export const DATA_KEY_RAW_CHANNEL_NAME = 'data-scg-raw-channel-name';
export const DATA_KEY_CHANNEL_NAME = 'data-scg-channel-name';
export const DATA_KEY_CHANNEL_PREFIX = 'scg-channel-prefix';
