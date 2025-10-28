import { useState } from 'react';

export const useToaster = () => {
  const [toaster, setToaster] = useState({
    show: false,
    type: 'info' as 'success' | 'error' | 'info',
    title: '',
    message: ''
  });

  const showToaster = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    setToaster({ show: true, type, title, message });
  };

  const closeToaster = () => {
    setToaster({ show: false, type: 'info', title: '', message: '' });
  };

  return {
    toaster,
    showToaster,
    closeToaster
  };
};