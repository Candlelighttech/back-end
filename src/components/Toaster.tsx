import { useState, useEffect } from 'react';

interface ToasterProps {
  show: boolean;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
  onClose: () => void;
}

export const Toaster = ({ show, type, title, message, onClose }: ToasterProps) => {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setClosing(true);
        setTimeout(() => {
          onClose();
          setClosing(false);
        }, 300);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
      setClosing(false);
    }, 300);
  };

  if (!show) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${closing ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
      <div className="bg-card border border-border rounded-lg p-4 shadow-lg max-w-sm">
        <div className="flex items-start gap-3">
          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
            type === 'success' ? 'bg-secondary' : 
            type === 'error' ? 'bg-destructive' : 
            'bg-secondary'
          }`}></div>
          <div className="flex-1">
            <p className="text-sm font-heading font-medium text-foreground mb-1">
              {title}
            </p>
            <p className="text-xs text-muted-foreground font-sans">
              {message}
            </p>
          </div>
          <button 
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};