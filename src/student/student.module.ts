import { Module } from '@nestjs/common';
import { StudentController } from './controller/student.controller';
import { StudentService } from './service/student.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from 'src/Database/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Student])],
  exports: [TypeOrmModule],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}
