export const validateRequest = schema => {
  return (req, res, next) => {
    const {error, value} = schema.validate(req.body, {
      abortEarly: true,
    })

    if (error) {
      const err = new Error(error.details[0].message);
      err.statusCode = 422;
      return next(err);
    }

    req.body = value;

    next();
  }
}