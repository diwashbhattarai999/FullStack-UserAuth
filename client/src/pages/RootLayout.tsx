import { Outlet } from 'react-router-dom';
import Footer from '../components/sections/Footer';
import Navbar from '../components/sections/Navbar';

const RootLayout = () => {
  return (
    <main>
      <Navbar />
      <Outlet />
      <Footer />
    </main>
  );
};

export default RootLayout;
