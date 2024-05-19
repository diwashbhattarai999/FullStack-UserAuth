'use client';

import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

import FormError from '@/components/common/form-error';
import FormSuccess from '@/components/common/form-success';
import CardWrapper from '@/components/common/card-wrapper';

const NewVerificationPage = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const navigate = useNavigate();

  const onSubmit = useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError('Missing token!');
      return;
    }

    (async () => {
      await axios
        .post(
          `${import.meta.env.VITE_SERVER_BASE_URL}api/auth/new-verification`,
          { token },
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
        });
    })();
  }, [token, success, error, navigate]);

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
