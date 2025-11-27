import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { EnrolledCourseServices } from './enrolledCourse.service'
import { status as httpStatus } from 'http-status'

const createEnrolledCourse = catchAsync(async (req, res) => {
  const result = await EnrolledCourseServices.createEnrolledCourseIntoDB(
    req.body,
  )

  console.log('Enrolled Course created:', result)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Enrolled Course created successfully',
    data: result,
  })
})

export const EnrolledCourseController = {
  createEnrolledCourse,
}
