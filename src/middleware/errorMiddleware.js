export const errorHelper = {
    errorHandlerHelper: (err, req, res, next) => {
        console.error(err.stack);
      
        res.status(err.statusCode || 500).json({
          success: false,
          message: err.message || 'Internal Server Error',
        });
    },
    setErrorHandler(newHandler) {
        if (typeof newHandler === 'function') {
          this.errorHandlerHelper = newHandler;
        } else {
          throw new Error('Custom error handler must be a function');
        }
    }
};