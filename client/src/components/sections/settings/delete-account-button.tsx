import { useState, useTransition } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '@/redux/store';

import { Button } from '@/components/ui/button/Button';
import ConfirmationPopup from '@/components/ui/confirmation-popup';
import FormError from '@/components/common/form-error';
import FormSuccess from '@/components/common/form-success';

const DeleteAccountButton = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();

  const user = useSelector((state: RootState) => state.user.currentUser);

  const handleConfirmation = () => {
    setShowConfirmation(true);
  };

  const handleDeleteAccount = () => {
    // TODO: handle deletion
  };

  return (
    <>
      {/* Delete confirmation */}

      <ConfirmationPopup
        heading="Delete your account"
        showConfirmation={showConfirmation}
        setShowConfirmation={setShowConfirmation}
        cancelButtonLabel="Cancel"
        confirmButtonLabel="Delete Account"
        handleSubmit={handleDeleteAccount}
        isPending={isPending}
      >
        <div>
          <div className="font-medium text-lg">Are you sure you want to delete your account?</div>
          <div className="text-muted-foreground text-sm">
            By confirming, you acknowledge that this action is irreversible. Please be aware that all your data and
            settings will be permanently deleted. Make sure to back up any important information before proceeding.
          </div>
        </div>
      </ConfirmationPopup>

      {/* Sucess Message */}
      {success && <FormSuccess message={success} />}

      {/* Error Message */}
      {error && <FormError message={error} />}

      <Button variant={'destructive'} onClick={handleConfirmation} disabled={isPending}>
        Delete your account
      </Button>
    </>
  );
};

export default DeleteAccountButton;
