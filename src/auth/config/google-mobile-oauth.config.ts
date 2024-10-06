import { registerAs } from '@nestjs/config';

export default registerAs('googleMoblieOAuth', () => ({
  clientID: process.env.GOOGLE_CLIENT_ID_MOBILE,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  // callbackURL: process.env.GOOGLE_CALLBACK_URL,
  mobileCallbackURL: process.env.GOOGLE_CALLBACK_URL_MOBILE,
}));
