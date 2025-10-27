import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { SemesterRegistrationService } from './semesterRegistration.service'
import { status as httpStatus } from 'http-status'

const getAllSemesterRegistrations = catchAsync(async (req, res) => {
  const result =
    await SemesterRegistrationService.getAllSemesterRegistrationsFromDB(
      req.query,
    )

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Semester Registrations retrieved successfully!',
    data: result,
  })
})

const createSemesterRegistration = catchAsync(async (req, res) => {
  const result =
    await SemesterRegistrationService.createSemesterRegistrationIntoDB(req.body)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Semester Registration is created successfully!',
    data: result,
  })
})

const getSingleSemesterRegistrations = catchAsync(async (req, res) => {
  const { id } = req.params
  const result =
    await SemesterRegistrationService.getSingleSemesterRegistrationsFromDB(id)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Semester Registration retrieved successfully!',
    data: result,
  })
})

const updateSingleSemesterRegistrations = catchAsync(async (req, res) => {
  const { id } = req.params
  const payload = req.body
  const result =
    await SemesterRegistrationService.updateSemesterRegistrationIntoDB(
      id,
      payload,
    )

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Semester Registration updated successfully!',
    data: result,
  })
})

export const SemesterRegistrationController = {
  createSemesterRegistration,
  getAllSemesterRegistrations,
  getSingleSemesterRegistrations,
  updateSingleSemesterRegistrations,
}
