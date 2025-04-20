import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { AdminControllers } from './admin.controller'
import { adminValidations } from './admin.validation'

const router = express.Router()

router.get('/', AdminControllers.getAdmins)
router.get('/:adminId', AdminControllers.getSingleAdmin)
router.patch(
  '/:adminId',
  validateRequest(adminValidations.updateAdminValidationSchema),
  AdminControllers.updateSingleAdmin,
)
router.delete('/:adminId', AdminControllers.deleteSingleAdmin)

export const AdminRoutes = router
