var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var User = mongoose.mpdel('User');
var = require('../auth');

router.post('/users', function(req, res, next){
  var user = new User();
  user.username = req.body.user.username;
  user.email = req.body.user.email;
  user.setPassword(req.body.user.password);
/*call the user.save() function, which returns a promise
 to be handled, if the promise is resolved it implies the save()
 operation was successful,and we return the user's auth json.
 If the promise gets rejected, we use the .catch to pass the error to our
 error handler.

 */
user.save().then(function(){
  return res.json({user: user.toAuthJSON()});
}).catch(next);

});

/* the below login route enables a users to login and exchange their credential
for the auth JSON payload
*/

router.post('/users/login', function(req, res,next){
  if(!req.body.user.email){
    return res.status(422).json({errors: {email: "can't be blank"}});
  }

  if(!req.body.user.password){
    return res.status(422).json({errors: {password: "can't be blank"}});
  }
  passport.authenticate('local', {session:false}, function(err,user,info){
    if (err){
      return next(err);
    }
    if(user){
      user.token = user.generateJWT();
      return res.json({user: user.toAuthJSON()});
    } else {
      return res.status(422).json(info);
    }
  })(req, res,next);
});


/*
We create an authentication  to get the current user's auth payload
from their token
*/

router.get('/user', auth.required, function(req , res, next){
  User.findById(req.payload.id).then(function(user){
    if(!user){
      return res.sendStatus(401);
    }
    return res.json({user : user.toAuthJSON()});
  }).catch(next);
});


/*Below we create an authentication endpoint to allow users to
update their information
*/

router.put('/user', auth.required, function(req, res, next){
  User.findById(req.payload.id).then(function(user){

    if(!user){ return res.sendStatus(401); }
    if(typeof req.body.user.username !== 'undefined'){
        user.username = req.body.user.username;
      }
      if(typeof req.body.user.email !== 'undefined'){
        user.email = req.body.user.email;
      }
      if(typeof req.body.user.bio !== 'undefined'){
        user.bio = req.body.user.bio;
      }
      if(typeof req.body.user.image !== 'undefined'){
        user.image = req.body.user.image;
      }
      if(typeof req.body.user.password !== 'undefined'){
        user.setPassword(req.body.user.password);
      }

      return user.save().then(function(){
        return res.json({user: user.toAuthJSON()});
      });
    }).catch(next);
});

module.exports = router;
