import { Injectable } from '@nestjs/common';
import { createStudentDto, editStudentDto } from '../dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from '../../Database/student.entity';
import { Repository } from 'typeorm';
import {
  createstudent,
  DeleteStudent,
  GetStudentById,
} from '../helper/studentqueries';
@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}
  async createStudent(dto: createStudentDto) {
    return await createstudent(this.studentRepository, dto);
  }
  async getStudents() {
    try {
      const student = await this.studentRepository.find();
      if (student.length < 0) {
        console.log(student.length)
        return {
          message: 'No Students Available ',
        };
      } else {
        return {
          message: 'List of All Students',
          student,
        };
      }
    } catch (error) {
      return { error };
    }
  }
  async getStudentById(id: number) {
    return await GetStudentById(id, this.studentRepository);
  }
  async editStudent(dto: editStudentDto, id: number) {
    try {
      const student = await this.studentRepository.findOne({ where: { id } });
      if (student) {
        await this.studentRepository.update({ id }, { ...dto });
        return {
          message: `Student is Successfully Updated`,
        };
      } else {
        return {
          error: 'Student does not exist',
        };
      }
    } catch (error) {
      return { error };
    }
  }
  async deleteStudent(id: number) {
    return await DeleteStudent(id, this.studentRepository);
  }
}
