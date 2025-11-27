import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { EnrolledCourseServices } from './enrolledCourse.service'
import { status as httpStatus } from 'http-status'

const createEnrolledCourse = catchAsync(async (req, res) => {
  const userId = req.user.id
  const result = await EnrolledCourseServices.createEnrolledCourseIntoDB(
    userId,
    req.body,
  )

  console.log('User', req.user)

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
