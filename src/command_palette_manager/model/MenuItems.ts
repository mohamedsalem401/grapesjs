import { Collection } from '../../common';
import EditorModel from '../../editor/model/Editor';
import MenuItem from './MenuItem';

export default class MenuItems extends Collection<MenuItem> {
  em!: EditorModel;
  module!: any;

  constructor(collection: MenuItem[], opts: { em: EditorModel; module?: any }) {
    super(collection);
    const { module, em } = opts;
    this.em = em;
    this.module = module;
  }

  /** @ts-ignore */
  model(props, opts = {}) {
    // @ts-ignore
    const { em } = opts.collection;
    return new MenuItem(props, { ...opts, em });
  }
}
