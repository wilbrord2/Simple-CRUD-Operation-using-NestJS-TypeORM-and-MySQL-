import { Repository } from 'typeorm';
import { createStudentDto } from '../dto';
import { Student } from '../../Database/student.entity';
import { createstudent, GetStudentById, DeleteStudent } from './studentqueries';
import { Test, TestingModule } from '@nestjs/testing';
import { StudentService } from '../service/student.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('Helpers', () => {
  let studentRepository: Repository<Student>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        {
          provide: getRepositoryToken(Student),
          useClass: Repository,
        },
      ],
    }).compile();
    studentRepository = module.get<Repository<Student>>(
      getRepositoryToken(Student),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('createstudent', () => {
    it('should create a new student', async () => {
      const dto: createStudentDto = {
        name: 'John Doe',
        email: 'john@example.com',
        level: 'Bachelor',
        combination: 'Science',
      };

      const student = {
        id: 1,
        ...dto,
      };

      jest.spyOn(studentRepository, 'create').mockReturnValue(student);
      jest.spyOn(studentRepository, 'save').mockResolvedValue(student);

      const expectedResult = {
        message: 'Student is created succesfully',
        student,
      };

      const result = await createstudent(studentRepository, dto);

      expect(result).toEqual(expectedResult);
      expect(studentRepository.create).toHaveBeenCalledWith(dto);
      expect(studentRepository.save).toHaveBeenCalledWith(student);
    });
  });

  describe('GetStudentById', () => {
    it('should get a student by ID', async () => {
      const id = 1;
      const student = {
        id,
        name: 'John Doe',
        email: 'john@example.com',
        level: 'Bachelor',
        combination: 'Science',
      };

      jest.spyOn(studentRepository, 'findOne').mockResolvedValue(student);

      const expectedResult = {
        student,
      };

      const result = await GetStudentById(id, studentRepository);

      expect(result).toEqual(expectedResult);
      expect(studentRepository.findOne).toHaveBeenCalledWith({ where: { id } });
    });

    it('should handle non-existent student', async () => {
      const id = 1;

      jest.spyOn(studentRepository, 'findOne').mockResolvedValue(undefined);

      const expectedResult = {
        error: 'Student does not exist',
      };

      const result = await GetStudentById(id, studentRepository);

      expect(result).toEqual(expectedResult);
      expect(studentRepository.findOne).toHaveBeenCalledWith({ where: { id } });
    });

    it('should handle error during student retrieval', async () => {
      const id = 1;
      const error = new Error('Error retrieving student');

      jest.spyOn(studentRepository, 'findOne').mockRejectedValue(error);

      const expectedResult = {
        error,
      };

      const result = await GetStudentById(id, studentRepository);

      expect(result).toEqual(expectedResult);
      expect(studentRepository.findOne).toHaveBeenCalledWith({ where: { id } });
    });
  });
});
