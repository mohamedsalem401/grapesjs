import { View } from 'backbone';
import _ from 'underscore';
import EditorModel from '../../editor/model/Editor';
import CommandPalette from '../model/CommandPalette';
import MenuItemsView from './MenuItemsView';
import MenuItems from '../model/MenuItems';
import { CommandPaletteManagerConfig } from '../config/config';

export default class CommandPaletteView extends View<CommandPalette> {
  em: EditorModel;
  config: CommandPaletteManagerConfig;
  pfx: string;
  menuItems: MenuItems;
  menuItemView: MenuItemsView;

  template() {
    return _.template(`
        <div class="command-input-container">
            <div style="height: 24px; width: 24px; display: flex; align-items: center; justify-content: center;">
                <svg role="graphics-symbol" viewBox="0 0 16 16" class="search" style="width: 16px; height: 16px; display: block; fill: rgba(0, 0, 0, 0.643); flex-shrink: 0;"><path d="M.281 6.438c0-.875.164-1.696.492-2.461a6.484 6.484 0 011.375-2.032A6.237 6.237 0 016.64.078 6.2 6.2 0 019.11.57c.77.328 1.447.787 2.03 1.375a6.374 6.374 0 011.368 2.032c.333.765.5 1.586.5 2.46 0 .688-.107 1.342-.32 1.961a6.28 6.28 0 01-.868 1.696l3.563 3.578c.11.104.19.226.242.367.057.14.086.29.086.445 0 .22-.05.417-.149.594a1.122 1.122 0 01-1 .57c-.156 0-.307-.028-.453-.086a1.058 1.058 0 01-.382-.25l-3.586-3.585c-.5.333-1.047.596-1.641.789a6.089 6.089 0 01-1.86.28 6.237 6.237 0 01-2.468-.491 6.4 6.4 0 01-2.024-1.367A6.509 6.509 0 01.773 8.913a6.256 6.256 0 01-.492-2.476zm1.664 0c0 .65.12 1.26.36 1.828a4.775 4.775 0 001.015 1.5c.433.427.933.763 1.5 1.007a4.548 4.548 0 001.82.368c.652 0 1.261-.123 1.829-.368a4.747 4.747 0 002.508-2.507 4.567 4.567 0 00.367-1.829c0-.645-.123-1.252-.367-1.82a4.776 4.776 0 00-1.016-1.5A4.578 4.578 0 008.469 2.11a4.567 4.567 0 00-1.828-.367c-.646 0-1.253.123-1.82.367a4.667 4.667 0 00-1.5 1.008c-.433.432-.772.932-1.016 1.5a4.633 4.633 0 00-.36 1.82z"></path></svg>
            </div>

            <input type="text" class="command-input" placeholder="Search for a command" autofocus>
        </div>
        `);
  }

  events() {
    return {
      'click .command-overlay': 'closeCommandPalette',
      'input .command-input': 'onInput',
      keydown: 'onKeydown',
    };
  }

  constructor(o: { config: CommandPaletteManagerConfig; model: CommandPalette; em: EditorModel }) {
    super(o);
    const config = o.config || {};
    this.config = config;
    this.em = o.em;
    this.pfx = config.stylePrefix || '';

    this.menuItems = o.model?.get('filteredMenuItems')!;

    this.menuItemView = new MenuItemsView({
      collection: this.menuItems,
      em: this.em,
    });

    this.listenTo(this.model, 'destroy remove', this.remove);
  }

  render() {
    const overlay = document.createElement('div');
    overlay.classList.add('command-overlay');

    const commandPalette = this.commandPaletteTemplate();

    overlay.appendChild(commandPalette);
    this.setElement(overlay);

    return this;
  }

  commandPaletteTemplate() {
    const commandPalette = document.createElement('div');
    commandPalette.setAttribute('tabIndex', '0');
    commandPalette.classList.add('command-palette');
    commandPalette.innerHTML = this.template()({});
    commandPalette.appendChild(this.menuItemsTemplate());
    commandPalette.appendChild(this.footerTemplate());

    commandPalette.addEventListener('click', e => {
      e.stopPropagation();
    });
    return commandPalette;
  }

  menuItemsTemplate() {
    if (!this.menuItemView) {
      this.menuItemView = new MenuItemsView({
        em: this.em,
        collection: this.menuItems,
      });
    }

    return this.menuItemView.render().el;
  }

  footerTemplate() {
    const footer = document.createElement('div');
    footer.classList.add('command-palette-footer');

    const sections = [
      { keys: ['Up', 'Down'], description: 'to move' },
      { keys: ['Enter'], description: 'to select' },
      { keys: ['Esc'], description: 'to go back' },
    ];

    sections.forEach(section => {
      const sectionDiv = document.createElement('div');
      sectionDiv.classList.add('section');
      section.keys.forEach(key => {
        const kbd = document.createElement('kbd');
        kbd.textContent = key;
        sectionDiv.appendChild(kbd);
      });
      const span = document.createElement('span');
      span.textContent = section.description;
      sectionDiv.appendChild(span);
      footer.appendChild(sectionDiv);
    });

    return footer;
  }

  onInput(event: any) {
    event.stopPropagation();
    const input = event.target.value.toLowerCase();
    this.model.trigger('input:change', input);
  }

  onKeydown(event: KeyboardEvent) {
    const { code } = event;

    switch (code) {
      case 'ArrowUp':
        this.menuItemView.moveSelectionUp();
        break;
      case 'ArrowDown':
        this.menuItemView.moveSelectionDown();
        break;
      case 'Enter':
        this.menuItemView.triggerSelectedMenuItemAction();
        this.closeCommandPalette();
        break;
      case 'Escape':
        this.closeCommandPalette();
        break;
      default:
    }
  }

  closeCommandPalette() {
    this.remove();
  }
}
