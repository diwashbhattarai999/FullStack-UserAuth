import { useState } from 'react';
import { LogOut, LucideIcon, UserCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '@/redux/store';

import { cn } from '@/lib/utils';
import { removeUser } from '@/redux/features/userSlice';

const UserProfile = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    dispatch(removeUser());
    navigate('/login', { replace: true });
  };

  const user = useSelector((state: RootState) => state.user.currentUser);

  const MENU_ITEMS: {
    label: string;
    icon: LucideIcon;
    onClick: () => void;
    link?: string;
  }[] = [
    {
      label: 'Manage Profile',
      icon: UserCircle2,
      onClick: () => {
        setIsProfileOpen(false);
      },
      link: '/settings/general',
    },
  ];

  return (
    <div className="relative">
      <img
        src={user?.image || '/images/default-profile.png'}
        alt="profile"
        width={100}
        height={100}
        className="rounded-full cursor-pointer h-9 w-9 group-hover:opacity-70 object-contain"
        onClick={() => setIsProfileOpen((currValue) => !currValue)}
      />

      <div
        className={cn(
          'absolute right-0 z-30 px-2 py-3 rounded-md shadow-md min-w-52 w-full top-14 bg-background border border-border text-foreground duration-300',
          isProfileOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-5 pointer-events-none'
        )}
      >
        <div className="flex flex-col gap-2">
          <div>
            <span className="px-2 py-3 font-medium rounded-md text-muted-foreground">
              @{user?.email?.split('@')[0]}
            </span>
          </div>

          <div className="bg-border h-[1px] w-full"></div>

          {MENU_ITEMS.map((item, index) => {
            return (
              <div
                key={index}
                onClick={item.onClick}
                className="flex items-center gap-3 px-2 font-medium transition-colors rounded-md cursor-pointer hover:bg-muted border border-transparent hover:border-border text-secondary-foreground"
              >
                {item.link ? (
                  <Link to={item.link}>
                    <div className="flex items-center gap-3">
                      <item.icon className="w-auto py-3 h-11" />
                      <h3>{item.label}</h3>
                    </div>
                  </Link>
                ) : (
                  <div className="flex items-center gap-3">
                    <item.icon className="w-auto py-3 h-11" />
                    <h3>{item.label}</h3>
                  </div>
                )}
              </div>
            );
          })}

          <div
            onClick={handleLogout}
            className="flex items-center gap-3 px-2 font-medium transition-colors rounded-md cursor-pointer hover:bg-muted border border-transparent hover:border-border text-secondary-foreground"
          >
            <LogOut className="w-auto py-3 h-11" />
            <h3>Logout</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
