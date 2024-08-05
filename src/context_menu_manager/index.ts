import EditorModel from '../editor/model/Editor';
import MenuItem from './model/MenuItem';
import MenuItemsView from './view/MenuItemsView';
import MenuItems from './model/MenuItems';
import { ItemManagerModule } from '../abstract/Module';
import defaults, { ContextMenuManagerConfig } from './config/config';
import Component from '../dom_components/model/Component';

export default class ContextMenuManager extends ItemManagerModule<
  ContextMenuManagerConfig,
  /** @ts-ignore */
  MenuItems
> {
  storageKey = '';
  menuItems: MenuItems;
  menuItemView: MenuItemsView;

  constructor(em: EditorModel) {
    const defaultItems = defaults.menuItems || [];
    const defaultContextMenu = new MenuItems(defaultItems, { em });
    super(em, 'ContextMenuManager', defaultContextMenu, {}, defaults);

    this.menuItems = this.all || [];
    this.menuItemView = new MenuItemsView({
      collection: this.menuItems,
      em: this.em,
    });
    this.em.on('canvas:contextmenu:close', this.close, this);
    this.em.on('canvas:contextmenu', this.open, this);
    this.em.on('component:select', () => {
      this.em.trigger('canvas:contextmenu:close');
    });
    return this;
  }

  renderMenu = () => {
    if (!this.menuItemView) {
      this.menuItemView = new MenuItemsView({
        collection: this.menuItems,
        em: this.em,
      });
    }
    const el = this.menuItemView.render().el;
    el.classList.add('context-menu');
    document.body.appendChild(el);
  };

  destroy() {
    this.menuItemView?.remove();
  }

  open(component: Component, event: PointerEvent) {
    if (this.menuItemView) {
      this.menuItemView.remove();
    }
    const position = {
      top: event.y,
      left: event.x,
    };
    this.menuItems.position = position;
    this.menuItemView = new MenuItemsView({
      collection: this.menuItems,
      em: this.em,
    });
    this.renderMenu();
  }

  close() {
    this.menuItemView && this.menuItemView.remove();
  }
}
