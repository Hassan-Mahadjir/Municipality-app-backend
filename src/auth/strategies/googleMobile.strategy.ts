import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import googleMobileOauthConfig from '../config/google-mobile-oauth.config';
import { ConfigType } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleMobileStrategy extends PassportStrategy(
  Strategy,
  'google-mobile',
) {
  constructor(
    @Inject(googleMobileOauthConfig.KEY)
    private googleConfiguration: ConfigType<typeof googleMobileOauthConfig>,
    private authService: AuthService,
  ) {
    super({
      clientID: googleConfiguration.clientID,
      clientSecret: googleConfiguration.clientSecret,
      callbackURL: googleConfiguration.mobileCallbackURL, // Ensure this points to your mobile callback
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const user = await this.authService.validateGoogleUser(
      {
        email: profile.emails[0].value,
        password: '',
      },
      {
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        avatar: profile.photos[0].value,
        language: 'EN',
      },
    );
    return user;
  }
}
