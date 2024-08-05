import { ToastPosition, ToastVariant } from '../../toast_manager/types';
import { CommandObject } from './CommandAbstract';

export default {
  run(ed, sen, opts) {
    ed.showToast({
      title: opts.title,
      content: opts.content,
      // @ts-ignore
      position: ToastPosition[opts.position],
      // @ts-ignore
      variant: ToastVariant[opts.variant],
    });
  },
} as CommandObject;
