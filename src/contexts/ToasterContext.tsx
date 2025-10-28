import { createContext, useContext, useState, ReactNode } from 'react';
import { Toaster } from '@/components/Toaster';

interface ToasterContextType {
  showToaster: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
}

const ToasterContext = createContext<ToasterContextType | undefined>(undefined);

export const ToasterProvider = ({ children }: { children: ReactNode }) => {
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

  return (
    <ToasterContext.Provider value={{ showToaster }}>
      {children}
      <Toaster {...toaster} onClose={closeToaster} />
    </ToasterContext.Provider>
  );
};

export const useToaster = () => {
  const context = useContext(ToasterContext);
  if (!context) {
    throw new Error('useToaster must be used within ToasterProvider');
  }
  return context;
};