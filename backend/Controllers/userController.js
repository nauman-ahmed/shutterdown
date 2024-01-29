const userSchema = require('../models/userSchema');

const RegisterPostRequest = async (req, res) => {
  try {
    if (!req.body.data) {
      const { firstName, lastName, email, phoneNo, password, rollSelect } =
        req.body;
      const existEmail = await userSchema.findOne({ email: email });
      if (existEmail) {
        res.status(200).json({
          message: 'user is already exists',
          existEmail: { existEmail },
          User: {
            firstName: existEmail.firstName,
            lastName: existEmail.lastName,
            email: existEmail.email,
            rollSelect: existEmail.rollSelect,
            _id: existEmail._id,
          },
        });
      } else if (existEmail === null) {
        const user = await userSchema({
          firstName,
          lastName: lastName,
          email: email,
          phoneNo: phoneNo,
          password: password,
          rollSelect: rollSelect,
        });
        res.status(200).json({
          message: 'You are Registered Successfully',
          User: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            rollSelect: user.rollSelect,
            _id: user._id,
          },
        });

        await user.save();
      }
    } else {
      const email = await userSchema.findOne({ email: req.body.data });
      res.status(200).json({
        result: 'true',
        message: 'user already exists',
        User: {
          firstName: email.firstName,
          lastName: email.lastName,
          email: email.email,
          rollSelect: email.rollSelect,
          _id: email._id,
        },
      });
    }
  } catch (error) {
    res.status(404).json('Invalid Credentials');
  }
};

const SignInPostRequest = async (req, res) => {
  try {
    console.log(req.body);
    
      const loginUser = await userSchema.findOne({
        email: req.body.email,
        password: req.body.password,
      });
      console.log(loginUser);
      if (loginUser) {
        res
          .status(200)
          .json({ message: 'Login Successfully', User: loginUser });
      } else {
        res.status(404).json({ message: 'Invalid Credentials' });
      }
   
  } catch (error) {
    console.log(error);
    res.status(404).json('invalid Credentials');
  }
};
const verifyEmail = async (req, res) => {
  try {
    const email = await userSchema.findOne({ email: req.body.email });
    if (email) {
      res.status(200).json('Your Email IS Verified');
    } else {
      res.status(404).json('Your Email is not Exists');
    }
  } catch (error) {
    res.status(404).json('Your Email is not exists');
  }
};
const newPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const id = req.params.id;
    const updatedData = await userSchema.findOneAndUpdate(
      { email: email },
      {
        email: email,
        password: password,
      }
    );
    if (updatedData) {
      res.status(200).json(updatedData);
    }
  } catch (error) {
    res.status(400).json('not Updated');
  }
};
const getExistEmail = async (req, res) => {
  try {
    const email = await userSchema.findOne({ email: req.body.data });
  } catch (error) {}
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userSchema.find({  });
    res.json({users})
  } catch (error) {
    console.log("error")
  }
};
const getEditors = async (req, res) => {
  try {
    const editors = await userSchema.find({ rollSelect : 'Editor'  });
    res.json({editors})
    console.log('gone');
  } catch (error) {
    console.log("error")
  }
};


module.exports = {
  RegisterPostRequest,
  SignInPostRequest,
  verifyEmail,
  newPassword,
  getExistEmail,
  getAllUsers,
  getEditors
};
