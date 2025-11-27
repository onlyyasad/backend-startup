import AppError from '../../errors/appError'
import { OfferedCourse } from '../offeredCourse/offeredCourse.model'
import { Student } from '../student/student.model'
import { TEnrolledCourse } from './enrolledCourse.interface'
import { EnrolledCourse } from './enrolledCourse.model'
import { status as httpStatus } from 'http-status'

const createEnrolledCourseIntoDB = async (
  userId: string,
  payload: TEnrolledCourse,
) => {
  /**
   * Step1: check if the offered course exists
   * Step2: check if the student is already enrolled in the course
   * Step3: create enrolled course entry
   *
   */

  const { offeredCourse } = payload

  const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse)

  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered course not found!')
  }

  const student = await Student.findOne({ id: userId }).select('_id')

  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student not found!')
  }

  const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
    semesterRegistration: isOfferedCourseExists.semesterRegistration,
    offeredCourse,
    student: student._id,
  })

  if (isStudentAlreadyEnrolled) {
    throw new AppError(
      httpStatus.CONFLICT,
      'Student is already enrolled in this course!',
    )
  }

  if (isOfferedCourseExists.maxCapacity <= 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Offered course has reached its maximum capacity!',
    )
  }

  return null
}

export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
}
