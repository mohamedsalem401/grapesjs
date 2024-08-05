import { Collection } from '../../common';
import EditorModel from '../../editor/model/Editor';
import MenuItem, { MenuItemProperties } from './MenuItem';

type Position = {
  left: number;
  top: number;
};

export default class MenuItems extends Collection<MenuItem> {
  em!: EditorModel;
  module!: any;
  position: Position | undefined;

  constructor(collection: MenuItemProperties[], opts: { em?: EditorModel; module?: any; position?: Position } = {}) {
    super(collection);
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
