import { Model } from '../../common';
import EditorModel from '../../editor/model/Editor';
import { ToastPosition, ToastVariant } from '../types';

export interface ToastProperties {
  variant?: ToastVariant;
  title?: string | HTMLElement;
  content: string | HTMLElement;
  icon?: string | HTMLElement;
  duration?: number;
  position?: ToastPosition;
}

export default class Toast extends Model<ToastProperties> {
  em: EditorModel;
  private timeoutId: number | null = null;

  defaults() {
    return {
      variant: ToastVariant.Primary,
      duration: 3000,
      position: ToastPosition.TopLeft,
    };
  }

  constructor(prp: ToastProperties, opts: { em?: EditorModel } = {}) {
    super(prp, { parse: true });
    const { em } = opts;
    this.em = em!;

    const variant = this.get('variant');
    const icon = variant && this.getToastIcon(variant);
    icon && this.set('icon', icon);

    this.initializeDuration();
    this.on('toast:expired', () => {
      this.trigger('toast:done', {
        model: this,
      });
    });

    this.on('destroy remove', this.onDestroy, this);
  }

  initializeDuration() {
    const duration = this.get('duration');
    if (!duration || duration <= 0) {
      return;
    }
    this.timeoutId = window.setTimeout(() => {
      this.trigger('toast:expired');
    }, duration);
  }

  onDestroy() {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  close() {
    this.trigger('toast:done', {
      model: this,
    });
  }

  mouseEnter() {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  mouseLeave() {
    if (this.timeoutId !== null) {
      return;
    }
    this.initializeDuration();
  }

  getToastIcon(variant: ToastVariant): string {
    const colors = {
      primary: 'var(--gjs-primary-color)',
      success: 'var(--gjs-color-green)',
      warning: 'var(--gjs-color-yellow)',
      danger: 'var(--gjs-color-red)',
    };

    const icons = {
      primary: `<svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM12 17.75C12.4142 17.75 12.75 17.4142 12.75 17V11C12.75 10.5858 12.4142 10.25 12 10.25C11.5858 10.25 11.25 10.5858 11.25 11V17C11.25 17.4142 11.5858 17.75 12 17.75ZM12 7C12.5523 7 13 7.44772 13 8C13 8.55228 12.5523 9 12 9C11.4477 9 11 8.55228 11 8C11 7.44772 11.4477 7 12 7Z" fill="${colors.primary}"></path> </g></svg>`,
      success: `<svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM16.0303 8.96967C16.3232 9.26256 16.3232 9.73744 16.0303 10.0303L11.0303 15.0303C10.7374 15.3232 10.2626 15.3232 9.96967 15.0303L7.96967 13.0303C7.67678 12.7374 7.67678 12.2626 7.96967 11.9697C8.26256 11.6768 8.73744 11.6768 9.03033 11.9697L10.5 13.4393L12.7348 11.2045L14.9697 8.96967C15.2626 8.67678 15.7374 8.67678 16.0303 8.96967Z" fill="${colors.success}"></path> </g></svg>`,
      warning: `<svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M3 10.4167C3 7.21907 3 5.62028 3.37752 5.08241C3.75503 4.54454 5.25832 4.02996 8.26491 3.00079L8.83772 2.80472C10.405 2.26824 11.1886 2 12 2C12.8114 2 13.595 2.26824 15.1623 2.80472L15.7351 3.00079C18.7417 4.02996 20.245 4.54454 20.6225 5.08241C21 5.62028 21 7.21907 21 10.4167V11.9914C21 17.6294 16.761 20.3655 14.1014 21.5273C13.38 21.8424 13.0193 22 12 22C10.9807 22 10.62 21.8424 9.89856 21.5273C7.23896 20.3655 3 17.6294 3 11.9914V10.4167ZM12 7.25C12.4142 7.25 12.75 7.58579 12.75 8V12C12.75 12.4142 12.4142 12.75 12 12.75C11.5858 12.75 11.25 12.4142 11.25 12V8C11.25 7.58579 11.5858 7.25 12 7.25ZM12 16C12.5523 16 13 15.5523 13 15C13 14.4477 12.5523 14 12 14C11.4477 14 11 14.4477 11 15C11 15.5523 11.4477 16 12 16Z" fill="${colors.warning}"></path> </g></svg>`,
      danger: `<svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M3.37752 5.08241C3 5.62028 3 7.21907 3 10.4167V11.9914C3 17.6294 7.23896 20.3655 9.89856 21.5273C10.62 21.8424 10.9807 22 12 22C13.0193 22 13.38 21.8424 14.1014 21.5273C16.761 20.3655 21 17.6294 21 11.9914V10.4167C21 7.21907 21 5.62028 20.6225 5.08241C20.245 4.54454 18.7417 4.02996 15.7351 3.00079L15.1623 2.80472C13.595 2.26824 12.8114 2 12 2C11.1886 2 10.405 2.26824 8.83772 2.80472L8.26491 3.00079C5.25832 4.02996 3.75503 4.54454 3.37752 5.08241ZM10.0303 8.96965C9.73744 8.67676 9.26256 8.67676 8.96967 8.96965C8.67678 9.26254 8.67678 9.73742 8.96967 10.0303L10.9394 12L8.96969 13.9697C8.6768 14.2625 8.6768 14.7374 8.96969 15.0303C9.26258 15.3232 9.73746 15.3232 10.0304 15.0303L12 13.0607L13.9696 15.0303C14.2625 15.3232 14.7374 15.3232 15.0303 15.0303C15.3232 14.7374 15.3232 14.2625 15.0303 13.9696L13.0607 12L15.0303 10.0303C15.3232 9.73744 15.3232 9.26256 15.0303 8.96967C14.7374 8.67678 14.2626 8.67678 13.9697 8.96967L12 10.9393L10.0303 8.96965Z" fill="${colors.danger}"></path> </g></svg>`,
    };

    return icons[variant];
  }
}
