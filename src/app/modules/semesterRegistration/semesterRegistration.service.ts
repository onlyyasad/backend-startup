import { TSemesterRegistration } from './semesterRegistration.interface'
import { SemesterRegistrationModel } from './semesterRegistration.model'

const getAllSemesterRegistrationsFromDB = async () => {
  const result = await SemesterRegistrationModel.find()
  return result
}

const getSingleSemesterRegistrationsFromDB = async (id: string) => {
  const result = await SemesterRegistrationModel.findById(id)
  return result
}

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  const result = await SemesterRegistrationModel.create(payload)
  return result
}

const updateSemesterRegistrationIntoDB = async (
  id: string,
  payload: TSemesterRegistration,
) => {
  const result = await SemesterRegistrationModel.findByIdAndUpdate(id, payload)
  return result
}

export const SemesterRegistrationService = {
  getAllSemesterRegistrationsFromDB,
  getSingleSemesterRegistrationsFromDB,
  createSemesterRegistrationIntoDB,
  updateSemesterRegistrationIntoDB,
}
