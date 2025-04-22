import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { AdminControllers } from './admin.controller'
import { adminValidations } from './admin.validation'

const router = express.Router()

router.get('/', AdminControllers.getAdmins)
router.get('/:id', AdminControllers.getSingleAdmin)
router.patch(
  '/:id',
  validateRequest(adminValidations.updateAdminValidationSchema),
  AdminControllers.updateSingleAdmin,
)
router.delete('/:id', AdminControllers.deleteSingleAdmin)

export const AdminRoutes = router
