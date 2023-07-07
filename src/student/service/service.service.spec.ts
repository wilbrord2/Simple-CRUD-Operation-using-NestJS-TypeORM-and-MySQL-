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

  describe('createStudent', () => {
    it('should create a new student', async () => {
      const createDto: createStudentDto = {
        name: 'John Doe',
        email: 'john@example.com',
        level: 'Bachelor',
        combination: 'Science',
      };

      const studentEntity: Student = {
        id: 1,
        name: createDto.name,
        email: createDto.email,
        level: createDto.level,
        combination: createDto.combination,
      };

      jest.spyOn(studentRepository, 'create').mockReturnValue(studentEntity);
      jest.spyOn(studentRepository, 'save').mockResolvedValue(studentEntity);

      const expectedResult = {
        message: 'Student is created succesfully',
        student: studentEntity,
      };

      const result = await studentService.createStudent(createDto);

      expect(result).toEqual(expectedResult);
      expect(studentRepository.create).toHaveBeenCalledWith(createDto);
      expect(studentRepository.save).toHaveBeenCalledWith(studentEntity);
    });

    it('should handle createStudent error', async () => {
      const createDto = {
        name: 'John Doe',
        email: 'john@example.com',
        level: 'Bachelor',
        combination: 'Science',
      };

      const errorMessage = 'Error creating student';

      jest.spyOn(studentRepository, 'create').mockImplementation(() => {
        throw new Error(errorMessage);
      });

      const result = await studentService.createStudent(createDto);

      expect(result).toEqual({
        error: new Error(errorMessage),
      });
      expect(studentRepository.create).toHaveBeenCalledWith(createDto);
    });
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

  describe('getStudentById', () => {
    it('should get a student by ID', async () => {
      const studentId = 1;
      const student: Student = {
        id: studentId,
        name: 'John Doe',
        email: 'john@example.com',
        level: 'Bachelor',
        combination: 'Science',
      };

      jest.spyOn(studentRepository, 'findOne').mockResolvedValue(student);

      const expectedResult = {
        student,
      };

      const result = await studentService.getStudentById(studentId);

      expect(result).toEqual(expectedResult);
      expect(studentRepository.findOne).toHaveBeenCalledWith({
        where: { id: studentId },
      });
    });

    it('should handle getStudentById error', async () => {
      const studentId = 1;
      const errorMessage = 'Error getting student by ID';
      const error = new Error(errorMessage);

      jest.spyOn(studentRepository, 'findOne').mockRejectedValue(error);

      const expectedResult = {
        error,
      };

      const result = await studentService.getStudentById(studentId);

      expect(result).toEqual(expectedResult);
      expect(studentRepository.findOne).toHaveBeenCalledWith({
        where: { id: studentId },
      });
    });

    it('should handle non-existent student', async () => {
      const studentId = 1;

      jest.spyOn(studentRepository, 'findOne').mockResolvedValue(undefined);

      const expectedResult = {
        error: 'User does not exist',
      };

      const result = await studentService.getStudentById(studentId);

      expect(result).toEqual(expectedResult);
      expect(studentRepository.findOne).toHaveBeenCalledWith({
        where: { id: studentId },
      });
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

  describe('deleteStudent', () => {
    it('should delete an existing student', async () => {
      const studentId = 1;

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
      jest.spyOn(studentRepository, 'delete').mockResolvedValue(undefined);

      const expectedResult = {
        message: 'Student is Deleted Successfully',
      };

      const result = await studentService.deleteStudent(studentId);

      expect(result).toEqual(expectedResult);
      expect(studentRepository.findOne).toHaveBeenCalledWith({
        where: { id: studentId },
      });
      expect(studentRepository.delete).toHaveBeenCalledWith({ id: studentId });
    });

    it('should return error if student does not exist', async () => {
      const studentId = 1;
      jest.spyOn(studentRepository, 'findOne').mockResolvedValue(undefined);
      jest.spyOn(studentRepository, 'delete');

      const expectedResult = {
        error: 'Student does not exist',
      };

      const result = await studentService.deleteStudent(studentId);

      expect(result).toEqual(expectedResult);
      expect(studentRepository.findOne).toHaveBeenCalledWith({
        where: { id: studentId },
      });
      expect(studentRepository.delete).not.toHaveBeenCalled();
    });
  });
});
