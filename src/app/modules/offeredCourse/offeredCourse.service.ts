import { AcademicDepartment } from '../academicDepartment/academicDepartment.model'
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model'
import { Course } from '../course/course.model'
import { Faculty } from '../faculty/faculty.model'
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model'
import { TOfferedCourse } from './offeredCourse.interface'
import { OfferedCourse } from './offeredCourse.model'

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
    throw new Error('Semester Registration not found')
  }

  const isAcademicFacultyExists =
    await AcademicFaculty.findById(academicFaculty)
  if (!isAcademicFacultyExists) {
    throw new Error('Academic Faculty not found')
  }

  const isAcademicDepartmentExists =
    await AcademicDepartment.findById(academicDepartment)
  if (!isAcademicDepartmentExists) {
    throw new Error('Academic Department not found')
  }

  const isCourseExists = await Course.findById(course)
  if (!isCourseExists) {
    throw new Error('Course not found')
  }

  const isFacultyExists = await Faculty.findById(faculty)
  if (!isFacultyExists) {
    throw new Error('Faculty not found')
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
