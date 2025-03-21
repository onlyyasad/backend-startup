import { StudentServices } from './student.service'
import sendResponse from '../../utils/sendResponse'
import { status as httpStatus } from 'http-status'
import catchAsync from '../../utils/catchAsync'

const getStudents = catchAsync(async (req, res) => {
  const result = await StudentServices.getAllStudentFromDB()

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Students are retrieved successfully!',
    data: result,
  })
})

const getSingleStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params
  const result = await StudentServices.getSingleStudentFromDB(studentId)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Student is retrieved successfully!',
    data: result,
  })
})

const deleteSingleStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params
  const result = await StudentServices.deleteSingleStudentFromDB(studentId)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Student is deleted successfully!',
    data: result,
  })
})

export const StudentControllers = {
  getStudents,
  getSingleStudent,
  deleteSingleStudent,
}
