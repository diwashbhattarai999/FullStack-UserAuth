import { useState } from 'react';

import { Menu, X } from 'lucide-react';

import { NAV_LINKS } from '@/constants';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button/Button';
import { Link, useLocation } from 'react-router-dom';

const MobileNav = () => {
  const [showMenu, setShowMenu] = useState(false);
  const location = useLocation();
  const pathname = location.pathname.split('/')[1];

  const handleToggleMenu = () => setShowMenu(!showMenu);

  return (
    <div className="relative w-7 h-7 ml-5 lg:hidden z-50">
      {/* Hamburger Icons */}
      {/* Close */}
      <X
        className={cn(
          'cursor-pointer w-full h-full absolute z-50 inset-0 duration-300',
          showMenu ? 'rotate-0 opacity-100 pointer-events-auto' : 'rotate-180 opacity-0 pointer-events-none'
        )}
        onClick={handleToggleMenu}
      />

      {/* Hamburger */}
      <Menu
        className={cn(
          'cursor-pointer w-full h-full absolute z-50 inset-0 duration-300',
          showMenu ? 'rotate-180 opacity-0 pointer-events-none' : 'rotate-0 opacity-100 pointer-events-auto'
        )}
        onClick={handleToggleMenu}
      />

      {/* Menu */}
      <div
        className={cn(
          'fixed inset-0 w-full h-screen bg-foreground/40 dark:bg-foreground/5 backdrop-blur-sm border-l border-border shadow-md z-30 duration-500 pointer-events-none hidden md:block',
          showMenu ? 'opacity-100' : 'opacity-0'
        )}
      ></div>
      <div
        className={cn(
          'fixed right-0 top-0 left-auto bottom-auto w-full md:w-1/2 h-screen flex items-center justify-center bg-background/70 backdrop-blur-sm border-l border-border shadow-md z-40 duration-500',
          showMenu ? 'translate-x-0  pointer-events-auto' : 'translate-x-[100%] pointer-events-none'
        )}
      >
        {/* Links */}
        <div className="flex flex-col gap-10 items-center">
          {NAV_LINKS.map((link) => {
            return (
              <div key={link.label} className="px-1">
                <Link
                  to={link.path}
                  className={cn(
                    'text-primary/90 text-3xl font-semibold',
                    pathname === link.path ? 'slider' : 'slider hover-slider'
                  )}
                  onClick={() => setShowMenu(false)}
                >
                  {link.label}
                </Link>
              </div>
            );
          })}

          <div className="xl:hidden flex items-center gap-4">
            <div className="ml-5 xl:ml-20">
              <Link to={'/login'}>
                <Button variant={'default'} size={'xl'}>
                  Signin
                </Button>
              </Link>
            </div>
            <div>
              <Link to={'/register'}>
                <Button variant={'outline'} size={'xl'}>
                  Signup
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
