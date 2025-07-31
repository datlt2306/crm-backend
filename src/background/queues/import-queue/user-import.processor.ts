import { CreateUserDto } from '@/api/users/dto/create-user.dto';
import { UserEntity } from '@/api/users/entities/user.entity';
import { Process, Processor } from '@nestjs/bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bull';
import * as csv from 'csv-parse/sync';
import { Repository } from 'typeorm';
import * as XLSX from 'xlsx';

@Processor('user-import')
export class UserImportProcessor {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  @Process()
  async handleImport(job: Job) {
    const { buffer, mimetype, originalname, uploaderId } = job.data;
    let users: CreateUserDto[] = [];
    const errors: { row: number; error: string }[] = [];
    let imported = 0;

    // Parse file
    try {
      if (mimetype === 'text/csv' || originalname.endsWith('.csv')) {
        const records = csv.parse(buffer, {
          columns: true,
          skip_empty_lines: true,
          trim: true,
        });
        users = records as CreateUserDto[];
      } else if (
        mimetype ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        originalname.endsWith('.xlsx')
      ) {
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        users = XLSX.utils.sheet_to_json(sheet) as CreateUserDto[];
      } else {
        errors.push({ row: 0, error: 'Unsupported file format' });
        return { imported, errors, total: 0 };
      }
    } catch (err) {
      errors.push({ row: 0, error: 'File parsing error' });
      return { imported, errors, total: 0 };
    }

    // Validate & import từng dòng
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      // Validate bắt buộc
      if (!user.email || !user.name) {
        errors.push({ row: i + 2, error: 'Thiếu email hoặc tên' });
        continue;
      }
      // Validate email
      if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(user.email)) {
        errors.push({ row: i + 2, error: 'Email không hợp lệ' });
        continue;
      }
      // Validate role nếu có
      // if (!['ADMIN', 'USER'].includes(user.role)) { ... }

      // Kiểm tra trùng email
      try {
        const existed = await this.userRepository.findOne({
          where: { email: user.email },
        });
        if (existed) {
          errors.push({ row: i + 2, error: 'Email đã tồn tại' });
          continue;
        }
        await this.userRepository.save(this.userRepository.create(user));
        imported++;
      } catch (e) {
        errors.push({
          row: i + 2,
          error: 'Lỗi hệ thống: ' + (e.message || ''),
        });
      }
    }

    // Có thể log lại uploaderId, thời gian, ...
    return {
      imported,
      failed: errors.length,
      total: users.length,
      errors,
    };
  }
}
