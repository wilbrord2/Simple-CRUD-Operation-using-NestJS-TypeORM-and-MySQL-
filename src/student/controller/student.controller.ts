import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { StudentService } from '../service/student.service';
import { createStudentDto, editStudentDto } from '../dto';

@Controller('student')
export class StudentController {
  constructor(private student: StudentService) {}
  @HttpCode(201)
  @Post('create')
  async createStudent(@Body() dto: createStudentDto) {
    return await this.student.createStudent(dto);
  }
  @Get()
  async getStudents() {
    return await this.student.getStudents();
  }
  @Get(':id')
  async getStudentById(@Param('id', ParseIntPipe) studentId: number) {
    return await this.student.getStudentById(studentId);
  }
  @Patch(':id')
  async editStudent(
    @Body() dto: editStudentDto,
    @Param('id', ParseIntPipe) studentId: number,
  ) {
    return await this.student.editStudent(dto, studentId);
  }
  @Delete(':id')
  async deleteStudent(@Param('id', ParseIntPipe) studentId: number) {
    return await this.student.deleteStudent(studentId);
  }
}
