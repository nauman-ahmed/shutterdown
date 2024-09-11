const userSchema = require('../models/userSchema');
const path = require('path');
const fs = require('fs');
const mimeTypes = require('mime-types');
const mongoose = require('mongoose');
const { Readable } = require("stream");

// Initialize GridFSBucket
let bucket;
mongoose.connection.once('open', () => {
  console.log("connection established successfully")
  bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db)
});



const updateUserData = async (req, res) => {
  try {
    const updatedUser = await userSchema.findByIdAndUpdate(req.body._id, req.body, { new: true });
    res.status(200).json({ message: 'Information Updated Successfully!' })
  } catch (error) {
    console.log(error);
  }
}
const downloadFile = async (req, res) => {
  try {
    const fileId = req.params.fileId;
    let downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));

    // Fetch the file metadata to set the correct headers
    downloadStream.on("file", (file) => {
      // Set Content-Type for the file
      res.set("Content-Type", file.contentType);

      // Set Content-Disposition header to prompt download with a specified filename
      res.set(
        "Content-Disposition",
        `attachment; filename="${file.filename || 'downloaded-file'}"`
      );
    });

    // Handle the error if no file is found or any other issue
    downloadStream.on("error", (error) => {
      console.error('Error during file download:', error);
      return res.status(404).json({ error: 'File not found in GridFS' });
    });

    // Pipe the file data into the response
    downloadStream.pipe(res);
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'An error occurred while downloading the file' });
  }
};


const getUserAccountbanned = async (req, res) => {
  try {
    const updatedUser = await userSchema.findByIdAndUpdate(req.body.data._id, { banAccount: true }, { new: true });
    res.status(200).json({ message: 'Account has been banned' })
  } catch (error) {
    console.log(error);
  }
}

const getUserAccountUnbanned = async (req, res) => {
  try {
    const updatedUser = await userSchema.findByIdAndUpdate(req.body.data._id, { banAccount: false }, { new: true });
    res.status(200).json({ message: 'Account has been unbanned' })
  } catch (error) {
    console.log(error);
  }
}

const getUserAccountApproved = async (req, res) => {
  try {
    const updatedUser = await userSchema.findByIdAndUpdate(req.body.data._id, { accountRequest: false }, { new: true });
    res.status(200).json({ message: 'Account Approved' })
  } catch (error) {
    console.log(error);
  }
}

const getAllAccountDetails = async (req, res) => {
  try {
    let userAccountDetails = await userSchema.find({});

    // Assuming 'userAccountDetails' is your original array of Mongoose documents
    userAccountDetails = userAccountDetails.map(doc => {
      // Convert the Mongoose document to a plain JavaScript object
      const obj = doc.toObject();

      // Add the fullname field by merging firstName and lastName
      return {
        ...obj,
        fullname: `${obj.firstName} ${obj.lastName}`
      };
    });

    // Sorting the array so that objects with accountRequest = true come first,
    // and if accountRequest is the same, then sort by banRequest = true next
    userAccountDetails.sort((a, b) => {
      if (a.accountRequest === b.accountRequest) {
        // If accountRequest is the same, sort by banRequest
        return (a.banRequest === b.banRequest) ? 0 : a.banRequest ? -1 : 1;
      }
      return a.accountRequest ? -1 : 1;
    });

    res.status(200).json(userAccountDetails);
  } catch (error) {
    res.status(404).json('Your Email is not exists');
  }
};

const getAllAccountRequestCount = async (req, res) => {
  try {
    const userAccountRequests = await userSchema.find({ accountRequest: true });
    res.status(200).json(userAccountRequests.length);
  } catch (error) {
    res.status(404).json('Your Email is not exists');
  }
};

const previewFile = async (req, res) => {
  try {
    // Get the file ID from the request parameters
    const fileId = req.params.fileId;

    let readStream = bucket.openDownloadStream( new mongoose.Types.ObjectId(fileId))

    readStream.on("file", (file)=>{
        res.set("Content-Type", file.contentType)
    })

    readStream.pipe(res)
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: 'File not found in GridFS' });
  }
};
const uploadFile = async (file, userData, fieldName) => {
  try {
    console.log(file);
    let { fieldname, originalname, mimetype, buffer } = file

    let uploadStream = bucket.openUploadStream(fieldname)
    let readBuffer = new Readable()
    readBuffer.push(buffer)
    readBuffer.push(null)


    const isUploaded = await new Promise((resolve, reject) => {
      readBuffer.pipe(uploadStream)
        .on("finish", resolve("successfull"))
        .on("error", reject("error occured while creating stream"))
    })
    userData[fieldName] = {id : uploadStream.id, ext : originalname.split('.').pop()}
    console.log('file uploaded');



  } catch (error) {
    console.log('error in file upload function');
    console.log(error);
  }
};

const uploadFiles = async (req, res) => {
  try {
    console.log(req.files);
    const userData = await userSchema.findById(req.params.userId);

    if (req.files['adharCard']) await uploadFile(req.files['adharCard'][0], userData, 'adharCard');
    if (req.files['panCard']) await uploadFile(req.files['panCard'][0], userData, 'panCard');
    if (req.files['drivingLicense']) await uploadFile(req.files['drivingLicense'][0], userData, 'drivingLicense');
    if (req.files['voterID']) await uploadFile(req.files['voterID'][0], userData, 'voterID');
    if (req.files['passport']) await uploadFile(req.files['passport'][0], userData, 'passport');
    if (req.files['photo']) await uploadFile(req.files['photo'][0], userData, 'photo');
    if (req.files['signature']) await uploadFile(req.files['signature'][0], userData, 'signature');

    await userData.save();
    res.status(200).json({ message: 'Files saved!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'File upload failed' });
  }
};
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
    const loginUser = await userSchema.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    if (loginUser) {
      if (loginUser.accountRequest) {
        res.status(404).json({ message: 'Your account is not approved' });
        return
      }
      if (loginUser.banAccount) {
        res.status(404).json({ message: 'Your account access is limited' });
        return
      }
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
  } catch (error) { }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userSchema.find({});
    res.json({ users })
  } catch (error) {
    console.log("error")
  }
};
const getEditors = async (req, res) => {
  try {
    const editors = await userSchema.find({ rollSelect: 'Editor' });
    res.json({ editors })
  } catch (error) {
    console.log("error")
  }
};
const getShooters = async (req, res) => {
  try {
    const shooters = await userSchema.find({ rollSelect: 'Shooter' });
    res.json({ shooters })
  } catch (error) {
    console.log("error")
  }
};


module.exports = {
  getUserAccountUnbanned,
  getUserAccountbanned,
  getUserAccountApproved,
  getAllAccountDetails,
  getAllAccountRequestCount,
  RegisterPostRequest,
  getShooters,
  SignInPostRequest,
  verifyEmail,
  newPassword,
  getExistEmail,
  getAllUsers,
  getEditors,
  uploadFiles,
  downloadFile,
  previewFile,
  updateUserData
};
