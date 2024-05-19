import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRound, Mail, UserCircle } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as z from 'zod';
import axios from 'axios';

import { RegisterSchema } from '@/schemas';

import { Button } from '@/components/ui/button/Button';
import FormError from '@/components/common/form-error';
import FormSuccess from '@/components/common/form-success';
import Input from '@/components/ui/Input';
import CardWrapper from '@/components/common/card-wrapper';

const defaultValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const RegisterPage = () => {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, setIsPending] = useState(false);

  const {
    register: reg,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues,
  });

  const onSubmit: SubmitHandler<typeof defaultValues> = (values: z.infer<typeof RegisterSchema>) => {
    setError('');
    setSuccess('');
    setIsPending(true);

    const { email, password, confirmPassword, name } = values;
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsPending(false);
      return;
    }

    (async () => {
      await axios
        .post(
          `${import.meta.env.VITE_SERVER_BASE_URL}api/auth/signup`,
          { email, password, name },
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          }
        )
        .then((res) => {
          if (res.data.success) {
            setSuccess(res.data.message);
            reset();
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
      headerLabel="Register"
      subHeaderLabel="Join us today"
      backButtonHref="/login"
      backButtonLabel="Already have an account ? Login Now"
      showSocial
      disabled={isPending}
      wrapperClassName="min-h-fit"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* User Inputs -- UserName */}
        <Input
          label="Full Name"
          name="name"
          type="text"
          placeholder="Full Name"
          icon={UserCircle}
          error={errors.name?.message}
          disabled={isPending}
          register={reg('name')}
        />

        {/* User Inputs -- Email */}
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="Email"
          icon={Mail}
          error={errors.email?.message}
          disabled={isPending}
          register={reg('email')}
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
          register={reg('password')}
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
          register={reg('confirmPassword')}
        />

        {/* Sucess Message */}
        {success && <FormSuccess message={success} />}

        {/* Error Message */}
        {error && <FormError message={error} />}

        {/* Submit Button */}
        <Button disabled={isPending} type="submit" variant={'default'} size={'full'}>
          Register
        </Button>
      </form>
    </CardWrapper>
  );
};

export default RegisterPage;
