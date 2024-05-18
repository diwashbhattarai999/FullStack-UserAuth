import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="text-foreground">
      <Outlet />
    </div>
  );
};

export default Layout;
