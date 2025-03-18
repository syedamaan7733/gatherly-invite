
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Plus, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-300',
        isScrolled ? 'py-4 bg-white/80 backdrop-blur-md shadow-subtle' : 'py-6 bg-transparent'
      )}
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 text-foreground">
          <Calendar className="h-6 w-6 text-primary" />
          <span className="text-xl font-medium">Gatherly</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink to="/" active={location.pathname === "/"}>
            Home
          </NavLink>
          <NavLink to="/events" active={location.pathname.includes("/events") && !location.pathname.includes("/create")}>
            Events
          </NavLink>
          <Link
            to="/create"
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-full hover:bg-secondary focus:outline-none"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/90 backdrop-blur-md shadow-sm animate-fade-in py-4">
          <div className="container px-4 flex flex-col space-y-4">
            <NavLink to="/" active={location.pathname === "/"} mobile>
              Home
            </NavLink>
            <NavLink to="/events" active={location.pathname.includes("/events") && !location.pathname.includes("/create")} mobile>
              Events
            </NavLink>
            <Link
              to="/create"
              className="btn-primary w-full flex justify-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

interface NavLinkProps {
  to: string;
  active: boolean;
  children: React.ReactNode;
  mobile?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, active, children, mobile }) => {
  return (
    <Link
      to={to}
      className={cn(
        "relative px-1 py-2 font-medium transition-colors duration-200",
        mobile ? "text-lg block w-full" : "text-sm",
        active 
          ? "text-foreground" 
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
      {active && (
        <span 
          className={cn(
            "absolute bg-primary",
            mobile ? "left-0 bottom-0 w-2 h-full rounded-r-md" : "left-0 -bottom-1 w-full h-0.5 rounded-full"
          )} 
        />
      )}
    </Link>
  );
};

export default Navbar;
