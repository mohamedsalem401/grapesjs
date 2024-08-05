import { ToastPosition } from '../types';

export interface ToastManagerConfig {
  closable?: boolean;
  multiple?: boolean;
  postition?: ToastPosition;
  duration?: number;
  stylePrefix?: string;
}

export default {
  appendTo: '',
  custom: false,
  stylePrefix: '',
} as ToastManagerConfig;
