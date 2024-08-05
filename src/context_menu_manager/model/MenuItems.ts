import { Collection } from '../../common';
import EditorModel from '../../editor/model/Editor';
import MenuItem from './MenuItem';

type Position = {
  left: number;
  top: number;
};

export default class MenuItems extends Collection<MenuItem> {
  em!: EditorModel;
  module!: any;
  position: Position | undefined;

  initialize(prop: any, opts: { em?: EditorModel; module?: any; position?: Position } = {}) {
    const { module, em, position } = opts;
    this.em = em!;
    this.module = module;
    this.listenTo(this, 'reset', this.onReset);
    this.position = position;
  }

  /** @ts-ignore */
  model(props, opts = {}) {
    // @ts-ignore
    const { em } = opts.collection;
    return new MenuItem(props, { ...opts, em });
  }

  onReset(models: any, opts: { previousModels?: MenuItem[] } = {}) {}
}
