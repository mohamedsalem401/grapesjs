import { ToastManagerConfig as ToastManagerConfig } from './config/config';
import { ItemManagerModule } from '../abstract/Module';
import EditorModel from '../editor/model/Editor';
import Toast, { ToastProperties } from './model/Toast';
import ToastsView from './view/ToastsView';
import Toasts from './model/Toasts';
import { ToastPosition } from './types';

export const evAll = 'toast';
export const evPfx = `${evAll}:`;
export const evAdd = `${evPfx}add`;
export const evRemove = `${evPfx}remove`;

export type ToastModuleParam<T extends keyof ToastManager, N extends number> = Parameters<ToastManager[T]>[N];

const toastEvents = {
  all: evAll,
  add: evAdd,
  remove: evRemove,
};

export default class ToastManager extends ItemManagerModule<
  ToastManagerConfig,
  // @ts-ignore
  Toasts
> {
  events!: typeof toastEvents;
  toasts: { [key in ToastPosition]?: Toasts } = {};
  toastsView: { [key in ToastPosition]?: ToastsView } = {};
  Toast = Toast;
  storageKey = '';

  constructor(em: EditorModel) {
    super(em, 'ToastManager', new Toasts([], { em }), toastEvents);

    Object.values(ToastPosition).forEach(position => {
      this.toasts[position] = new Toasts([], { em });
    });
  }

  postLoad() {
    document.body.append(this.render());
  }

  showToast(options: ToastProperties) {
    const toast = new Toast(options);
    const position = toast.get('position') || ToastPosition.TopLeft;

    const toastsCollection = this.toasts[position];
    if (!toastsCollection) return;

    toastsCollection.add(toast);

    if (!this.toastsView[position]) {
      const el = this.createContainer(`toaster-${position}`);
      this.toastsView[position] = new ToastsView({
        el,
        em: this.em,
        config: this.config,
        module: this,
        collection: toastsCollection,
        position: position,
      });
      document.body.append(this.toastsView[position]!.render().el);
    }
  }

  destroy() {
    Object.values(ToastPosition).forEach(position => {
      const toastsCollection = this.toasts[position];
      if (toastsCollection) {
        toastsCollection.reset();
        toastsCollection.stopListening();
      }

      const toastsView = this.toastsView[position];
      if (toastsView) {
        toastsView.remove();
      }
    });

    this.model.stopListening();
  }

  render() {
    return document.createDocumentFragment();
  }

  createContainer(className: string) {
    const container = document.createElement('div');
    container.className = className;
    return container;
  }
}
