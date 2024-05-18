'use client';

import { useCallback, useEffect, useState } from 'react';

import FormError from '@/components/common/form-error';
import FormSuccess from '@/components/common/form-success';
import CardWrapper from '@/components/common/card-wrapper';
import { useSearchParams } from 'react-router-dom';

const NewVerificationPage = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const onSubmit = useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError('Missing token!');
      return;
    }

    console.log(token);
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Verify your account"
      subHeaderLabel="Confirming your verification"
      backButtonLabel="Back to login"
      backButtonHref="/login"
      wrapperClassName="min-h-fit"
    >
      <div className="flex items-center justify-center w-full">
        {/* //TODO: Add a loader here */}
        {!success && !error && <h2>Loading...</h2>}
        <FormSuccess message={success} />
        {!success && <FormError message={error} />}
      </div>
    </CardWrapper>
  );
};

export default NewVerificationPage;
