
import { toast as sonnerToast } from 'sonner';

type ToastMessage = string | React.ReactNode;

export const toast = {
  success: (message: ToastMessage) => typeof message === 'object' ? 
    sonnerToast.success('Success') : 
    sonnerToast.success(message),
  
  error: (message: ToastMessage) => typeof message === 'object' ? 
    sonnerToast.error('Error occurred') : 
    sonnerToast.error(message),
  
  info: (message: ToastMessage) => typeof message === 'object' ? 
    sonnerToast.info('Information') : 
    sonnerToast.info(message),
  
  warning: (message: ToastMessage) => typeof message === 'object' ? 
    sonnerToast.warning('Warning') : 
    sonnerToast.warning(message)
};
