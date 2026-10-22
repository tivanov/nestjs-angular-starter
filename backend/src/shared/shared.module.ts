import { Module } from '@nestjs/common';
import { UploadsDirectoryService } from './services/uploads-directory.service';

@Module({
  imports: [],
  providers: [UploadsDirectoryService],
  exports: [],
})
export class SharedModule {}
