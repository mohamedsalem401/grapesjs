import { View } from '../../common';
import EditorModel from '../../editor/model/Editor';
import MenuItemView from './MenuItemView';
import MenuItems from '../model/MenuItems';
import { isNull } from 'underscore';
import { CommandPaletteManagerConfig } from '../config/config';

export default class MenuItemsView extends View {
  em: EditorModel;
  pfx: string;
  config: CommandPaletteManagerConfig;
  module: any;
  selectedIndex: number | null = null;

  constructor(o: { config?: CommandPaletteManagerConfig; em: EditorModel; collection: MenuItems }) {
    // @ts-ignore
    super(o);
    this.em = o.em;
    const { config } = o;
    const coll = this.collection;
    // @ts-ignore
    this.position = coll.position;
    this.pfx = config?.stylePrefix || '';
    this.config = config!;
    this.tagName = 'ul';
    this.listenTo(coll, 'reset', this.onReset);

    if (this.collection.length > 0) this.setSelectedIndex(0);
  }

  render() {
    this.$el.empty();
    this.$el.addClass('menu');
    const fragmentEl = document.createDocumentFragment();

    this.collection.forEach((item: any, index: number) => {
      const menuItemView = new MenuItemView({ config: this.config, model: item, em: this.em });
      const el = menuItemView.render().el;
      if (index === this.selectedIndex) {
        el.classList.add('selected');
      }

      fragmentEl.append(el);
    });
    this.$el.append(fragmentEl);

    return this;
  }

  moveSelectionUp() {
    const currentSelection = this.selectedIndex;
    if (isNull(currentSelection) || currentSelection === 0) {
      return;
    }

    this.setSelectedIndex(currentSelection - 1);
  }

  moveSelectionDown() {
    const currentSelection = this.selectedIndex;
    if (isNull(currentSelection) || currentSelection + 1 >= this.collection.length) {
      return;
    }

    this.setSelectedIndex(currentSelection + 1);
  }

  triggerSelectedMenuItemAction() {
    if (!this.selectedIndex) return;
    const model = this.collection.at(this.selectedIndex);
    if (!model) return;
    model.runAction();
  }

  private setSelectedIndex(index: number) {
    if (index >= this.collection.length || index < 0) {
      throw new RangeError('Index out of bounds');
    }

    if (!isNull(this.selectedIndex)) {
      const currentEl = this.el.querySelector(`.menu-item:nth-child(${this.selectedIndex + 1})`);
      if (currentEl) {
        currentEl.classList.remove('selected');
      }
    }

    const newEl = this.el.querySelector(`.menu-item:nth-child(${index + 1})`);
    if (newEl) {
      newEl.classList.add('selected');
      newEl.scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
      });
    }

    this.selectedIndex = index;
  }

  onReset() {
    if (this.collection.length > 0) {
      this.selectedIndex = 0;
    }

    this.render();
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
}
