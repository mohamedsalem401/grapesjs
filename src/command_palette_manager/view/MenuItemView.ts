import { View } from 'backbone';
import _ from 'underscore';
import MenuItem from '../model/MenuItem';
import EditorModel from '../../editor/model/Editor';
import { CommandPaletteManagerConfig } from '../config/config';

export default class MenuItemView extends View<MenuItem> {
  em: EditorModel;
  config: CommandPaletteManagerConfig;
  pfx: string;

  template() {
    return _.template(`
    <div class="menu-item-content">
      <span class="text"><%= text %></span>
      <%= shortcut ? '<span class="shortcut">' + shortcut + '</span>' : '' %>
    </div>`);
  }

  events() {
    return {
      'click .menu-item-content': 'onClick',
    };
  }

  constructor(o: { config: CommandPaletteManagerConfig; model: MenuItem; em: EditorModel }) {
    super(o);
    const config = o.config || {};
    const { model } = this;
    // @ts-ignore
    this.config = config;
    this.em = o.em;
    this.pfx = config.stylePrefix || '';
    this.listenTo(model, 'destroy remove', this.remove);
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

  onClick(event: Event) {
    event.stopPropagation();
    this.em.trigger('canvas:contextmenu:close');
    this.model.runAction();
  }
}
