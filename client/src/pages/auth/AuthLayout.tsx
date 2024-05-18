import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <main>
      Auth page
      <Outlet />
    </main>
  );
};

export default AuthLayout;
