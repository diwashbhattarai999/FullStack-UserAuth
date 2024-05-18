import { Outlet } from 'react-router-dom';
import Footer from '@/components/sections/footer/footer';
import Navbar from '@/components/sections/navbar/nav';

const RootLayout = () => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />
      <main className="my-8 flex-1 min-h-[50vh]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
