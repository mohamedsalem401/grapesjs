import { View } from 'backbone';
import _ from 'underscore';
import MenuItemsView from './MenuItemsView';
import MenuItem from '../model/MenuItem';
import EditorModel from '../../editor/model/Editor';
import MenuItems from '../model/MenuItems';
import { ContextMenuManagerConfig } from '../config/config';

export default class MenuItemView extends View<MenuItem> {
  em: EditorModel;
  config: ContextMenuManagerConfig;
  pfx: string;
  submenuItems?: MenuItems;
  submenuView?: MenuItemsView;
  timeoutId?: NodeJS.Timeout;
  position?: {
    top: number;
    left: number;
  };

  template() {
    return _.template(`
    <div class="menu-item-content">
      <span class="text"><%= text %></span>
      <%= shortcut ? '<span class="shortcut">' + shortcut + '</span>' : '' %>
      <%= hasSubmenu ? '<svg viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M7.82054 20.7313C8.21107 21.1218 8.84423 21.1218 9.23476 20.7313L15.8792 14.0868C17.0505 12.9155 17.0508 11.0167 15.88 9.84497L9.3097 3.26958C8.91918 2.87905 8.28601 2.87905 7.89549 3.26958C7.50497 3.6601 7.50497 4.29327 7.89549 4.68379L14.4675 11.2558C14.8581 11.6464 14.8581 12.2795 14.4675 12.67L7.82054 19.317C7.43002 19.7076 7.43002 20.3407 7.82054 20.7313Z" fill="#0F0F0F"></path> </g></svg>' : '' %>
    </div>`);
  }

  events() {
    return {
      'click .menu-item-content': 'onClick',
      mouseenter: 'onMouseEnter',
      mouseleave: 'onMouseLeave',
    };
  }

  constructor(o: { config: ContextMenuManagerConfig; model?: MenuItem; em: EditorModel }) {
    super(o);
    const config = o.config || {};
    const { model } = this;
    // @ts-ignore
    this.config = config;
    this.em = o.em;
    this.pfx = config.stylePrefix || '';
    this.listenTo(model, 'destroy remove', this.remove);
    const children = this.model.get('children');
    if (!!children) {
      this.submenuItems = new MenuItems(children);
    }
  }

  render() {
    const data = this.model.toJSON();
    data.hasSubmenu = !!data.children && data.children.length > 0;

    const newEl = document.createElement('div');
    newEl.setAttribute('class', 'menu-item');
    newEl.innerHTML = this.template()(data);

    this.setElement(newEl);

    return this;
  }

  onClick(event: { stopPropagation: () => void }) {
    event.stopPropagation();
    this.em.trigger('canvas:contextmenu:close');
    const action = this.model.get('action');
    if (action) action(this.em);
  }

  onMouseEnter() {
    const children = this.model.get('children');
    if (children && children.length > 0) {
      if (this.timeoutId) clearTimeout(this.timeoutId);
      if (this.submenuView) return;
      const width = Math.floor(this.$el.innerWidth() || 0);

      this.submenuView = new MenuItemsView({
        collection: this.submenuItems,
        em: this.em,
      });

      if (!this.submenuItems) {
        return;
      }

      this.submenuItems.position = {
        top: 4,
        left: width + 4,
      };

      this.submenuView = new MenuItemsView({ collection: this.submenuItems, em: this.em });
      const submenuEl = this.submenuView.render().el;
      this.$el.append(submenuEl);
    }
  }

  onMouseLeave() {
    this.timeoutId = setTimeout(() => {
      if (this.submenuView) {
        this.submenuView.remove();
        this.submenuView = undefined;
      }
    }, 400);
  }
}
