import { UserEntity } from '@/api/users/entities/user.entity';
import { ResponseDto } from '@/common/dto/response/response.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { UserResDto } from '../users/dto/user.res.dto';

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
      console.log('Verifying access token:', token);
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

  getMe(): Promise<ResponseDto<UserResDto>> {
    // This method should be implemented to return the current user's information
    throw new Error('Method not implemented.');
  }
}
