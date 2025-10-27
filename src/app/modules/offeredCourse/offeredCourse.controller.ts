import catchAsync from '../../utils/catchAsync'

const createOfferedCourse = catchAsync(async (req, res) => {})
const getAllOfferedCourses = catchAsync(async (req, res) => {})
const getSingleOfferedCourse = catchAsync(async (req, res) => {})
const updateOfferedCourse = catchAsync(async (req, res) => {})

export const OfferedCourseController = {
  createOfferedCourse,
  getAllOfferedCourses,
  getSingleOfferedCourse,
  updateOfferedCourse,
}
