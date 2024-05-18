import Logo from '@/components/common/logo';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
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
