import { TEnrolledCourse } from './enrolledCourse.interface'
import { EnrolledCourse } from './enrolledCourse.model'

const createEnrolledCourseIntoDB = async (
  payload: TEnrolledCourse,
): Promise<TEnrolledCourse> => {
  const enrolledCourse = await EnrolledCourse.create(payload)

  return enrolledCourse
}

export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
}
