import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { User } from 'src/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import refreshJwtConfit from './config/refresh-jwt.confit';
import { RefreshJwtStrategy } from './strategies/refresh.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from './guards/roles/roles.guard';
import googleOauthConfig from './config/google-oauth.config';
import { GoogleStrategy } from './strategies/google.strategy';
import { Profile } from 'src/entities/profile.entity';
import { ProfileService } from 'src/profile/profile.service';
import { MailService } from 'src/mail/mail.service';
import { GoogleMobileStrategy } from './strategies/googleMobile.strategy';
import googleMobileOauthConfig from './config/google-mobile-oauth.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshJwtConfit),
    ConfigModule.forFeature(googleOauthConfig),
    ConfigModule.forFeature(googleMobileOauthConfig),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    ProfileService,
    MailService,
    UserService,
    LocalStrategy,
    JwtStrategy,
    RefreshJwtStrategy,
    GoogleMobileStrategy,
    GoogleStrategy,

    // Apply Guard Authentication & Authoization Globally
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, //@UseGuards(JwtAtuhGuard) applied on all API endpoints
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AuthModule {}
