import { Model, Types } from 'mongoose'

export type TGender = 'male' | 'female' | 'other'

export type TBloodGroup =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-'

export type TUserName = {
  firstName: string
  middleName?: string
  lastName: string
}

export type TGuardian = {
  fatherName: string
  fatherOccupation: string
  fatherContactNo: string
  motherName: string
  motherOccupation: string
  motherContactNo: string
}

export type TLocalGuardian = {
  name: string
  occupation: string
  contactNo: string
  address: string
}

export type TStudent = {
  id: string
  user: Types.ObjectId
  name: TUserName
  gender: TGender
  dateOfBirth?: Date
  email: string
  contactNo: string
  emergencyContactNo: string
  bloodGroup?: TBloodGroup
  presentAddress: string
  permanentAddress: string
  guardian: TGuardian
  localGuardian: TLocalGuardian
  profileImg?: string
  academicDepartment: Types.ObjectId
  admissionSemester: Types.ObjectId
  academicFaculty: Types.ObjectId
  isDeleted: boolean
}

export interface TStudentModel extends Model<TStudent> {
  isUserExists(id: string): Promise<TStudent | null>
}
