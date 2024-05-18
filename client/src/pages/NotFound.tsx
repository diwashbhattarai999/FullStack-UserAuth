import { MoveLeft } from 'lucide-react';

import { Button } from '@/components/ui/button/Button';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center gap-16">
      <img width={500} height={500} src="/images/not-found.svg" alt="Not found" />
      <span className="text-3xl mx-auto">Page Not Found</span>

      {/* Back to home Btn */}
      <Link to="/">
        <Button variant={'outline'} size={'lg'} className="h-14 rounded-sm">
          <MoveLeft aria-hidden="true" className=" text-2xl group-hover:-translate-x-1 transition-transform" />
          <p>Back to home</p>
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
