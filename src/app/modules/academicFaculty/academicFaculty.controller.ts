import { RequestHandler } from 'express'
import sendResponse from '../../utils/sendResponse'
import { status as httpStatus } from 'http-status'
import catchAsync from '../../utils/catchAsync'
import { AcademicFacultyServices } from './academicFaculty.service'

const createAcademicFaculty: RequestHandler = catchAsync(async (req, res) => {
  const result = await AcademicFacultyServices.createAcademicFacultyIntoDB(
    req.body,
  )

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Academic Faculty is created successfully!',
    data: result,
  })
})

const getAcademicFaculties = catchAsync(async (req, res) => {
  const result = await AcademicFacultyServices.getAllAcademicFacultiesFromDB()

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Academic faculties are retrieved successfully!',
    data: result,
  })
})

const getSingleAcademicFaculty = catchAsync(async (req, res) => {
  const { academicFacultyId } = req.params
  const result =
    await AcademicFacultyServices.getSingleAcademicFacultyFromDB(
      academicFacultyId,
    )

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Academic faculty is retrieved successfully!',
    data: result,
  })
})

const updateSingleAcademicFaculty = catchAsync(async (req, res) => {
  const { academicFacultyId } = req.params
  const result =
    await AcademicFacultyServices.updateSingleAcademicFacultyFromDB(
      academicFacultyId,
      req.body,
    )

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Academic faculty is updated successfully!',
    data: result,
  })
})

export const AcademicFacultyControllers = {
  createAcademicFaculty,
  getAcademicFaculties,
  getSingleAcademicFaculty,
  updateSingleAcademicFaculty,
}
