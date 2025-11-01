import AppError from '../../errors/appError'
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model'
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model'
import { Course } from '../course/course.model'
import { Faculty } from '../faculty/faculty.model'
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model'
import { TOfferedCourse } from './offeredCourse.interface'
import { OfferedCourse } from './offeredCourse.model'
import { status as httpStatus } from 'http-status'
import { hasTimeConflict } from './offeredCourse.utils'

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

  const checkTimeConflict = hasTimeConflict(assignedSchedules, newSchedule)
  if (checkTimeConflict) {
    throw new AppError(
      httpStatus.CONFLICT,
      `Schedule conflict detected with existing schedule: Days ${newSchedule.days}, Time ${newSchedule.startTime} - ${newSchedule.endTime}`,
    )
  }

  const academicSemesterId = isSemesterRegistrationExist.academicSemester

  const finalPayload = {
    ...payload,
    academicSemester: academicSemesterId,
  }

  const result = await OfferedCourse.create(finalPayload)
  return result
}

const getAllOfferedCoursesFromDB = async (query: Record<string, unknown>) => {
  const result = await OfferedCourse.find(query)
    .populate('academicSemester')
    .populate('academicFaculty')
    .populate('academicDepartment')
    .populate('course')
    .populate('faculty')
  return result
}

const getSingleOfferedCourseFromDB = async (id: string) => {
  const result = await OfferedCourse.findById(id)
    .populate('academicSemester')
    .populate('academicFaculty')
    .populate('academicDepartment')
    .populate('course')
    .populate('faculty')
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered Course not found')
  }
  return result
}

const updateOfferedCourseIntoDB = async (
  id: string,
  payload: Pick<TOfferedCourse, 'faculty' | 'days' | 'startTime' | 'endTime'>,
) => {
  const { faculty, days, startTime, endTime } = payload
  const offeredCourse = await OfferedCourse.findById(id)

  if (!offeredCourse) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered Course not found')
  }

  const isFacultyExists = await Faculty.findById(payload.faculty)
  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found')
  }

  const assignedSchedules = await OfferedCourse.find({
    semesterRegistration: offeredCourse.semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime')

  const newSchedule = {
    days,
    startTime,
    endTime,
  }

  const checkTimeConflict = hasTimeConflict(assignedSchedules, newSchedule)
  if (checkTimeConflict) {
    throw new AppError(
      httpStatus.CONFLICT,
      `Schedule conflict detected with existing schedule: Days ${newSchedule.days}, Time ${newSchedule.startTime} - ${newSchedule.endTime}`,
    )
  }

  const semesterRegistration = await SemesterRegistration.findById(
    offeredCourse.semesterRegistration,
  )

  if (semesterRegistration?.status !== 'UPCOMING') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Offered Course cannot be updated as the associated Semester Registration is either ONGOING or ENDED',
    )
  }

  const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
    new: true,
  })
  return result
}

const deleteOfferedCourseFromDB = async (id: string) => {
  const result = await OfferedCourse.findByIdAndDelete(id)
  return result
}

export const OfferedCourseService = {
  createOfferedCourseIntoDB,
  getAllOfferedCoursesFromDB,
  getSingleOfferedCourseFromDB,
  updateOfferedCourseIntoDB,
  deleteOfferedCourseFromDB,
}
