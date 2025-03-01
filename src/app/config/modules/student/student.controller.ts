import { Request, Response } from 'express'
import { StudentServices } from './student.service'

const createStudent = async (req: Request, res: Response) => {
  const student = req.body

  try {
    const result = await StudentServices.createStudentIntoDB(student)
    res.status(200).json({
      success: true,
      message: 'Student created successfully!',
      data: result,
    })
  } catch (error) {
    console.log(error)
  }
}

const getStudents = async (req: Request, res: Response) => {
  try {
    const result = await StudentServices.getAllStudentFromDB()
    res.status(200).json({
      success: true,
      message: 'Students are retrieved successfully!',
      data: result,
    })
  } catch (error) {
    console.log(error)
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
  } catch (error) {
    console.log(error)
  }
}

export const StudentControllers = {
  createStudent,
  getStudents,
  getSingleStudent,
}
