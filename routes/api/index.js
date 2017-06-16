var router = require('express').Router();

router.use('/',require('./users'));

/*
Below I create a middleware function for the API router
to handle validation errors from Mongoose.This middleware
converts the mongoose validation errors to something the
front-end can consume
*/

router.use(function(err,req,res,next){ // middleware defined with 4 argument is treated as an error handler
  if (err.name === 'ValidationError'){
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce(function(errors,key){
        errors[key] = err.errors[key].message;
        return errors;
    },{})
  });
}
return next(err);
});

module.exports = router;
