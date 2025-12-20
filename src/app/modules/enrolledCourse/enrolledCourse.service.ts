import mongoose from 'mongoose'
import AppError from '../../errors/appError'
import { OfferedCourse } from '../offeredCourse/offeredCourse.model'
import { Student } from '../student/student.model'
import {
  TEnrolledCourse,
  TEnrolledCourseMarks,
} from './enrolledCourse.interface'
import { EnrolledCourse } from './enrolledCourse.model'
import { status as httpStatus } from 'http-status'
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model'
import { Course } from '../course/course.model'
import { Faculty } from '../faculty/faculty.model'
import { calculateGradeAndPoints } from './enrolledCourse.utils'

const getEnrolledCoursesFromDB = async (): Promise<TEnrolledCourse[]> => {
  const enrolledCourses = await EnrolledCourse.find()
  return enrolledCourses
}

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

const updateEnrolledCourseMarksIntoDB = async (
  facultyId: string,
  payload: Partial<TEnrolledCourse>,
) => {
  const semesterRegistration = payload.semesterRegistration!
  const offeredCourse = payload.offeredCourse!
  const student = payload.student!
  const courseMarks = payload.courseMarks as TEnrolledCourseMarks

  const isSemesterRegistrationExists =
    await SemesterRegistration.findById(semesterRegistration)

  if (!isSemesterRegistrationExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Semester registration not found!')
  }

  const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse)

  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered course not found!')
  }

  const isStudentExists = await Student.findById(student)

  if (!isStudentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student not found!')
  }

  const faculty = await Faculty.findOne({ id: facultyId }, { _id: 1 })

  if (!faculty) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found!')
  }

  const isCourseBelongToFaculty = await EnrolledCourse.findOne({
    semesterRegistration,
    offeredCourse,
    faculty: faculty._id,
    student,
  })

  if (!isCourseBelongToFaculty) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You are not authorized to update marks for this course!',
    )
  }

  const modifiedData: Record<string, unknown> = {
    ...courseMarks,
  }

  if (courseMarks && Object.keys(courseMarks).length > 0) {
    for (const [key, value] of Object.entries(courseMarks)) {
      modifiedData[`courseMarks.${key}`] = value
    }
  }

  if (courseMarks.finalTerm !== undefined) {
    const { classTest1, classTest2, midTerm, finalTerm } =
      isCourseBelongToFaculty.courseMarks
    const totalMarks =
      Math.ceil(classTest1) +
      Math.ceil(midTerm) +
      Math.ceil(classTest2) +
      Math.ceil(finalTerm)

    const result = calculateGradeAndPoints(totalMarks)
    modifiedData['grade'] = result.grade
    modifiedData['gradePoints'] = result.gradePoints
    modifiedData['isCompleted'] = true
  }

  const result = await EnrolledCourse.findByIdAndUpdate(
    isCourseBelongToFaculty._id,
    modifiedData,
    { new: true },
  )

  return result
}

export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
  updateEnrolledCourseMarksIntoDB,
  getEnrolledCoursesFromDB,
}
