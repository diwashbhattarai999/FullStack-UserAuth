import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Hash, KeyRound, Mail } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as z from 'zod';
import axios from 'axios';

import { LoginSchema } from '@/schemas';

import { Button } from '@/components/ui/button/Button';
import FormError from '@/components/common/form-error';
import FormSuccess from '@/components/common/form-success';
import Input from '@/components/ui/Input';
import CardWrapper from '@/components/common/card-wrapper';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '@/redux/features/userSlice';

const defaultValues = {
  email: '',
  password: '',
};

const LoginPage = () => {
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, setIsPending] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues,
  });

  const onSubmit: SubmitHandler<typeof defaultValues> = (values: z.infer<typeof LoginSchema>) => {
    setError('');
    setSuccess('');
    setIsPending(true);

    const { email, password, code } = values;

    (async () => {
      await axios
        .post(
          `${import.meta.env.VITE_SERVER_BASE_URL}api/auth/signin`,
          { email, password, code },
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          }
        )
        .then((res) => {
          if (res.data.success) {
            console.log(res.data);
            if (res.data.verified) {
              dispatch(setUser(res.data.data.user));
              reset();
              navigate('/');
            } else {
              setSuccess(res.data.message);
            }
          }
          if (res.data.twoFactor) {
            setShowTwoFactor(true);
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
      headerLabel={showTwoFactor ? 'Two Factor Code' : 'Login'}
      subHeaderLabel={showTwoFactor ? '' : 'Welcome back'}
      backButtonHref="/register"
      backButtonLabel="Don't have an account ? Register Now"
      showSocial={showTwoFactor ? false : true}
      disabled={isPending}
      wrapperClassName="min-h-fit"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-start">
        {/* 2FA  */}

        {showTwoFactor ? (
          <>
            {/* 2FA */}
            {/* User Inputs -- Code */}
            <Input
              label="2FA Code"
              name="code"
              type="number"
              placeholder="Code"
              icon={Hash}
              error={errors.code?.message}
              disabled={isPending}
              register={register('code')}
            />
          </>
        ) : (
          <>
            {/* User Inputs -- Email */}
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="Email"
              icon={Mail}
              error={errors.email?.message}
              disabled={isPending}
              register={register('email')}
            />

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
          </>
        )}

        {/* Sucess Message */}
        {success && <FormSuccess message={success} />}

        {/* Error Message */}
        {error && <FormError message={error} />}

        <Link to="/reset" className="underline text-secondary-foreground hover:text-primary text-sm mb-6">
          Forgot Password?
        </Link>

        {/* Submit Button */}
        <Button disabled={isPending} type="submit" variant={'default'} size={'full'}>
          {showTwoFactor ? 'Confirm' : 'Login'}
        </Button>
      </form>
    </CardWrapper>
  );
};

export default LoginPage;
