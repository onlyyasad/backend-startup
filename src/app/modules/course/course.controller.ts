import { RequestHandler } from 'express'
import catchAsync from '../../utils/catchAsync'
import { CourseServices } from './course.service'
import sendResponse from '../../utils/sendResponse'
import { status as httpStatus } from 'http-status'

const createCourse: RequestHandler = catchAsync(async (req, res) => {
  const result = await CourseServices.createCourseIntoDB(req.body)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Course is created successfully!',
    data: result,
  })
})

const getAllCourses = catchAsync(async (req, res) => {
  const result = await CourseServices.getAllCoursesFromDB(req.query)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Courses are retrieved successfully!',
    data: result,
  })
})

const getSingleCourse = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await CourseServices.getSingleCourseFromDB(id)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Course is retrieved successfully!',
    data: result,
  })
})

// const updateSingleAcademicFaculty = catchAsync(async (req, res) => {
//   const { id } = req.params
//   const result =
//     await AcademicFacultyServices.updateSingleAcademicFacultyFromDB(
//       id,
//       req.body,
//     )

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: 'Academic faculty is updated successfully!',
//     data: result,
//   })
// })

const deleteSingleCourse = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await CourseServices.deleteCourseFromDB(id)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Course is deleted successfully!',
    data: result,
  })
})

export const CourseControllers = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  deleteSingleCourse,
}
