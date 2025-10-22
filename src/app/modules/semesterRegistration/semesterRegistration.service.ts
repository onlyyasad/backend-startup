import { TSemesterRegistration } from './semesterRegistration.interface'
import { SemesterRegistrationModel } from './semesterRegistration.model'

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  const result = await SemesterRegistrationModel.create(payload)
  return result
}

const getAllSemesterRegistrationsFromDB = async () => {
  const result = await SemesterRegistrationModel.find()
  return result
}

const getSingleSemesterRegistrationsFromDB = async (id: string) => {
  const result = await SemesterRegistrationModel.findById(id)
  return result
}

export const SemesterRegistrationService = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationsFromDB,
  getSingleSemesterRegistrationsFromDB,
}
