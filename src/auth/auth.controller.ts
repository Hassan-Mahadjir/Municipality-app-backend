import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Put,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { Public } from './decorators/public.decorators';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { GoogleMobileAuthGuard } from './guards/google-auth/google-mobile-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user.id);
  }

  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  refreshToken(@Req() req) {
    return this.authService.refreshToken(req.user.id);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Post('signout')
  signOut(@Req() req) {
    this.authService.signOut(req.user.id);
    return { status: HttpStatus.OK, message: 'User Has Signed out' };
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() {}

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Req() req, @Res() res) {
    const response = await this.authService.login(req.user.id);

    // redirect to website
    res.redirect(`http://localhost:8081?token=${response.data.accessToken}`);
  }

  @Public()
  @UseGuards(GoogleMobileAuthGuard)
  @Get('google/mobile-login')
  googleMobileLogin() {}

  @Public()
  @UseGuards(GoogleMobileAuthGuard)
  @Get('google/mobile-callback')
  async googleMobileCallback(@Req() req, @Res() res) {
    const response = await this.authService.login(req.user.id);

    // redirect to app URL with token
    res.redirect(`myapp://home?token=${response.data.accessToken}`);
  }

  @UseGuards(JwtAuthGuard)
  @Put('change-password')
  async changePassword(
    @Body() changePassordDto: ChangePasswordDto,
    @Req() req,
  ) {
    return this.authService.changePassword(
      req.user.id,
      changePassordDto.oldPassword,
      changePassordDto.newPassword,
    );
  }

  // TODO: forget password
  @Public()
  @Post('send-code-email')
  async forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    return this.authService.sendCodeEmail(forgetPasswordDto.email);
  }

  @Public()
  @Patch('reset-password')
  async resetPassword(@Body() resetPasswordDto: CreateUserDto) {
    return this.authService.resetPassword(
      resetPasswordDto.email,
      resetPasswordDto.password,
    );
  }

  @Public()
  @Post('validate-resetCode')
  async validateResetCode(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.validateCode(
      resetPasswordDto.email,
      resetPasswordDto.resetCode,
    );
  }
}
