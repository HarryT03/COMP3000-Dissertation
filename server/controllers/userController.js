const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');

exports.getRegister = (req, res) => {
  res.render('register');
};

exports.postRegister = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      email: req.body.email,
      password: hashedPassword,
    });

    await user.save();

    res.redirect('/user/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while registering the user');
  }
};

exports.getLogin = (req, res) => {
  res.render('login');
};

exports.postLogin = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) { 
      req.flash('error', info.message);
      return res.redirect('/login'); 
    }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      req.session.isLoggedIn = true;
      req.flash('success_msg', 'You are now logged in');
      return res.redirect('/');
    });
  })(req, res, next);
};


async function updateUser(){
  try {
      const res = await User.updateOne({email: ""}, { $set: { email: "", password: ""}});
      console.log(`Matched count: ${res.n}`);
      console.log(`Modified count: ${res.nModified}`);
  } catch (error) {
      console.log("Error updating user: " + error);
  }
}

  async function deleteUser(){
      try {
          await User.deleteOne({email: ""});
      } catch (error) {
          console.log("Error deleting user: " + error);
      }
  }
  
  // updateUser();
  // deleteUser();