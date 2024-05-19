import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRound } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as z from 'zod';
import axios from 'axios';

import { NewPasswordSchema } from '@/schemas';

import { Button } from '@/components/ui/button/Button';
import FormError from '@/components/common/form-error';
import FormSuccess from '@/components/common/form-success';
import Input from '@/components/ui/Input';
import CardWrapper from '@/components/common/card-wrapper';
import { useNavigate, useSearchParams } from 'react-router-dom';

const defaultValues = {
  password: '',
  confirmPassword: '',
};

const NewPasswordPage = () => {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, setIsPending] = useState(false);

  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues,
  });

  const onSubmit: SubmitHandler<typeof defaultValues> = (values) => {
    setError('');
    setSuccess('');
    setIsPending(true);

    const { password, confirmPassword } = values;
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsPending(false);
      return;
    }

    (async () => {
      await axios
        .post(
          `${import.meta.env.VITE_SERVER_BASE_URL}api/auth/new-password`,
          { token, password },
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          }
        )
        .then((res) => {
          if (res.data.success) {
            setSuccess(res.data.message);

            setTimeout(() => {
              navigate('/login');
            }, 2000);
          }
        })
        .catch((err) => {
          console.log(err.response.data);
          setError(err.response.data.message);
        })
        .finally(() => setIsPending(false));
    })();
  };

  return (
    <CardWrapper
      headerLabel="Change Password"
      subHeaderLabel="Enter a new password"
      backButtonLabel="Back to login"
      backButtonHref="/login"
      disabled={isPending}
      wrapperClassName="min-h-fit"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* User Inputs -- Password */}
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="******"
          icon={KeyRound}
          error={errors.password?.message}
          disabled={isPending}
          register={register('password')}
        />

        {/* User Inputs -- Confirm Password */}
        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="******"
          icon={KeyRound}
          error={errors.confirmPassword?.message}
          disabled={isPending}
          register={register('confirmPassword')}
        />

        {/* Sucess Message */}
        {success && <FormSuccess message={success} />}

        {/* Error Message */}
        {error && <FormError message={error} />}

        {/* Reset Button */}
        <Button disabled={isPending} type="submit" variant={'default'} size={'full'}>
          Reset Password
        </Button>
      </form>
    </CardWrapper>
  );
};

export default NewPasswordPage;
