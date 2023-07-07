import { Injectable } from '@nestjs/common';
import { createStudentDto, editStudentDto } from '../dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from '../../Database/student.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}
  async createStudent(dto: createStudentDto) {
    try {
      const student = this.studentRepository.create(dto);
      const newStudent = await this.studentRepository.save(student);
      return {
        message: 'Student is created succesfully',
        student: newStudent,
      };
    } catch (error) {
      return {
        error,
      };
    }
  }
  async getStudents() {
    try {
      const student = await this.studentRepository.find();
      return {
        message: 'List of All Students',
        student,
      };
    } catch (error) {
      return { error };
    }
  }
  async getStudentById(id: number) {
    try {
      const student = await this.studentRepository.findOne({ where: { id } });
      if (student) {
        return {
          student,
        };
      } else {
        return {
          error: 'User does not exist',
        };
      }
    } catch (error) {
      return { error };
    }
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
    try {
      const student = await this.studentRepository.findOne({ where: { id } });
      if (student) {
        await this.studentRepository.delete({ id });
        return {
          message: `Student is Deleted Successfully`,
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
}
