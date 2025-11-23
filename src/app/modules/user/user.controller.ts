import { RequestHandler } from 'express'
import { UserServices } from './user.service'
import sendResponse from '../../utils/sendResponse'
import { status as httpStatus } from 'http-status'
import catchAsync from '../../utils/catchAsync'
import { IFile } from './user.interface'

const getMe: RequestHandler = catchAsync(async (req, res) => {
  const { id, role } = req.user
  const result = await UserServices.getMeFromDB(id, role)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User data retrieved successfully!',
    data: result,
  })
})

const createStudent: RequestHandler = catchAsync(async (req, res) => {
  const { password, student: studentData } = req.body
  const file = req.file as unknown as IFile

  const result = await UserServices.createStudentIntoDB(
    file,
    password,
    studentData,
  )

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Student created successfully!',
    data: result,
  })
})

const createFaculty: RequestHandler = catchAsync(async (req, res) => {
  const { password, faculty: facultyData } = req.body

  const result = await UserServices.createFacultyIntoDB(password, facultyData)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Faculty created successfully!',
    data: result,
  })
})

const createAdmin: RequestHandler = catchAsync(async (req, res) => {
  const { password, admin: adminData } = req.body

  const result = await UserServices.createAdminIntoDB(password, adminData)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Admin created successfully!',
    data: result,
  })
})

const changeStatus: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params
  const payload = req.body
  const result = await UserServices.changeStatusInDB(id, payload)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User status changed successfully!',
    data: result,
  })
})

export const UserControllers = {
  getMe,
  createStudent,
  createFaculty,
  createAdmin,
  changeStatus,
}
