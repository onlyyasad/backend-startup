import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { OfferedCourseService } from './offeredCourse.service'
import { status as httpStatus } from 'http-status'

const createOfferedCourse = catchAsync(async (req, res) => {
  const result = await OfferedCourseService.createOfferedCourseIntoDB(req.body)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Offered Course is created successfully!',
    data: result,
  })
})

const getAllOfferedCourses = catchAsync(async (req, res) => {})
const getSingleOfferedCourse = catchAsync(async (req, res) => {})
const updateOfferedCourse = catchAsync(async (req, res) => {})

export const OfferedCourseController = {
  createOfferedCourse,
  getAllOfferedCourses,
  getSingleOfferedCourse,
  updateOfferedCourse,
}
