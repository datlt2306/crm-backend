import { UserEntity } from '@/api/users/entities/user.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateJwt(user: UserEntity): string {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
    };
    const options: JwtSignOptions = {
      algorithm: 'RS256',
    };
    return this.jwtService.sign(payload, options);
  }

  verifyAccessToken(token: string) {
    try {
      const options: JwtVerifyOptions = {
        algorithms: ['RS256'],
      };
      const payload = this.jwtService.verify(token, options);
      return payload;
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Access token has expired');
      }
      if (err.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid access token');
      }
      if (err.name === 'NotBeforeError') {
        throw new UnauthorizedException('Token not active yet');
      }
      throw new UnauthorizedException('Access token verification failed');
    }
  }
}
