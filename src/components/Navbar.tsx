import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  Upload, 
  Lightbulb, 
  ShoppingBag, 
  TreePine, 
  Users,
  Settings, 
  LogOut,
  User
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/upload', icon: Upload, label: 'Upload' },
    { path: '/suggestions', icon: Lightbulb, label: 'Suggestions' },
    { path: '/marketplace', icon: ShoppingBag, label: 'Marketplace' },
    { path: '/community', icon: Users, label: 'Community' },
    { path: '/eco-tracker', icon: TreePine, label: 'Eco Tracker' },
  ];

  if (user?.profile?.role === 'admin') {
    navLinks.push({ path: '/admin', icon: Settings, label: 'Admin' });
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!isMenuOpen) return;
      const target = event.target as Node | null;
      const clickedOutsideMenu = menuRef.current && !menuRef.current.contains(target as Node);
      const clickedOutsideButton = menuButtonRef.current && !menuButtonRef.current.contains(target as Node);
      if (clickedOutsideMenu && clickedOutsideButton) {
        setIsMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMenuOpen]);

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="flex items-center justify-center shrink-0">
              <img
                src="/logo.png"
                alt="Waste2Wonder"
                className="h-8 w-8 md:h-9 md:w-9 object-contain"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
            <span className="text-xl font-bold text-gray-800">Waste2Wonder</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-green-600 bg-green-50'
                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                <link.icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="relative flex items-center">
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              ref={menuButtonRef}
              className="flex items-center space-x-2 px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-haspopup="menu"
              aria-expanded={isMenuOpen}
            >
              <img
                src={user?.profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                alt={user?.profile?.name || user?.email}
                className="h-8 w-8 rounded-full"
              />
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-700">{user?.profile?.name || user?.email?.split('@')[0]}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.profile?.role || 'user'}</p>
              </div>
            </button>

            {isMenuOpen && (
              <div
                ref={menuRef}
                className="absolute right-0 top-full mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50"
                role="menu"
              >
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/profile');
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
                  role="menuitem"
                >
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={async () => {
                    setIsMenuOpen(false);
                    await handleLogout();
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
                  role="menuitem"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200 bg-white fixed bottom-0 left-0 right-0 z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="max-w-7xl mx-auto px-2 flex justify-around py-2">
          {navLinks.slice(0, 5).map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex flex-col items-center p-2 rounded-md ${
                isActive(link.path)
                  ? 'text-green-600 bg-green-50'
                  : 'text-gray-600'
              }`}
            >
              <link.icon className="h-5 w-5" />
              <span className="text-xs mt-1">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}