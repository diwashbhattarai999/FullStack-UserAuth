import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

import { RootState } from '@/redux/store';

import Logo from '@/components/common/logo';

const AuthLayout = () => {
  const user = useSelector((state: RootState) => state.user.currentUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  if (user) {
    return null;
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen w-full bg-primary/5 relative">
      <div className="flex flex-col items-center justify-between gap-8 max-w-[28rem] w-full h-full my-5">
        <Logo className="-ml-1" />
        <Outlet />
      </div>

      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] rounded-full blur-3xl -z-10 pointer-events-none bg-gradient-to-br from-accent dark:from-accent to-transparent"></div>
    </main>
  );
};

export default AuthLayout;
