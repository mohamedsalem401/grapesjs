import { CommandObject } from './CommandAbstract';

export default {
  run(ed) {
    ed.CommandPaletteManager.open();
  },
} as CommandObject;
