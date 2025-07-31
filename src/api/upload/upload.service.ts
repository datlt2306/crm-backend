import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class UploadService {
  async saveFile(file: Express.Multer.File): Promise<string> {
    const uploadDir = join(process.cwd(), 'uploads');
    if (!existsSync(uploadDir)) mkdirSync(uploadDir);
    const filePath = join(uploadDir, file.originalname);
    writeFileSync(filePath, file.buffer);
    // Trả về đường dẫn truy cập file (có thể custom lại)
    return `/uploads/${file.originalname}`;
  }
}
