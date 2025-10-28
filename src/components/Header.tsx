import { useState } from 'react';
import { Search, ChevronDown, LogOut, User, Settings, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToaster } from '@/contexts/ToasterContext';
import { Modal } from './Modal';
import { Button } from './Button';

interface HeaderProps {
  isMobile: boolean;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export const Header = ({ isMobile, sidebarCollapsed, onToggleSidebar }: HeaderProps) => {
  const { user, logout } = useAuth();
  const { showToaster } = useToaster();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [showSearchResults, setShowSearchResults] = useState(false);

  const searchResults = [
    { type: 'Page', name: 'Dashboard', url: '/dashboard' },
    { type: 'Page', name: 'Projects', url: '/dashboard/projects' },
    { type: 'Page', name: 'AI Website Builder', url: '/dashboard/builder' },
    { type: 'Page', name: 'AI Assistant', url: '/dashboard/assistant' },
    { type: 'Page', name: 'Blog & Content Manager', url: '/dashboard/blog' },
    { type: 'Page', name: 'Export & Deployment', url: '/dashboard/deploy' },
    { type: 'Page', name: 'SEO & Analytics', url: '/dashboard/analytics' },
    { type: 'Page', name: 'Settings', url: '/dashboard/settings' },
    { type: 'Page', name: 'Subscription & Billing', url: '/dashboard/billing' },
    { type: 'Page', name: 'Team & Collaboration', url: '/dashboard/team' },
    { type: 'Project', name: 'TechCorp Landing Page', url: '/dashboard/projects' },
    { type: 'Project', name: 'Portfolio Website', url: '/dashboard/projects' }
  ].filter(item => 
    searchQuery && item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchResults.length > 0) {
      navigate(searchResults[0].url);
      setSearchQuery('');
      setShowSearchResults(false);
    }
  };



  const handleLogout = async () => {
    try {
      await logout();
      setShowLogoutModal(false);
      showToaster('success', 'Logged Out', 'You have been logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      showToaster('error', 'Logout Failed', 'There was an error logging out. Please try again.');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between px-3 sm:px-6 py-4">
          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSidebar();
              }}
              className="p-2 hover:bg-secondary/20 rounded-lg transition-colors mr-3 z-50"
            >
              <Menu className="w-5 h-5 text-foreground" />
            </button>
          )}
          
          {/* Search Bar */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder={isMobile ? "Search..." : "Search projects, pages, or commands..."}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(e.target.value.length > 0);
                }}
                onKeyDown={handleSearch}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 rounded-lg bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary transition-all text-sm sm:text-base"
              />
              
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg py-2 z-50">
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-secondary/10 transition-colors text-left"
                      onClick={() => {
                        navigate(result.url);
                        setSearchQuery('');
                        setShowSearchResults(false);
                      }}
                    >
                      <span className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded">
                        {result.type}
                      </span>
                      <span className="text-sm text-foreground">{result.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-4 ml-3 sm:ml-6">


            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 sm:gap-3 p-2 hover:bg-secondary/20 rounded-lg transition-colors"
              >
                <img
                  src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                  alt={user?.name}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full"
                />
                {!isMobile && (
                  <>
                    <span className="text-sm font-medium text-foreground hidden sm:block">
                      {user?.name}
                    </span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
                  </>
                )}
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-[calc(100vw-4rem)] md:w-56 lg:w-64 max-w-xs sm:max-w-sm md:max-w-md bg-card border border-border rounded-xl shadow-lg py-2 animate-fade-in z-50">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-medium text-foreground">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>


                 
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      setShowLogoutModal(true);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-destructive/20 text-destructive transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Confirm Logout"
        size="sm"
      >
        <p className="text-muted-foreground mb-6">
          Are you sure you want to logout from your account?
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setShowLogoutModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </Modal>
    </>
  );
};
