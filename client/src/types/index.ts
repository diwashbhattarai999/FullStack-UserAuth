export interface IUser {
  id: string;
  name: string;
  email: string;
  emailVerified: Date;
  password: string;
  image: string;
  phone: string;
  role: 'ADMIN' | 'USER';
  createdAt: Date;
  updatedAt: Date;
  isTwoFactorEnabled: boolean;
  twoFactorConfirmation: ITwoFactorConfirmation;
  twoFactorConfirmationId: string;
}

export interface ITwoFactorConfirmation {
  id: string;
  userId: string;
  user: IUser;
}
