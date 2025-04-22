import sendResponse from '../../utils/sendResponse'
import { status as httpStatus } from 'http-status'
import catchAsync from '../../utils/catchAsync'
import { AdminServices } from './admin.service'

const getAdmins = catchAsync(async (req, res) => {
  const result = await AdminServices.getAllAdminFromDB(req.query)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Admins are retrieved successfully!',
    data: result,
  })
})

const getSingleAdmin = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await AdminServices.getSingleAdminFromDB(id)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Admin is retrieved successfully!',
    data: result,
  })
})

const deleteSingleAdmin = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await AdminServices.deleteSingleAdminFromDB(id)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Admin is deleted successfully!',
    data: result,
  })
})

const updateSingleAdmin = catchAsync(async (req, res) => {
  const { id } = req.params
  const { admin } = req.body
  const result = await AdminServices.updateSingleAdminIntoDB(id, admin)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Admin is updated successfully!',
    data: result,
  })
})

export const AdminControllers = {
  getAdmins,
  getSingleAdmin,
  deleteSingleAdmin,
  updateSingleAdmin,
}
