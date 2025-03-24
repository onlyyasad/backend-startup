import { TErrorSources, TGenericErrorResponse } from '../interface/error'

const handleDuplicateError = (
  error: Partial<{ message: string }>,
): TGenericErrorResponse => {
  const statusCode = 400

  const match = error?.message?.match(/"([^"]*)"/)

  const extractedMessage = match && match[1]

  const errorSources: TErrorSources = [
    {
      path: '',
      message: `${extractedMessage} is already exists.`,
    },
  ]

  return {
    statusCode,
    message: 'Invalid ID',
    errorSources,
  }
}

export default handleDuplicateError
