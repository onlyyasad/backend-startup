import sendResponse from '../../utils/sendResponse'
import { status as httpStatus } from 'http-status'
import catchAsync from '../../utils/catchAsync'
import { FacultyServices } from './faculty.service'

const getFaculties = catchAsync(async (req, res) => {
  const result = await FacultyServices.getAllFacultyFromDB(req.query)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Faculties are retrieved successfully!',
    meta: result.meta,
    data: result.result,
  })
})

const getSingleFaculty = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await FacultyServices.getSingleFacultyFromDB(id)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Faculty is retrieved successfully!',
    data: result,
  })
})

const deleteSingleFaculty = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await FacultyServices.deleteSingleFacultyFromDB(id)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Faculty is deleted successfully!',
    data: result,
  })
})

const updateSingleFaculty = catchAsync(async (req, res) => {
  const { id } = req.params
  const { faculty } = req.body
  const result = await FacultyServices.updateSingleFacultyIntoDB(id, faculty)

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
