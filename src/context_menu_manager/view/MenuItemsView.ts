import { View } from '../../common';
import EditorModel from '../../editor/model/Editor';
import { appendAtIndex } from '../../utils/dom';
import MenuItemView from './MenuItemView';
import { ContextMenuManagerConfig } from '../types';
import MenuItem from '../model/MenuItem';
import MenuItems from '../model/MenuItems';

export default class MenuItemsView extends View {
  em: EditorModel;
  pfx: string;
  config: ContextMenuManagerConfig;
  module: any;
  position?: {
    top: number;
    left: number;
  };

  constructor(o: {
    module?: any;
    config?: ContextMenuManagerConfig;
    el?: HTMLElement;
    em: EditorModel;
    collection?: MenuItems;
  }) {
    // @ts-ignore
    super(o);
    this.em = o.em;
    const { module, config } = o;
    const coll = this.collection;
    // @ts-ignore
    this.position = coll.position;
    this.pfx = config?.stylePrefix || '';
    this.config = config!;
    this.module = module!;
    this.tagName = 'ul';
  }

  remove() {
    this.$el.addClass('closing');
    setTimeout((args: any) => {
      View.prototype.remove.apply(this, args as any);
    }, 150);
    ['config', 'module', 'em'].forEach(i => {
      // @ts-ignore
      this[i] = {};
    });
    return this;
  }

  addTo(model: MenuItem, c: any, opts = {}) {
    this.addToCollection(model, null, opts);
  }

  addToCollection(model: MenuItem, fragmentEl: DocumentFragment | null, opts: { at?: number } = {}) {
    const { config, el, em } = this;
    const appendTo = fragmentEl || el;
    const rendered = new MenuItemView({
      model,
      config,
      em,
    }).render().el;
    appendAtIndex(appendTo, rendered, opts.at);

    return rendered;
  }

  render() {
    const menu = document.createElement('div');
    menu.classList.add('menu');
    menu.setAttribute('style', `left: ${this.position?.left}px !important; top:${this.position?.top}px !important;`);

    const toShow = this.collection.filter(menuItem => {
      if (typeof menuItem.get('condition') === 'function') {
        return menuItem.get('condition')(this.em);
      }

      return false;
    });

    toShow.forEach((item: any) => {
      const menuItemView = new MenuItemView({ config: this.config, model: item, em: this.em });
      menu.append(menuItemView.render().el);
    });

    this.setElement(menu);
    return this;
  }
}
