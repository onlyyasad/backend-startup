import { Request, Response } from 'express'
import { StudentServices } from './student.service'

const getStudents = async (req: Request, res: Response) => {
  try {
    const result = await StudentServices.getAllStudentFromDB()
    res.status(200).json({
      success: true,
      message: 'Students are retrieved successfully!',
      data: result,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong!',
      error,
    })
  }
}

const getSingleStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params
    const result = await StudentServices.getSingleStudentFromDB(studentId)
    res.status(200).json({
      success: true,
      message: 'Student is retrieved successfully!',
      data: result,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong!',
      error,
    })
  }
}

const deleteSingleStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params
    const result = await StudentServices.deleteSingleStudentFromDB(studentId)
    res.status(200).json({
      success: true,
      message: 'Student is deleted successfully!',
      data: result,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong!',
      error,
    })
  }
}

export const StudentControllers = {
  getStudents,
  getSingleStudent,
  deleteSingleStudent,
}
