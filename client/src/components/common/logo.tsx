import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface ILogoProps {
  className?: string;
}

const Logo = ({ className }: ILogoProps) => {
  return (
    <>
      <Link to="/" className={cn('relative text-xl md:text-3xl', className)}>
        FullStack UserAuth
      </Link>
    </>
  );
};

export default Logo;
