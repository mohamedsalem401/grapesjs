import { Model } from '../../common';
import Component from '../../dom_components/model/Component';
import EditorModel from '../../editor/model/Editor';

export interface MenuItemProperties {
  text: string;
  shortcut?: string;
  action?: (em: EditorModel) => void;
  condition?: (em: EditorModel) => boolean;
  children?: MenuItem[];
}

export default class MenuItem extends Model<MenuItemProperties> {
  em: EditorModel;

  defaults() {
    return {
      shortcut: '',
      action: (em: EditorModel) => {},
      condition: (em: EditorModel) => true,
      children: [],
    };
  }

  constructor(prp: MenuItemProperties, opts: { em?: EditorModel } = {}) {
    super(prp);
    const { em } = opts;
    this.em = em!;
    const o = prp || {};
  }
}
