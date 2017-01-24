

export const RECEIVE_MENU = 'RECEIVE_MENU';

export const initMenu = menu => {
  type: RECEIVE_MENU,
  items: menu.items,
  types: menu.types,
  sizes: menu.sizes
}
