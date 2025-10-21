import { TSemesterRegistration } from './semesterRegistration.interface'
import { SemesterRegistrationModel } from './semesterRegistration.model'

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  const result = await SemesterRegistrationModel.create(payload)
  return result
}

export const SemesterRegistrationService = {
  createSemesterRegistrationIntoDB,
}
