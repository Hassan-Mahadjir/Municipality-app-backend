import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import refreshJwtConfit from './config/refresh-jwt.confit';
import { ConfigType } from '@nestjs/config';
import * as argon2 from 'argon2';
import { CurrentUser } from './types/current-user';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { CreateProfileDto } from 'src/profile/dto/create-profile.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
    @Inject(refreshJwtConfit.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshJwtConfit>,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('User not found!');

    const isPasswordMatch = await argon2.verify(user.password, password);
    if (!isPasswordMatch) throw new UnauthorizedException('Invalid credetials');

    return { id: user.id };
  }

  async login(userId: number) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.userService.updateHashedRefreshToken(userId, hashedRefreshToken);
    return {
      message: 'Login sucessful',
      data: { id: userId, accessToken, refreshToken },
    };
  }

  async generateTokens(userId: number) {
    const payload: AuthJwtPayload = { sub: userId };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);

    return { accessToken, refreshToken };
  }

  async refreshToken(userId: number) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.userService.updateHashedRefreshToken(userId, hashedRefreshToken);
    return { id: userId, accessToken, refreshToken };
  }

  async validateRefreshToken(userId: number, refreshToken: string) {
    const user = await this.userService.findOne(userId);

    if (!user || !user.hashedRefreshToken)
      throw new UnauthorizedException('Invalid Refresh Token');

    const refreshTokenMatches = await argon2.verify(
      user.hashedRefreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches)
      throw new UnauthorizedException('Invalid Refresh Token');

    return { id: userId };
  }

  async signOut(userId: number) {
    await this.userService.updateHashedRefreshToken(userId, null);
  }

  async validateJwtUser(userId: number) {
    const user = await this.userService.findOne(userId);
    if (!user) throw new UnauthorizedException('user not found!');
    const currentUser: CurrentUser = { id: user.id, role: user.role };

    return currentUser;
  }

  async validateGoogleUser(
    googleUser: CreateUserDto,
    profileInfo: CreateProfileDto,
  ) {
    const user = await this.userService.findByEmail(googleUser.email);
    if (user) return user;

    return await this.userService.create(googleUser, profileInfo);
  }

  async changePassword(id: number, oldPassword: string, newPassword: string) {
    const user = await this.userService.findOne(id);
    if (!user) throw new NotFoundException('User not found!');

    const isPasswordMatch = await argon2.verify(user.password, oldPassword);
    if (!isPasswordMatch) throw new UnauthorizedException('Invalid credetials');

    const newHashedPassword = await argon2.hash(newPassword);
    return this.userService.updateHashedPassword(id, newHashedPassword);
  }

  async sendCodeEmail(email: string) {
    const user = await this.userService.findByEmail(email);
    if (user) {
      const restCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit code
      const hashedResetCode = await argon2.hash(restCode);
      const expiryDate = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry time

      user.resetCode = hashedResetCode;
      user.resetCodeExpiry = expiryDate;
      await this.userService.update(user.id, {
        resetCode: hashedResetCode,
        resetCodeExpiry: expiryDate,
      });

      this.mailService.sendPasswordResetEmail(email, restCode);
    }
    return {
      message:
        'If the this user exists, they will receive an email to reset the password.',
      data: `Check your email.`,
    };
  }

  async resetPassword(email: string, newPassword: string) {
    const user = await this.userService.findByEmail(email);

    const newHashedPassword = await argon2.hash(newPassword);
    user.password = newHashedPassword;

    await this.userService.update(user.id, { password: newHashedPassword });

    return { message: 'Password has been successfully reset.' };
  }

  async validateCode(email: string, resetCode: string) {
    const user = await this.userService.findByEmail(email);
    if (!user || !user.resetCode) {
      throw new UnauthorizedException('Invalid reset code.');
    }

    if (user.resetCodeExpiry < new Date()) {
      throw new UnauthorizedException('Reset code has expired');
    }

    const isCodeValid = await argon2.verify(user.resetCode, resetCode);
    if (!isCodeValid) throw new UnauthorizedException('Invalid reset code.');

    return { message: 'the reset code is correct.', data: isCodeValid };
  }
}
