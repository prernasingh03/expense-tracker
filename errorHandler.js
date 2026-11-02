function notFound(req, res) {
  res.status(404).json({ message: 'Route not found' });
}

// Express recognises error middleware by its four parameters.
// eslint-disable-next-line no-unused-vars
function errorHandler(error, req, res, next) {
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map((item) => item.message);
    return res.status(400).json({ message: messages.join('. ') });
  }
  if (error.name === 'CastError') {
    return res.status(400).json({ message: `Invalid value for ${error.path}` });
  }
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Request body must be valid JSON' });
  }
  if (error.statusCode) {
    return res.status(error.statusCode).json({ message: error.message });
  }
  console.error(error);
  res.status(500).json({ message: 'Something went wrong' });
}

module.exports = { notFound, errorHandler };
