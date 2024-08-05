import EditorModel from '../../editor/model/Editor';
import { MenuItemProperties } from '../model/MenuItem';

export interface CommandPaletteManagerConfig {
  /**
   * Default command list
   */
  commandList?: MenuItemProperties[];

  /**
   * Style prefix.
   * @default 'sm-'
   */
  stylePrefix?: string;

  /**
   * Avoid rendering the default command palette.
   * @default false
   */
  custom?: boolean;
}

export default {
  commandList: [
    {
      text: 'Undo',
      action: (em: EditorModel) => {
        em.Commands.run('core:undo');
      },
      shortcut: '⌘+z, ctrl+z',
    },
    {
      text: 'Redo',
      action: (em: EditorModel) => {
        em.Commands.run('core:redo');
      },
      shortcut: '⌘+shift+z, ctrl+shift+z',
    },
    {
      text: 'Save',
      action: (em: EditorModel) => {
        em.Commands.run('save');
      },
    },
    {
      text: 'Preview',
      action: (em: EditorModel) => {
        em.Commands.run('preview');
      },
    },
    {
      text: 'Show Layers',
      action: (em: EditorModel) => {
        em.Commands.run('open-layers');
      },
    },
    {
      text: 'Export HTML',
      action: (em: EditorModel) => {
        em.Commands.run('export-template');
      },
    },
    {
      text: 'Clear Canvas',
      action: (em: EditorModel) => {
        em.Commands.run('core:canvas-clear');
      },
    },
    {
      text: 'Toggle Fullscreen',
      action: (em: EditorModel) => {
        em.Commands.run('core:fullscreen');
      },
    },
    {
      text: 'Delete Selected',
      action: (em: EditorModel) => {
        em.Commands.run('core:component-delete');
      },
    },
  ],
} as CommandPaletteManagerConfig;
