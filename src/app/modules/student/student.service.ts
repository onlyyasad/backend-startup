import { TStudent } from './student.interface'
import { Student } from './student.model'

const createStudentIntoDB = async (student: TStudent) => {
  if (await Student.isUserExists(student.id)) {
    throw new Error('Student already exists!')
  }
  const result = await Student.create(student)
  return result
}

const getAllStudentFromDB = async () => {
  const result = await Student.find()
  return result
}

const getSingleStudentFromDB = async (id: string) => {
  const result = await Student.findOne({ id })
  // const result = await Student.aggregate([{ $match: { id: id } }])
  return result
}

const deleteSingleStudentFromDB = async (id: string) => {
  const result = await Student.updateOne({ id }, { isDeleted: true })
  return result
}

export const StudentServices = {
  createStudentIntoDB,
  getAllStudentFromDB,
  getSingleStudentFromDB,
  deleteSingleStudentFromDB,
}
