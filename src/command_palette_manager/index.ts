import EditorModel from '../editor/model/Editor';
import { ItemManagerModule } from '../abstract/Module';
import CommandPaletteView from './view/CommandPaletteView';
import CommandPalette from './model/CommandPalette';
import defaults, { CommandPaletteManagerConfig } from './config/config';

export default class CommandPaletteManager extends ItemManagerModule<
  CommandPaletteManagerConfig,
  /** @ts-ignore */
  CommandPalette
> {
  storageKey = '';
  commandPalette: CommandPalette;
  commandPaletteView?: CommandPaletteView;

  constructor(em: EditorModel) {
    super(em, 'CommandPaletteManager', new CommandPalette(defaults.commandList || [], { em }), {}, defaults);
    this.commandPalette = this.all;

    this.em.on('canvas:contextmenu:close', this.close, this);
    this.em.on('canvas:contextmenu', this.open, this);
    this.em.on('component:select', () => {
      this.em.trigger('canvas:contextmenu:close');
    });
  }

  renderMenu = () => {
    this.commandPaletteView = new CommandPaletteView({
      config: this.config,
      model: this.commandPalette,
      em: this.em,
    });

    const el = this.commandPaletteView.render().el;
    document.body.appendChild(el);
    (el.querySelector('.command-input') as HTMLInputElement).focus();
  };

  destroy() {
    this.commandPaletteView?.remove();
  }

  open() {
    this.commandPalette = new CommandPalette(defaults.commandList || [], {
      em: this.em,
    });

    this.renderMenu();
  }

  close() {
    this.destroy();
    this.commandPalette.destroy();
  }
}
