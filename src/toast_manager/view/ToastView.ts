import { EventsHash } from 'backbone';
import { View } from '../../common';
import EditorModel from '../../editor/model/Editor';
import { ToastManagerConfig } from '../config/config';
import Toast from '../model/Toast';

export default class ToastView extends View<Toast> {
  em: EditorModel;
  config: ToastManagerConfig;
  pfx: string;
  ppfx: string;
  icon: string | HTMLElement | undefined;

  events(): EventsHash {
    return {
      'click .close-icon': () => this.model.close(),
      mouseenter: () => this.model.mouseEnter(),
      mouseleave: () => this.model.mouseLeave(),
    };
  }

  template({ pfx = '', title, content, icon }: { pfx: string; title: string; content: string; icon: string }) {
    return `
        <div class="${pfx}toast-icon">
          ${icon}
        </div>
        
        <div class="${pfx}toast-message">
          <div class="${pfx}toast-title">
            ${title}
          </div>
          <div class="${pfx}toast-content">
            ${content}
          </div>
        </div>
        <svg class="close-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <rect width="24" height="24" fill="white"></rect>
            <path d="M7 17L16.8995 7.10051" stroke="#000000" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M7 7.00001L16.8995 16.8995" stroke="#000000" stroke-linecap="round" stroke-linejoin="round"></path>
          </g>
        </svg>
    `;
  }

  constructor(o: { config: ToastManagerConfig; model?: Toast; icon?: HTMLElement | string }) {
    super(o);
    const config = o.config || {};
    const { model } = this;
    // @ts-ignore
    const { em } = config;
    this.config = config;
    this.em = em;
    this.pfx = config.stylePrefix || '';
    this.icon = o.icon;
    this.ppfx = this.model.get('variant') || '';

    this.listenTo(model, 'destroy remove', this.removeToast);
  }

  removeToast() {
    const { pfx } = this;
    this.$el.addClass(`${pfx}toast-leave`);
    const animationEndHandler = () => {
      this.$el.off('animationend');
      this.remove();
    };
    this.$el.on('animationend', animationEndHandler);
  }

  getElement(element: HTMLElement | undefined | string): string {
    if (element instanceof HTMLElement) {
      return element.outerHTML;
    }

    return element || '';
  }

  render() {
    const { ppfx, pfx, model, $el } = this;
    $el.attr('class', `${pfx}toast ${pfx}toast-enter ${pfx}toast-${ppfx}`);
    const icon = this.getElement(model.get('icon'));
    const title = this.getElement(model.get('title'));
    const content = this.getElement(model.get('content'));
    $el.html(this.template({ pfx, icon, title, content }));

    // Remove the toast-enter class after the animation finishes
    const animationEndHandler = () => {
      this.$el.removeClass(`${pfx}toast-enter`);
      this.$el.off('animationend');
    };
    this.$el.on('animationend', animationEndHandler);

    return this;
  }
}
