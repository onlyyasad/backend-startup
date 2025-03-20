import { NextFunction, Request, Response } from 'express'
import { StudentServices } from './student.service'
import sendResponse from '../../utils/sendResponse'
import { status as httpStatus } from 'http-status'

const getStudents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await StudentServices.getAllStudentFromDB()

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Students are retrieved successfully!',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

const getSingleStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { studentId } = req.params
    const result = await StudentServices.getSingleStudentFromDB(studentId)

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Student is retrieved successfully!',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

const deleteSingleStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { studentId } = req.params
    const result = await StudentServices.deleteSingleStudentFromDB(studentId)

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Student is deleted successfully!',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const StudentControllers = {
  getStudents,
  getSingleStudent,
  deleteSingleStudent,
}
