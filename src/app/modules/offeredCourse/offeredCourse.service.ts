import { TOfferedCourse } from './offeredCourse.interface'

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {}

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
