import MaxWidthContainer from '@/components/common/max-width-container';
import { IUser } from '@/types';
import axios from 'axios';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

const DashboardPage = () => {
  const [users, setUsers] = useState<null | IUser[]>(null);

  useEffect(() => {
    (async () => {
      await axios
        .get(`${import.meta.env.VITE_SERVER_BASE_URL}api/profile/getUsers`)
        .then((res) => {
          setUsers(res.data.data.users);
          // console.log(res.data.data.users);
        })
        .catch((err) => {
          console.log(err);
        });
    })();
  }, []); // Add an empty dependency array to avoid infinite re-renders

  return (
    <MaxWidthContainer>
      <div className="text-6xl font-semibold my-5 text-muted">All Users</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users?.map((user, index) => {
          if (!user) return <div key={index}>Loading...</div>;

          return (
            <div
              key={user.id}
              className="p-4 border border-border rounded shadow-sm bg-muted text-muted-foreground text-lg"
            >
              <p className="font-medium text-2xl text-center mb-4">{user.name}</p>
              <div className="text-secondary-foreground">
                <p>Email: {user.email}</p>
                <p>{dayjs(user.emailVerified).format('YYYY-MM-DD')}</p>
                {user.image && (
                  <img src={user.image} alt={`${user.name}'s profile`} className="w-16 h-16 rounded-full" />
                )}
                <p>{user.isTwoFactorEnabled ? '2FA Enabled' : '2FA Disabled'}</p>
                <p>{user.phone}</p>
                <p>{user.role}</p>
                <p>{dayjs(user.createdAt).format('YYYY-MM-DD HH:mm')}</p>
                <p>{dayjs(user.updatedAt).format('YYYY-MM-DD HH:mm')}</p>
              </div>
            </div>
          );
        })}
      </div>
    </MaxWidthContainer>
  );
};

export default DashboardPage;
