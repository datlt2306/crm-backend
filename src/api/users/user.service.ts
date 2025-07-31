import { PageOptionsDto } from '@/common/dto/offset-pagination/page-options.dto';
import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { ResponseDto } from '@/common/dto/response/response.dto';
import { Uuid } from '@/common/types/common.type';
import { paginate } from '@/utils/offset-pagination';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResDto } from './dto/user.res.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(data: CreateUserDto): Promise<ResponseDto<UserResDto>> {
    const user = this.userRepository.create(data);
    await this.userRepository.save(user);
    return new ResponseDto({
      data: plainToInstance(UserResDto, user, {
        excludeExtraneousValues: true,
      }),
      message: 'User created successfully',
    });
  }

  async findAll(
    reqDto: PageOptionsDto,
  ): Promise<OffsetPaginatedDto<UserResDto>> {
    const query = this.userRepository
      .createQueryBuilder('user')
      .where('user.isActive = :isActive', { isActive: true });

    if (reqDto.q) {
      query.andWhere('user.name ILIKE :search OR user.email ILIKE :search', {
        search: `%${reqDto.q}%`,
      });
    }

    if (reqDto.order) {
      query.orderBy(`user.name`, reqDto.order);
    }

    const [users, metaDto] = await paginate<UserEntity>(query, reqDto, {
      skipCount: false,
      takeAll: false,
    });

    return new OffsetPaginatedDto({
      data: plainToInstance(UserResDto, users, {
        excludeExtraneousValues: true,
      }),
      meta: metaDto,
      message: 'Users retrieved successfully',
    });
  }

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: {
        email,
        isActive: true,
      },
    });
  }

  async remove(id: Uuid) {
    await this.userRepository.findOneByOrFail({ id });
    await this.userRepository.softDelete(id);
  }

  async importUsers(file: Express.Multer.File): Promise<ResponseDto<void>> {
    if (!file)
      return new ResponseDto({
        data: null,
        message: 'No file uploaded',
      });

    // const records =

    // return;
  }
}
