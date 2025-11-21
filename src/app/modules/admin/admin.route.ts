import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { AdminControllers } from './admin.controller'
import { adminValidations } from './admin.validation'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../user/user.constant'

const router = express.Router()

router.get('/', auth(USER_ROLE.admin), AdminControllers.getAdmins)
router.get('/:id', auth(USER_ROLE.admin), AdminControllers.getSingleAdmin)
router.patch(
  '/:id',
  auth(USER_ROLE.admin),
  validateRequest(adminValidations.updateAdminValidationSchema),
  AdminControllers.updateSingleAdmin,
)
router.delete('/:id', auth(USER_ROLE.admin), AdminControllers.deleteSingleAdmin)

export const AdminRoutes = router
