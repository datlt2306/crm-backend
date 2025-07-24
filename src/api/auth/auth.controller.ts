import { UserEntity } from '@/api/users/entities/user.entity';
import { ErrorCode } from '@/constants/error-code.constant';
import { ApiAuth, ApiPublic } from '@/decorators/http.decorators';
import {
  Controller,
  Delete,
  Get,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { UserService } from '../users/user.service';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  @ApiPublic()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Guard redirects to Google
  }

  @ApiPublic()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');

    const response = req.user as {
      data: UserEntity;
      success: boolean;
    };

    if (!response.success) {
      res.redirect(`${frontendUrl}/login?error=${ErrorCode.E003}`);
    }

    // Redirect to frontend with user data and access token save to cookies
    res.cookie('accessToken', this.authService.generateJwt(response.data), {
      httpOnly: true,
      secure: true,
    });

    res.redirect(frontendUrl);
  }

  @ApiPublic()
  @Delete('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: true,
    });

    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  }

  @ApiAuth({
    summary: 'Get current user',
    description: 'Returns the current authenticated user information.',
  })
  @Get('me')
  async getMe(@Req() req: Request) {
    const user = req.user as UserEntity;

    const email = user?.email;
    if (!email) {
      throw new UnauthorizedException('Email not found in user data');
    }

    const userData = await this.userService.findOneByEmail(email);

    if (!userData) {
      throw new UnauthorizedException('User not found');
    }

    return userData;
  }
}
