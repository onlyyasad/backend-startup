import mongoose from 'mongoose'
import AppError from '../../errors/appError'
import { OfferedCourse } from '../offeredCourse/offeredCourse.model'
import { Student } from '../student/student.model'
import { TEnrolledCourse } from './enrolledCourse.interface'
import { EnrolledCourse } from './enrolledCourse.model'
import { status as httpStatus } from 'http-status'
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model'
import { Course } from '../course/course.model'

const createEnrolledCourseIntoDB = async (
  userId: string,
  payload: TEnrolledCourse,
) => {
  /**
   * Step1: check if the offered course exists
   * Step2: check if the student is already enrolled in the course
   * Step3: check if the offered course has reached its maximum capacity
   * Step4: create enrolled course entry
   */

  const { offeredCourse } = payload

  const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse)

  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered course not found!')
  }

  const student = await Student.findOne({ id: userId }, { _id: 1 })

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

  // check total credits exceeds max credit

  const course = await Course.findById(isOfferedCourseExists.course).select(
    'credits',
  )

  const currentCredit = course?.credits

  const semesterRegistration = await SemesterRegistration.findById(
    isOfferedCourseExists.semesterRegistration,
  ).select('maxCredit')

  const maxCredit = semesterRegistration?.maxCredit

  const enrolledCourses = await EnrolledCourse.aggregate([
    {
      $match: {
        semesterRegistration: isOfferedCourseExists.semesterRegistration,
        student: student._id,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'enrolledCourseData',
      },
    },
    {
      $unwind: '$enrolledCourseData',
    },
    {
      $group: {
        _id: null,
        totalEnrolledCredits: { $sum: '$enrolledCourseData.credits' },
      },
    },
    {
      $project: {
        _id: 0,
        totalEnrolledCredits: 1,
      },
    },
  ])

  const totalEnrolledCredits =
    enrolledCourses.length > 0 ? enrolledCourses[0].totalEnrolledCredits : 0

  if (
    totalEnrolledCredits &&
    currentCredit &&
    maxCredit &&
    totalEnrolledCredits + currentCredit > maxCredit
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Enrolling in this course exceeds the maximum credit limit for the semester!',
    )
  }

  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    const result = await EnrolledCourse.create(
      [
        {
          semesterRegistration: isOfferedCourseExists.semesterRegistration,
          academicSemester: isOfferedCourseExists.academicSemester,
          academicFaculty: isOfferedCourseExists.academicFaculty,
          academicDepartment: isOfferedCourseExists.academicDepartment,
          offeredCourse: offeredCourse,
          course: isOfferedCourseExists.course,
          student: student._id,
          faculty: isOfferedCourseExists.faculty,
          isEnrolled: true,
        },
      ],
      { session },
    )

    if (!result) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to enroll in the course!',
      )
    }

    const maxCapacity = isOfferedCourseExists.maxCapacity
    await OfferedCourse.findByIdAndUpdate(offeredCourse, {
      maxCapacity: maxCapacity - 1,
    })

    await session.commitTransaction()
    session.endSession()

    return result
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    await session.abortTransaction()
    session.endSession()
    throw new Error(error)
  }
}

export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
}
