import { RequestHandler } from 'express'
import sendResponse from '../../utils/sendResponse'
import { status as httpStatus } from 'http-status'
import catchAsync from '../../utils/catchAsync'
import { AcademicDepartmentServices } from './academicDepartment.service'

const createAcademicDepartment: RequestHandler = catchAsync(
  async (req, res) => {
    const result =
      await AcademicDepartmentServices.createAcademicDepartmentIntoDB(req.body)

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Academic department is created successfully!',
      data: result,
    })
  },
)

const getAcademicDepartments = catchAsync(async (req, res) => {
  const result =
    await AcademicDepartmentServices.getAllAcademicDepartmentsFromDB(req.query)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Academic departments are retrieved successfully!',
    meta: result.meta,
    data: result.result,
  })
})

const getSingleAcademicDepartment = catchAsync(async (req, res) => {
  const { departmentId } = req.params
  const result =
    await AcademicDepartmentServices.getSingleAcademicDepartmentFromDB(
      departmentId,
    )

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Academic department is retrieved successfully!',
    data: result,
  })
})

const updateSingleAcademicDepartment = catchAsync(async (req, res) => {
  const { departmentId } = req.params
  const result =
    await AcademicDepartmentServices.updateSingleAcademicDepartmentFromDB(
      departmentId,
      req.body,
    )

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Academic department is updated successfully!',
    data: result,
  })
})

export const AcademicDepartmentControllers = {
  createAcademicDepartment,
  getAcademicDepartments,
  getSingleAcademicDepartment,
  updateSingleAcademicDepartment,
}
