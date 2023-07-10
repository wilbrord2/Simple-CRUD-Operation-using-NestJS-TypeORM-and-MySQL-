import { Repository } from 'typeorm';
import { createStudentDto } from '../dto';
import { Student } from 'src/Database/student.entity';
async function createstudent(
  studentRepository: Repository<Student>,
  dto: createStudentDto,
) {
  try {
    const student = studentRepository.create(dto);
    const newStudent = await studentRepository.save(student);

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
async function GetStudentById(
  id: number,
  studentRepository: Repository<Student>,
) {
  try {
    const student = await studentRepository.findOne({
      where: { id },
    });
    if (student) {
      return {
        student,
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
async function DeleteStudent(
  id: number,
  studentRepository: Repository<Student>,
) {
  try {
    const student = await studentRepository.findOne({ where: { id } });
    if (student) {
      await studentRepository.delete({ id });
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
export { createstudent, GetStudentById, DeleteStudent };
