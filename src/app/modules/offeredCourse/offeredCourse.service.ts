import AppError from '../../errors/appError'
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model'
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model'
import { Course } from '../course/course.model'
import { Faculty } from '../faculty/faculty.model'
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model'
import { TOfferedCourse } from './offeredCourse.interface'
import { OfferedCourse } from './offeredCourse.model'
import { status as httpStatus } from 'http-status'

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
    ...rest
  } = payload

  const isSemesterRegistrationExist =
    await SemesterRegistration.findById(semesterRegistration)
  if (!isSemesterRegistrationExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Semester Registration not found')
  }

  const isAcademicFacultyExists =
    await AcademicFaculty.findById(academicFaculty)
  if (!isAcademicFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Faculty not found')
  }

  const isAcademicDepartmentExists =
    await AcademicDepartment.findById(academicDepartment)
  if (!isAcademicDepartmentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Department not found')
  }

  const isCourseExists = await Course.findById(course)
  if (!isCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found')
  }

  const isFacultyExists = await Faculty.findById(faculty)
  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found')
  }

  const isDepartmentBelongToFaculty = await AcademicDepartment.findOne({
    _id: academicDepartment,
    academicFaculty,
  })
  if (!isDepartmentBelongToFaculty) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Academic Department does not belong to the specified Academic Faculty',
    )
  }

  const isSameRegistrationExistsInTheSection = await OfferedCourse.findOne({
    semesterRegistration,
    course,
    section: rest.section,
  })
  if (isSameRegistrationExistsInTheSection) {
    throw new AppError(
      httpStatus.CONFLICT,
      'Offered Course with the same Semester Registration, Course, and Section already exists',
    )
  }

  const assignedSchedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: rest.days },
  }).select('days startTime endTime')

  const newSchedule = {
    days: rest.days,
    startTime: rest.startTime,
    endTime: rest.endTime,
  }

  for (const assigned of assignedSchedules) {
    const existingStartTime = new Date(`1970-01-01T${assigned.startTime}:00Z`)
    const existingEndTime = new Date(`1970-01-01T${assigned.endTime}:00Z`)
    const newStartTime = new Date(`1970-01-01T${newSchedule.startTime}:00Z`)
    const newEndTime = new Date(`1970-01-01T${newSchedule.endTime}:00Z`)

    const isOverlap =
      newStartTime < existingEndTime && newEndTime > existingStartTime

    if (isOverlap) {
      throw new AppError(
        httpStatus.CONFLICT,
        `Schedule conflict detected with existing schedule: Days ${assigned.days}, Time ${assigned.startTime} - ${assigned.endTime}`,
      )
    }
  }

  const academicSemesterId = isSemesterRegistrationExist.academicSemester

  const finalPayload = {
    semesterRegistration,
    academicSemester: academicSemesterId,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
    ...rest,
  }

  const result = await OfferedCourse.create(finalPayload)
  return result
}

const getAllOfferedCoursesFromDB = async (query: Record<string, unknown>) => {}

const getSingleOfferedCourseFromDB = async (id: string) => {}

const updateOfferedCourseIntoDB = async (
  id: string,
  payload: Partial<TOfferedCourse>,
) => {}

export const OfferedCourseService = {
  createOfferedCourseIntoDB,
  getAllOfferedCoursesFromDB,
  getSingleOfferedCourseFromDB,
  updateOfferedCourseIntoDB,
}
