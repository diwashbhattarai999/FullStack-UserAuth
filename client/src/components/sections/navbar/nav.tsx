import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { RootState } from '@/redux/store';
import { NAV_LINKS } from '@/constants';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button/Button';
import Logo from '@/components/common/logo';
import MaxWidthContainer from '@/components/common/max-width-container';
import MobileNav from '@/components/sections/navbar/mobile-nav';
import UserProfile from '@/components/sections/navbar/user-profile';

const Navbar = () => {
  const location = useLocation();
  const pathname = location.pathname.split('/')[1];
  const [activeLink, setActiveLink] = useState(`/${pathname}`);

  const user = useSelector((state: RootState) => state.user.currentUser);

  return (
    <div className="py-3 sm:py-5 border-b border-border/50">
      <MaxWidthContainer className="flex items-center justify-between gap-8">
        {/* Logo */}
        <Logo />

        {/* Nav Links */}
        <div className="flex items-center gap-2 lg:gap-4 xl:gap-8 justify-center">
          <div className="hidden lg:flex items-center gap-10 rounded-full relative">
            {/* Links */}
            {NAV_LINKS.map((link) => {
              return (
                <Link
                  key={link.path}
                  onMouseEnter={() => setActiveLink(link.path)}
                  onMouseLeave={() => setActiveLink(`/${pathname}`)}
                  to={link.path}
                  className={cn(
                    "font-medium text-base whitespace-nowrap z-50 after:block after:content-[''] after:h-[3px] after:w-[85%] after:bg-primary after:scale-x-0 after:transition-transform after:duration-500 hover:after:scale-x-125 after:origin-[0%_50%]",
                    {
                      'after:scale-x-125': activeLink === link.path,
                    }
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="max-sm:hidden ml-8 flex items-center gap-2 lg:gap-4">
            {user ? (
              <>
                {/* Dashboard */}
                <Link to={'/settings/general'}>
                  <Button variant={'default'} className="rounded-full hover:rounded-md font-semibold text-base">
                    Settings
                  </Button>
                </Link>

                {/* User Profile */}
                <UserProfile />
              </>
            ) : (
              <>
                {/* Show if user is not logged in */}
                <div className="ml-5 xl:ml-20 flex items-center gap-2 lg:gap-4">
                  {/* Signin button */}
                  <Link to={'/login'}>
                    <Button variant={'default'} className="rounded-full px-12 hover:rounded-md font-semibold text-base">
                      Signin
                    </Button>
                  </Link>

                  {/* Github Icon */}
                  <Link to="https://github.com/diwashbhattarai999/FullStack-UserAuth" target="_blank">
                    <Button variant={'ghost'} size={'icon'} aria-label="Github">
                      <img src="/images/github.svg" alt="GitHub" />
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Mobile Nav */}
          <MobileNav />
        </div>
      </MaxWidthContainer>
    </div>
  );
};

export default Navbar;
