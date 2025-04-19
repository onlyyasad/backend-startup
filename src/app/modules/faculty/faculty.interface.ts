import { Model, Types } from 'mongoose'

export type TUserName = {
  firstName: string
  middleName?: string
  lastName: string
}

export type TFaculty = {
  id: string
  user: Types.ObjectId
  designation: string
  name: TUserName
  gender: 'male' | 'female' | 'other'
  dateOfBirth?: Date
  email: string
  contactNo: string
  emergencyContactNo: string
  presentAddress: string
  permanentAddress: string
  profileImg?: string
  academicDepartment: Types.ObjectId
  academicFaculty: Types.ObjectId
  isDeleted: boolean
}

// export interface TFacultyModel extends Model<TFaculty> {
//   isUserExists(id: string): Promise<TFaculty | null>
// }
