import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { removeUser } from '@/redux/features/userSlice';

import { Button } from '@/components/ui/button/Button';
import MaxWidthContainer from './max-width-container';

interface ErrorCardProps {
  backButtonLabel: string;
  backButtonHref: string;
  logout?: boolean;
  children?: React.ReactNode;
}

const ErrorCard = ({ backButtonHref, backButtonLabel, logout, children }: ErrorCardProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    dispatch(removeUser());
    navigate('/login', { replace: true });
  };

  return (
    <MaxWidthContainer>
      <section className="flex min-h-[70vh] w-full flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-4xl">Oops! Something went wrong!</h2>

        <p>Could not find requested resource</p>

        <div>{children}</div>

        <div className="flex items-center justify-center gap-4 max-sm:flex-col">
          <Link to={backButtonHref}>
            <Button className="w-36">{backButtonLabel}</Button>
          </Link>
          {logout && (
            <Button onClick={handleLogout} className="w-28">
              Logout
            </Button>
          )}
        </div>
      </section>
    </MaxWidthContainer>
  );
};

export default ErrorCard;
