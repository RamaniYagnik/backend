export const sendSuccess = (res, status, message, data = null) => {
  return res.status(status).json({
    ...(data !== null && { data }), // only include data if provided
    success: true,
    message,
    code: status,
  });
};

export const sendError = (res, status, message, details = null) => {
  return res.status(status).json({
    success: false,
    message,
    code: status,
    ...(details && { details }),
  });
};
