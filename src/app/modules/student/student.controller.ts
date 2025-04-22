import { StudentServices } from './student.service'
import sendResponse from '../../utils/sendResponse'
import { status as httpStatus } from 'http-status'
import catchAsync from '../../utils/catchAsync'

const getStudents = catchAsync(async (req, res) => {
  const result = await StudentServices.getAllStudentFromDB(req.query)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Students are retrieved successfully!',
    data: result,
  })
})

const getSingleStudent = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await StudentServices.getSingleStudentFromDB(id)

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

const updateSingleStudent = catchAsync(async (req, res) => {
  const { id } = req.params
  const { student } = req.body
  const result = await StudentServices.updateSingleStudentIntoDB(id, student)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Student is updated successfully!',
    data: result,
  })
})

export const StudentControllers = {
  getStudents,
  getSingleStudent,
  deleteSingleStudent,
  updateSingleStudent,
}
