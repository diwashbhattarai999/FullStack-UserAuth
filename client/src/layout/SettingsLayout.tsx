import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

import { RootState } from '@/redux/store';

import MaxWidthContainer from '@/components/common/max-width-container';
import SettingOptions from '@/components/sections/settings/setting-options';
import Navbar from '@/components/sections/navbar/nav';
import Footer from '@/components/sections/footer/footer';

const SettingsLayout = () => {
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.user.currentUser);

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />
      <main className="my-8 flex-1">
        <MaxWidthContainer className="max-w-[1350px]">
          <div className="flex flex-col justify-center gap-10">
            {/* Header - Image & Name */}
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              {/* Profile Image */}
              <img
                src={user?.image || '/images/default-profile.png'}
                alt="profile"
                width={60}
                height={60}
                className="rounded-full cursor-pointer group-hover:opacity-70 object-cover"
              />

              {/* Profile Info */}
              <div>
                <div className="flex flex-row items-center gap-1">
                  {/* Profile Name */}
                  <span className="text-2xl">{user?.name} </span>

                  {/* Profile username */}
                  <span className="text-xl text-muted-foreground">({user?.email?.split('@')[0]})</span>
                </div>
                <div className="text-muted-foreground">Update your username and manage your account</div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-10 md:gap-12 lg:gap-16 xl:gap-20">
              <div className="w-full md:basis-[25%] flex flex-col gap-1">
                <SettingOptions />
              </div>

              <div className="w-full md:basis-[75%]">
                <Outlet />
              </div>
            </div>
          </div>
        </MaxWidthContainer>
      </main>
      <Footer />
    </div>
  );
};

export default SettingsLayout;
