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

export const StudentControllers = {
  createStudent,
}
