import { Test, TestingModule } from '@nestjs/testing';
import { StudentService } from './student.service';
import { Repository } from 'typeorm';
import { Student } from '../../Database/student.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createStudentDto, editStudentDto, testDto } from '../dto';

describe('StudentService', () => {
  let studentService: StudentService;
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

    studentService = module.get<StudentService>(StudentService);
    studentRepository = module.get<Repository<Student>>(
      getRepositoryToken(Student),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('getStudents', () => {
    it('should get all students', async () => {
      const students = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          level: 'Bachelor',
          combination: 'Science',
        },
      ];

      jest.spyOn(studentRepository, 'find').mockResolvedValue(students);

      const expectedResult = {
        message: 'List of All Students',
        student: students,
      };
      const result = await studentService.getStudents();

      expect(result).toEqual(expectedResult);
      expect(studentRepository.find).toHaveBeenCalled();
    });

    it('should handle getStudents error', async () => {
      const errorMessage = 'Error getting students';

      jest.spyOn(studentRepository, 'find').mockImplementation(() => {
        throw new Error(errorMessage);
      });

      const result = await studentService.getStudents();

      expect(result).toEqual({
        error: new Error(errorMessage),
      });
      expect(studentRepository.find).toHaveBeenCalled();
    });
  });

  describe('editStudent', () => {
    it('should update an existing student', async () => {
      const studentId = 1;
      const editDto: editStudentDto = {
        name: 'John Doe',
        email: 'john@example.com',
        level: 'Master',
        combination: 'Art',
      };

      const existingStudent: testDto = {
        id: studentId,
        name: 'John Doe',
        email: 'john@example.com',
        level: 'Bachelor',
        combination: 'Science',
      };

      const updatedStudent: testDto = {
        ...existingStudent,
        ...editDto,
      };

      jest
        .spyOn(studentRepository, 'findOne')
        .mockResolvedValue(existingStudent);
      jest.spyOn(studentRepository, 'update').mockResolvedValue(undefined);

      const expectedResult = {
        message: 'Student is Successfully Updated',
      };

      const result = await studentService.editStudent(editDto, studentId);

      expect(result).toEqual(expectedResult);
      expect(studentRepository.findOne).toHaveBeenCalledWith({
        where: { id: studentId },
      });
      expect(studentRepository.update).toHaveBeenCalledWith(
        { id: studentId },
        editDto,
      );
    });

    it('should return error if student does not exist', async () => {
      const studentId = 1;
      const editDto: editStudentDto = {
        name: 'John Doe',
        email: 'john@example.com',
        level: 'Master',
        combination: 'Art',
      };

      jest.spyOn(studentRepository, 'findOne').mockResolvedValue(undefined);
      jest
        .spyOn(studentRepository, 'update')
        .mockImplementation(() => Promise.resolve(undefined));

      const expectedResult = {
        error: 'Student does not exist',
      };

      const result = await studentService.editStudent(editDto, studentId);

      expect(studentRepository.findOne).toHaveBeenCalledWith({
        where: { id: studentId },
      });
      expect(result).toEqual(expectedResult);
    });

    it('should handle error during editing student', async () => {
      const studentId = 1;
      const editDto: editStudentDto = {
        name: 'John Doe',
        email: 'john@example.com',
        level: 'Master',
        combination: 'Art',
      };

      const existingStudent: Student = {
        id: studentId,
        name: 'John Doe',
        email: 'john@example.com',
        level: 'Bachelor',
        combination: 'Science',
      };

      jest
        .spyOn(studentRepository, 'findOne')
        .mockResolvedValue(existingStudent);
      jest
        .spyOn(studentRepository, 'update')
        .mockRejectedValue(new Error('Database error'));

      const expectedResult = {
        error: new Error('Database error'),
      };

      const result = await studentService.editStudent(editDto, studentId);

      expect(result).toEqual(expectedResult);
      expect(studentRepository.findOne).toHaveBeenCalledWith({
        where: { id: studentId },
      });
      expect(studentRepository.update).toHaveBeenCalledWith(
        { id: studentId },
        editDto,
      );
    });
  });
});
