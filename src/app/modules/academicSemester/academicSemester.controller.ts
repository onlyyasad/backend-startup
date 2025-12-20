import { RequestHandler } from 'express'
import sendResponse from '../../utils/sendResponse'
import { status as httpStatus } from 'http-status'
import catchAsync from '../../utils/catchAsync'
import { AcademicSemesterServices } from './academicSemester.service'

const createAcademicSemester: RequestHandler = catchAsync(async (req, res) => {
  const result = await AcademicSemesterServices.createAcademicSemesterIntoDB(
    req.body,
  )

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Academic Semester is created successfully!',
    data: result,
  })
})

const getAcademicSemesters = catchAsync(async (req, res) => {
  const result = await AcademicSemesterServices.getAllAcademicSemestersFromDB(
    req.query,
  )

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Academic semesters are retrieved successfully!',
    meta: result.meta,
    data: result.result,
  })
})

const getSingleAcademicSemester = catchAsync(async (req, res) => {
  const { courseId } = req.params
  const result =
    await AcademicSemesterServices.getSingleAcademicSemesterFromDB(courseId)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Academic semester is retrieved successfully!',
    data: result,
  })
})

const updateSingleAcademicSemester = catchAsync(async (req, res) => {
  const { courseId } = req.params
  const result =
    await AcademicSemesterServices.updateSingleAcademicSemesterFromDB(
      courseId,
      req.body,
    )

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Academic semester is updated successfully!',
    data: result,
  })
})

export const AcademicSemesterControllers = {
  createAcademicSemester,
  getAcademicSemesters,
  getSingleAcademicSemester,
  updateSingleAcademicSemester,
}
