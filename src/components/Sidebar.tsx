import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Wand2,
  MessageSquare,
  PenTool,
  Upload,
  BarChart3,
  Settings,
  CreditCard,
  Users,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Projects', icon: FolderKanban, path: '/dashboard/projects' },
  { name: 'AI Website Builder', icon: Wand2, path: '/dashboard/builder' },
  { name: 'AI Assistant', icon: MessageSquare, path: '/dashboard/assistant' },
  { name: 'Blog & Content', icon: PenTool, path: '/dashboard/blog' },
  { name: 'Export & Deploy', icon: Upload, path: '/dashboard/deploy' },
  { name: 'SEO & Analytics', icon: BarChart3, path: '/dashboard/analytics' },
  { name: 'Settings', icon: Settings, path: '/dashboard/settings' },
  { name: 'Billing', icon: CreditCard, path: '/dashboard/billing' },
  { name: 'Team', icon: Users, path: '/dashboard/team' },
];

interface SidebarProps {
  isMobile: boolean;
  isOpen: boolean;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onClose: () => void;
}

export const Sidebar = ({ isMobile, isOpen, collapsed, onToggleCollapse, onClose }: SidebarProps) => {
  const { user } = useAuth();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-primary border-r border-border transition-all duration-300',
        isMobile 
          ? `w-[280px] z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'}` 
          : `z-40 ${collapsed ? 'w-[70px]' : 'w-[250px]'}`
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <img 
              src="/logo.svg" 
              alt="Candlelight Logo" 
              className="w-45 h-18 hover:scale-110 transition-transform duration-300"
            />
            {/* {(!collapsed || isMobile) && (
              <span className="font-heading font-bold text-lg text-foreground">
                Candlelight
              </span>
            )} */}
          </div>
          {isMobile && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
          )}  
        </div>

        {/* Toggle Button - Only show on desktop */}
        {!isMobile && (
          <button
            onClick={onToggleCollapse}
            className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-secondary border border-border flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-lg hover:bg-secondary/90 animate-bounce-in"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4 text-secondary-foreground" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-secondary-foreground" />
            )}
          </button>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/dashboard'}
                  onClick={() => {
                    window.scrollTo(0, 0);
                    if (isMobile) onClose();
                  }}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 hover:bg-secondary/30 hover:shadow-lg',
                      'group relative overflow-hidden',
                      isActive && 'bg-secondary text-secondary-foreground font-medium glow-neon'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        className={cn(
                          'w-5 h-5 transition-colors',
                          isActive ? 'text-secondary-foreground' : 'text-muted-foreground group-hover:text-foreground'
                        )}
                      />
                      {(!collapsed || isMobile) && (
                        <span
                          className={cn(
                            'transition-colors',
                            isActive ? 'text-secondary-foreground' : 'text-muted-foreground group-hover:text-foreground'
                          )}
                        >
                          {item.name}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="p-2">
          <div className="flex items-center gap-3 px-3 py-2">
            <img
              src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
              alt={user?.name}
              className="w-8 h-8 rounded-full"
            />
            {(!collapsed || isMobile) && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
