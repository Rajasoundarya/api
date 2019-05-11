const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/authController');

function router(nav){
  const {createUser} = authController();
  authRouter.route('/signUp')
  .post(createUser)

  return authRouter;
}
module.exports = router;