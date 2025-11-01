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

const getAllOfferedCourses = catchAsync(async (req, res) => {
  const result = await OfferedCourseService.getAllOfferedCoursesFromDB(
    req.query,
  )

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Offered Courses are retrieved successfully!',
    data: result,
  })
})
const getSingleOfferedCourse = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await OfferedCourseService.getSingleOfferedCourseFromDB(id)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Offered Course is retrieved successfully!',
    data: result,
  })
})
const updateOfferedCourse = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await OfferedCourseService.updateOfferedCourseIntoDB(
    id,
    req.body,
  )

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Offered Course is updated successfully!',
    data: result,
  })
})

const deleteOfferedCourse = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await OfferedCourseService.deleteOfferedCourseFromDB(id)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Offered Course is deleted successfully!',
    data: result,
  })
})

export const OfferedCourseController = {
  createOfferedCourse,
  getAllOfferedCourses,
  getSingleOfferedCourse,
  updateOfferedCourse,
  deleteOfferedCourse,
}
