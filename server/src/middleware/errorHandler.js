export function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const response = {
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: status === 500 ? 'Internal Server Error' : err.message
    }
  };
  if (status !== 500 && err.details) {
    response.error.details = err.details;
  }
  res.status(status).json(response);
}
