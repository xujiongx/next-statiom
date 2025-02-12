export class ApiError extends Error {
  code: number;
  status: number;

  constructor(message: string, code: number = 500, status: number = 500) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

export const handleApiError = (error: unknown) => {
  if (error instanceof ApiError) {
    return {
      code: error.code,
      message: error.message,
      status: error.status,
    };
  }

  if (error instanceof Error) {
    return {
      code: 500,
      message: error.message,
      status: 500,
    };
  }

  return {
    code: 500,
    message: '未知错误',
    status: 500,
  };
};