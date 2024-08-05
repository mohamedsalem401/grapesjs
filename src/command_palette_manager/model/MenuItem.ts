import { Model } from '../../common';
import EditorModel from '../../editor/model/Editor';

export interface MenuItemProperties {
  text: string;
  shortcut?: string;
  action?: (em: EditorModel) => void;
}

export default class MenuItem extends Model<MenuItemProperties> {
  em: EditorModel;

  defaults() {
    return {
      shortcut: '',
      action: () => {},
    };
  }

  constructor(prp: MenuItemProperties, opts: { em: EditorModel }) {
    super(prp);
    const { em } = opts;
    this.em = em;
    const o = prp || {};
  }

  runAction() {
    const action = this.get('action');
    if (action) action(this.em);
  }
}
