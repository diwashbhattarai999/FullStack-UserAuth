import FormError from '@/components/common/form-error';
import ErrorCard from '@/components/common/error-card';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface RoleGateProps {
  children: React.ReactNode;
  allowedRole: ('USER' | 'ADMIN')[];
  backButtonLabel: string;
  backButtonHref: string;
}

export const RoleGate = ({ children, allowedRole, backButtonLabel, backButtonHref }: RoleGateProps) => {
  const role = useSelector((state: RootState) => state.user.currentUser?.role);

  if (role && !allowedRole.includes(role)) {
    return (
      <ErrorCard backButtonHref={backButtonHref} backButtonLabel={backButtonLabel} logout>
        <FormError message="You do not have permission to view this content!" />
      </ErrorCard>
    );
  }

  return <>{children}</>;
};

{
  /* <RoleGate allowedRole={['ADMIN', 'USER']} backButtonHref="/" backButtonLabel="Go to Home"></RoleGate> */
}
