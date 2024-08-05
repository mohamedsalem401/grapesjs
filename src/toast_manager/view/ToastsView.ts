import { View } from '../../common';
import EditorModel from '../../editor/model/Editor';
import { appendAtIndex } from '../../utils/dom';
import { ToastManagerConfig } from '../config/config';
import Toast from '../model/Toast';
import Toasts from '../model/Toasts';
import { ToastPosition } from '../types';
import ToastView from './ToastView';

export default class ToastsView extends View {
  pfx: string;
  config: ToastManagerConfig;
  module: any;
  position: ToastPosition;

  constructor(
    o: {
      module?: any;
      config?: ToastManagerConfig;
      el?: HTMLElement;
      em?: EditorModel;
      collection?: Toasts;
      position?: ToastPosition;
    } = {}
  ) {
    // @ts-ignore
    super(o);
    const { module, config, position } = o;
    this.config = config!;
    this.module = module!;
    this.pfx = '';
    this.position = position || ToastPosition.BottomRight;

    this.listenTo(this.collection, 'add', this.onAdd);
  }

  onAdd(model: Toast) {
    this.addTo(model, this.collection);
  }

  addTo(model: Toast, c: any, opts = {}) {
    this.addToCollection(model, null, opts);
  }

  addToCollection(model: Toast, fragmentEl: DocumentFragment | null, opts: { at?: number } = {}) {
    const { config, el } = this;
    const appendTo = fragmentEl || el;
    const rendered = new ToastView({ model, config }).render().el;

    appendAtIndex(appendTo, rendered, opts.at);

    return rendered;
  }

  render() {
    const { $el } = this;
    $el.empty();
    const frag = document.createDocumentFragment();

    this.collection.each(model => this.addToCollection(model, frag));
    $el.append(frag);
    $el.attr('class', `toaster toaster-${this.position}`);

    return this;
  }
}
