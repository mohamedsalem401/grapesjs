import { Collection } from '../../common';
import EditorModel from '../../editor/model/Editor';
import Toast from './Toast';

export default class Toasts extends Collection<Toast> {
  em!: EditorModel;
  module!: any;

  initialize(prop: any, opts: { em?: EditorModel; module?: any } = {}) {
    const { module, em } = opts;
    this.em = em!;
    this.module = module;

    this.on('toast:done', (opts: any): void => {
      this.remove(opts.model);
    });
  }

  /** @ts-ignore */
  model(props, opts = {}) {
    // @ts-ignore
    const { em } = opts.collection;
    return new Toast(props, { ...opts, em });
  }
}
