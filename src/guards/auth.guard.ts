import { AuthService } from '@/api/auth/auth.service';
import { UserService } from '@/api/users/user.service';
import { IS_AUTH_OPTIONAL, IS_PUBLIC } from '@/constants/app.constant';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
    private userService: UserService, // Assuming UserService is injected to fetch user data
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const isAuthOptional = this.reflector.getAllAndOverride<boolean>(
      IS_AUTH_OPTIONAL,
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest();
    const accessToken = this.extractToken(request);

    if (isAuthOptional && !accessToken) {
      return true;
    }
    if (!accessToken) {
      throw new UnauthorizedException();
    }

    request['user'] = await this.authService.verifyAccessToken(accessToken);

    const email = request['user']?.email;
    if (!email) {
      throw new UnauthorizedException();
    }

    const userData = await this.userService.findOneByEmail(email);

    if (!userData) {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractToken(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type === 'Bearer' && token) {
      return token;
    }
    console.log('Extracting token from cookies', token);

    return request.cookies ? request.cookies.accessToken : undefined;
  }
}
