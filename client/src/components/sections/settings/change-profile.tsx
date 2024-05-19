import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button/Button';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const ChangeProfileImg = () => {
  const user = useSelector((state: RootState) => state.user.currentUser);

  const [imageUrl, setImageUrl] = useState(user?.image ?? '');

  // Delete profile image
  const handleProfileDelete = () => {
    // TODO: handle profile deletion
    setImageUrl('');
    toast.success('Profile deleted');
  };

  // Upload profile image
  const handleImageUpload = () => {
    // TODO: handle image upload
  };

  // Handle image upload error
  // const handleImageUploadError = (err: Error) => {
  //   toast.error(`ERROR! ${err.message}`);
  // };

  return (
    <>
      <div className="mb-4 text-left flex flex-col items-center gap-4">
        <div className="h-48 w-48 p-1 rounded-full cursor-pointer duration-300 relative">
          <img
            src={imageUrl || '/images/default-profile.png'}
            alt="Profile"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="w-full h-full rounded-full aspect-square"
          />
        </div>

        <div className="flex gap-4 items-start">
          <Button type="button" size={'full'} onClick={handleImageUpload}>
            Upload
          </Button>
          <Button type="button" variant={'destructive'} size={'full'} onClick={handleProfileDelete}>
            Delete
          </Button>
        </div>
      </div>
    </>
  );
};

export default ChangeProfileImg;
