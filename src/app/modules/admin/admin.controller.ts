import sendResponse from '../../utils/sendResponse'
import { status as httpStatus } from 'http-status'
import catchAsync from '../../utils/catchAsync'
import { AdminServices } from './admin.service'

const getFaculties = catchAsync(async (req, res) => {
  const result = await AdminServices.getAllFacultyFromDB(req.query)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Faculties are retrieved successfully!',
    data: result,
  })
})

const getSingleFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params
  const result = await AdminServices.getSingleFacultyFromDB(facultyId)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Faculty is retrieved successfully!',
    data: result,
  })
})

const deleteSingleFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params
  const result = await AdminServices.deleteSingleFacultyFromDB(facultyId)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Faculty is deleted successfully!',
    data: result,
  })
})

const updateSingleFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params
  const { faculty } = req.body
  const result = await AdminServices.updateSingleFacultyIntoDB(
    facultyId,
    faculty,
  )

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Faculty is updated successfully!',
    data: result,
  })
})

export const FacultyControllers = {
  getFaculties,
  getSingleFaculty,
  deleteSingleFaculty,
  updateSingleFaculty,
}
