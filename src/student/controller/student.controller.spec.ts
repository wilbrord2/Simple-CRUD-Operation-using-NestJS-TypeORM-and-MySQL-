import { Test, TestingModule } from '@nestjs/testing';
import { StudentController } from './student.controller';
import { StudentService } from '../service/student.service';
import { Student } from '../../Database/student.entity';
import { Repository } from 'typeorm';
import { testDto } from '../dto';

class StudentRepositoryMock extends Repository<Student> {}

describe('StudentController', () => {
  let controller: StudentController;
  let studentService: StudentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentController],
      providers: [
        StudentService,
        {
          provide: 'StudentRepository',
          useClass: StudentRepositoryMock,
        },
      ],
    }).compile();

    controller = module.get<StudentController>(StudentController);
    studentService = module.get<StudentService>(StudentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createStudent', () => {
    it('should create a new student', async () => {
      const createDto = {
        name: 'John Doe',
        email: 'john@example.com',
        level: 'Bachelor',
        combination: 'Science',
      };

      const studentEntity: testDto = {
        id: 1,
        name: createDto.name,
        email: createDto.email,
        level: createDto.level,
        combination: createDto.combination,
      };

      const expectedResult = {
        message: 'Student is created successfully',
        student: studentEntity,
      };

      jest
        .spyOn(studentService, 'createStudent')
        .mockResolvedValue(expectedResult);

      const result = await controller.createStudent(createDto);

      expect(result).toEqual(expectedResult);
      expect(studentService.createStudent).toHaveBeenCalledWith(createDto);
    });
  });

  describe('getStudents', () => {
    it('should return a list of all students', async () => {
      const student = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          level: 'Bachelor',
          combination: 'Science',
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          level: 'Master',
          combination: 'Arts',
        },
      ];

      const expectedResult = {
        message: 'List of All Students',
        student: [...student],
      };

      jest
        .spyOn(studentService, 'getStudents')
        .mockResolvedValue(expectedResult);

      const result = await controller.getStudents();

      expect(result).toBe(expectedResult);
      expect(studentService.getStudents).toHaveBeenCalled();
    });
  });

  describe('getStudentById', () => {
    it('should return a specific student', async () => {
      const studentId = 1;
      const student = {
        id: studentId,
        name: 'John Doe',
        email: 'john@example.com',
        level: 'Bachelor',
        combination: 'Science',
      };

      const expectedResult = {
        student: { ...student },
      };

      jest
        .spyOn(studentService, 'getStudentById')
        .mockResolvedValue(expectedResult);

      const result = await controller.getStudentById(studentId);

      expect(result).toBe(expectedResult);
      expect(studentService.getStudentById).toHaveBeenCalledWith(studentId);
    });
  });

  describe('editStudent', () => {
    it('should edit an existing student', async () => {
      const studentId = 1;
      const editDto = {
        name: 'John Smith',
        email: 'john@example.com',
        level: 'Master',
        combination: 'Arts',
      };

      const expectedResult = {
        message: 'Student is Successfully Updated',
      };

      jest
        .spyOn(studentService, 'editStudent')
        .mockResolvedValue(expectedResult);

      const result = await controller.editStudent(editDto, studentId);

      expect(result).toBe(expectedResult);
      expect(studentService.editStudent).toHaveBeenCalledWith(
        editDto,
        studentId,
      );
    });
  });

  describe('deleteStudent', () => {
    it('should delete an existing student', async () => {
      const studentId = 1;

      const expectedResult = {
        message: 'Student is Deleted Successfully',
      };

      jest
        .spyOn(studentService, 'deleteStudent')
        .mockResolvedValue(expectedResult);

      const result = await controller.deleteStudent(studentId);

      expect(result).toBe(expectedResult);
      expect(studentService.deleteStudent).toHaveBeenCalledWith(studentId);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
