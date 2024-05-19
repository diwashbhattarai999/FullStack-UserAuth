import { useEffect, useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRound, Mail, Phone, UserCircle2, UserCog2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { SettingsProfileSchema } from '@/schemas';

import { Button } from '@/components/ui/button/Button';
import FormError from '@/components/common/form-error';
import FormSuccess from '@/components/common/form-success';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/select';
import Switch from '@/components/ui/switch';
import ChangeProfileImg from '@/components/sections/settings/change-profile';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const SettingsForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const [selectValue, setSelectValue] = useState('Select a Role');

  const user = useSelector((state: RootState) => state.user.currentUser);

  const defaultValues = {
    name: user?.name || undefined,
    email: user?.email || undefined,
    phone: user?.phone || undefined,
    password: undefined,
    newPassword: undefined,
    role: user?.role || undefined,
    isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
  };

  useEffect(() => {
    if (user) {
      setSelectValue(user.role);
    }
  }, [user]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<z.infer<typeof SettingsProfileSchema>>({
    resolver: zodResolver(SettingsProfileSchema),
    defaultValues: defaultValues,
  });

  const onSubmit = (values: z.infer<typeof SettingsProfileSchema>) => {
    console.log(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="z-0 flex flex-col items-start my-5">
      <div className="w-full flex flex-col-reverse sm:flex-row items-start gap-12">
        {/* Inputs */}
        <div className="flex flex-col items-start w-full">
          {/* User Inputs -- Name */}
          <Input
            label="Name"
            name="name"
            type="text"
            placeholder="Full name"
            icon={UserCircle2}
            error={errors.name?.message}
            disabled={isPending}
            register={register('name')}
          />

          {/* User Inputs -- Email */}
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="name@example.com"
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

          {/* User Inputs -- New Password */}
          <Input
            label="New Password"
            name="newPassword"
            type="password"
            placeholder="******"
            icon={KeyRound}
            error={errors.newPassword?.message}
            disabled={isPending}
            register={register('newPassword')}
          />

          {/* User Inputs -- Phone Number */}
          <Input
            label="Phone Number"
            name="phone"
            type="text"
            placeholder="Phone Number"
            icon={Phone}
            error={errors.phone?.message}
            disabled={isPending}
            register={register('phone')}
          />

          {/* User Inputs -- Role */}
          <Select
            selectLabel="Role"
            name="role"
            Icon={UserCog2}
            value={selectValue}
            setSelectValue={setSelectValue}
            error={errors.role?.message}
            disabled={isPending}
            register={register('role')}
            options={[
              { label: 'Admin', value: 'ADMIN' },
              { label: 'User', value: 'USER' },
            ]}
          />

          {/* User Inputs -- 2FA */}
          <Switch
            value={defaultValues.isTwoFactorEnabled}
            error={errors.isTwoFactorEnabled?.message}
            disabled={isPending}
            setValue={setValue}
            label="Two Factor Authentication"
            descriptions="Enable two factor authentication for your account"
          />

          {/* Sucess Message */}
          {success && <FormSuccess message={success} />}

          {/* Error Message */}
          {error && <FormError message={error} />}
        </div>

        <ChangeProfileImg />
      </div>

      {/* Submit Button */}
      <Button disabled={isPending} type="submit" size={'xl'}>
        Save
      </Button>
    </form>
  );
};

export default SettingsForm;
