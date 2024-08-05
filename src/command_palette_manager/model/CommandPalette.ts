import { Model } from '../../common';
import EditorModel from '../../editor/model/Editor';
import fuzzySearch from '../../utils/fuzzysearch';
import MenuItem, { MenuItemProperties } from './MenuItem';
import MenuItems from './MenuItems';

export interface CommandPaletteProperties {
  menuItems: MenuItems;
  filteredMenuItems?: MenuItems;
  searchText?: string;
}

export default class CommandPalette extends Model<CommandPaletteProperties> {
  em: EditorModel;

  constructor(commandList: MenuItemProperties[], opts: { em: EditorModel }) {
    const { em } = opts;
    const menuItems = new MenuItems(
      commandList.map(item => new MenuItem(item, { em })),
      { em }
    );
    super({ menuItems });
    this.em = em;

    this.set('filteredMenuItems', menuItems.clone());
    this.on('input:change', this.onInput, this);
  }

  onInput(value: string) {
    const menuItems = this.get('menuItems');
    if (!menuItems) return;
    const matching = menuItems.clone().filter(model => {
      const text = model.get('text')?.toLowerCase();
      return !!text && fuzzySearch(value, text);
    });

    const filteredManuItems = this.get('filteredMenuItems');
    filteredManuItems?.reset(matching);
  }
}
