import { NextFunction, Request, Response } from 'express'
import { StudentServices } from './student.service'

const getStudents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await StudentServices.getAllStudentFromDB()
    res.status(200).json({
      success: true,
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
    res.status(200).json({
      success: true,
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
    res.status(200).json({
      success: true,
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
