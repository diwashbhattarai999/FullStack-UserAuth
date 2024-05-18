import { ulid } from 'ulidx';

import { getVerificationTokenByEmail } from '../data/verification-token';
import { db } from '../models/db';

// Function to generate a verification token
export const generateVerificationToken = async (email: string) => {
  // Generate a unique token using UUIDv4
  const token = ulid();

  // Set the expiration time to 1 hour from the current time
  const expires = new Date(new Date().getTime() + 60 * 60 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  // If an existing token is found, delete it
  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  // Create a new verification token in the database
  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return verificationToken;
};
