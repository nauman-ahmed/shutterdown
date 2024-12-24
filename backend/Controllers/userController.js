const userSchema = require("../models/userSchema");
const path = require("path");
const fs = require("fs");
const mimeTypes = require("mime-types");
const mongoose = require("mongoose");
const { Readable } = require("stream");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "naumanahmed449@gmail.com",
    pass: "vils yuht uyla xrov",
  },
});

// Initialize GridFSBucket
let bucket;
mongoose.connection.once("open", () => {
  console.log("connection established successfully");
  bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db);
});

function generatePassword() {
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const allChars = lower + upper + numbers;
  // Ensure at least one lowercase, one uppercase, and one number
  let password = "";
  password += lower[Math.floor(Math.random() * lower.length)];
  password += upper[Math.floor(Math.random() * upper.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];

  // Generate the rest of the characters randomly from allChars
  for (let i = 3; i < 8; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password to ensure randomness
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}

const updateUserData = async (req, res) => {
  try {
    const updatedUser = await userSchema.findByIdAndUpdate(
      req.body._id,
      req.body,
      { new: true }
    );
    res.status(200).json({ message: "Information Updated Successfully!", updatedUser });
  } catch (error) {
    console.log(error);
  }
};

const downloadFile = async (req, res) => {
  try {
    const fileId = req.params.fileId;
    let downloadStream = bucket.openDownloadStream(
      new mongoose.Types.ObjectId(fileId)
    );
    // Fetch the file metadata to set the correct headers
    downloadStream.on("file", (file) => {
      // Set Content-Type for the file
      res.set("Content-Type", file.contentType);
      // Set Content-Disposition header to prompt download with a specified filename
      res.set(
        "Content-Disposition",
        `attachment; filename="${file.filename || "downloaded-file"}"`
      );
    });

    // Handle the error if no file is found or any other issue
    downloadStream.on("error", (error) => {
      console.error("Error during file download:", error);
      return res.status(404).json({ error: "File not found in GridFS" });
    });

    // Pipe the file data into the response
    downloadStream.pipe(res);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "An error occurred while downloading the file" });
  }
};

const getUserAccountbanned = async (req, res) => {
  try {
    const updatedUser = await userSchema.findByIdAndUpdate(
      req.body.data._id,
      { banAccount: true },
      { new: true }
    );
    res.status(200).json({ message: "Account has been banned" });
  } catch (error) {
    console.log(error);
  }
};

const getUserAccountUnbanned = async (req, res) => {
  try {
    const updatedUser = await userSchema.findByIdAndUpdate(
      req.body.data._id,
      { banAccount: false },
      { new: true }
    );
    res.status(200).json({ message: "Account has been unbanned" });
  } catch (error) {
    console.log(error);
  }
};

const getUserAccountApproved = async (req, res) => {
  try {
    const updatedUser = await userSchema.findByIdAndUpdate(
      req.body.data._id,
      { accountRequest: false },
      { new: true }
    );
    res.status(200).json({ message: "Account Approved" });
  } catch (error) {
    console.log(error);
  }
};

const getAllAccountDetails = async (req, res) => {
  try {
    let userAccountDetails = await userSchema.find({});
    // Assuming 'userAccountDetails' is your original array of Mongoose documents
    userAccountDetails = userAccountDetails.map((doc) => {
      // Convert the Mongoose document to a plain JavaScript object
      const obj = doc.toObject();
      // Add the fullname field by merging firstName and lastName
      return {
        ...obj,
        fullname: `${obj.firstName} ${obj.lastName}`,
      };
    });

    // Sorting the array so that objects with accountRequest = true come first,
    // and if accountRequest is the same, then sort by banRequest = true next
    userAccountDetails.sort((a, b) => {
      if (a.accountRequest === b.accountRequest) {
        // If accountRequest is the same, sort by banRequest
        return a.banRequest === b.banRequest ? 0 : a.banRequest ? -1 : 1;
      }
      return a.accountRequest ? -1 : 1;
    });
    res.status(200).json(userAccountDetails);
  } catch (error) {
    res.status(404).json("Your Email is not exists");
  }
};

const getAllAccountRequestCount = async (req, res) => {
  try {
    const userAccountRequests = await userSchema.find({ accountRequest: true });
    res.status(200).json(userAccountRequests.length);
  } catch (error) {
    res.status(404).json("Your Email is not exists");
  }
};

const previewFile = async (req, res) => {
  try {
    // Get the file ID from the request parameters
    const fileId = req.params.fileId;
    let readStream = bucket.openDownloadStream(
      new mongoose.Types.ObjectId(fileId)
    );
    readStream.on("file", (file) => {
      res.set("Content-Type", file.contentType);
    });

    readStream.pipe(res);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "File not found in GridFS" });
  }
};

const uploadFile = async (file, userData, fileName, fieldName) => {
  try {
    let { fieldname, originalname, mimetype, buffer } = file;
    let uploadStream = bucket.openUploadStream(
      fileName + "." + originalname.split(".").pop()
    );
    let readBuffer = new Readable();
    readBuffer.push(buffer);
    readBuffer.push(null);
    const isUploaded = await new Promise((resolve, reject) => {
      readBuffer
        .pipe(uploadStream)
        .on("finish", resolve("successfull"))
        .on("error", reject("error occured while creating stream"));
    });
    userData[fieldName] = uploadStream.id;
  } catch (error) {
    console.log("error in file upload function");
    console.log(error);
  }
};

const uploadFiles = async (req, res) => {
  try {
    const userData = await userSchema.findById(req.params.userId);
    if (req.files["Adhar-Card"])
      await uploadFile(
        req.files["Adhar-Card"][0],
        userData,
        "Adhar-Card",
        "adharCard"
      );
    if (req.files["Pan-Card"])
      await uploadFile(
        req.files["Pan-Card"][0],
        userData,
        "Pan-card",
        "panCard"
      );
    if (req.files["Driving-License"])
      await uploadFile(
        req.files["Driving-License"][0],
        userData,
        "Driving-Licenese",
        "drivingLicense"
      );
    if (req.files["Voter-ID"])
      await uploadFile(
        req.files["Voter-ID"][0],
        userData,
        "Voter_ID",
        "voterID"
      );
    if (req.files["Passport"])
      await uploadFile(
        req.files["Passport"][0],
        userData,
        "Passport",
        "passport"
      );
    if (req.files["Photo"])
      await uploadFile(req.files["Photo"][0], userData, "Photo", "photo");
    if (req.files["Signature"])
      await uploadFile(
        req.files["Signature"][0],
        userData,
        "Signature",
        "signature"
      );

    await userData.save();
    res.status(200).json({ message: "Files saved!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "File upload failed" });
  }
};
const RegisterPostRequest = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNo, password, rollSelect } =
      req.body;
    const existEmail = await userSchema.findOne({ email: email });
    if (existEmail) {
      res.status(400).json({
        message: "user already exists",
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
      const user = new userSchema({
        firstName,
        lastName: lastName,
        email: email,
        phoneNo: phoneNo,
        password: password,
        rollSelect: rollSelect,
      });
      const savedUser = await user.save();
      const token = jwt.sign(
        { id: savedUser._id, email: savedUser.email }, // Payload
        process.env.JWT_SECRET, // Secret key
        { expiresIn: "12h" } // Token expiration time
      );
      res.status(200).json({
        message: "You are Registered Successfully",
        User: user,
        token
      });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json("Invalid Credentials");
  }
};

const SignInPostRequest = async (req, res) => {
  try {
    const loginUser = await userSchema.findOne({
      email: req.body.email,
      password: req.body.password,
    });

    if (loginUser) {
      // Check account status
      if (loginUser.accountRequest) {
        return res
          .status(403)
          .json({ message: "Your account is not approved" });
      }
      if (loginUser.banAccount) {
        return res
          .status(403)
          .json({ message: "Your account access is limited" });
      }

      const jwtOptions = req.body.remember ? {} : { expiresIn: "7d" };

      const token = jwt.sign(
        { id: loginUser._id, email: loginUser.email }, // Payload
        process.env.JWT_SECRET, // Secret key
        jwtOptions // Conditional options
      );
      

      // Respond with user details and token
      res.status(200).json({
        user: loginUser,
        token, // Include token in the response
      });
    } else {
      res.status(401).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const user = await userSchema.findOne({ email: req.body.email });
    if (user) {
      const password = generatePassword();
      user.password = password;
      const mailOptions = {
        from: "safdarstudent@gmail.com",
        to: user.email,
        subject: "Your New Password",
        html: `
          <p>Hello ${user.firstName},</p>
          <p>We have generated a new password for your account as requested. Here are your new login details:</p>
          <p><strong>New Password:</strong> ${password}</p>
          <p>Please log in to your account using the above password. For security reasons, we recommend that you change your password immediately after logging in. Here's how:</p>
          <ol>
            <li>Log in to your account using the new password.</li>
            <li>Navigate to the "Account Settings" or "Profile" section.</li>
            <li>Select the "Change Password" option.</li>
            <li>Enter the new password of your choice.</li>
          </ol>
          <p>If you did not request a password reset, please contact our support team immediately.</p>
          <p>Best regards,</p>
          <p>Your Application Team</p>
        `,
      };

      // Send the email
      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          console.log("mail error", error);
          return res.status(500).json({ message: "Error sending email" });
        }
        console.log("Email sent: " + info.response);
        await user.save();
        res
          .status(200)
          .json({ message: "Check your email for your new password." });
      });
    } else {
      res.status(203).json("Your Email is not Exists");
    }
  } catch (error) {
    res.status(400).json("Error");
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
    res.status(400).json("not Updated");
  }
};

const getExistEmail = async (req, res) => {
  try {
    const user = await userSchema.findOne({
      email: req.body.data,
      banAccount: false,
    });
    if (user) {
      res.status(200).json(user);
    }
    res.status(201).json({ error: true });
  } catch (error) {
    console.log(error);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userSchema.find({ banAccount: false });
    res.json({ users });
  } catch (error) {
    console.log("error");
  }
};

const getEditors = async (req, res) => {
  try {
    const editors = await userSchema.find({
      rollSelect: "Editor",
      banAccount: false,
    });
    res.json({ editors });
  } catch (error) {
    console.log("error");
  }
};

const getShooters = async (req, res) => {
  try {
    const shooters = await userSchema.find({ rollSelect: "Shooter" });
    res.json({ shooters });
  } catch (error) {
    console.log("error");
  }
};
const getMe = async (req, res) => {
  try {
    const user = await userSchema.findById(req.userId);
    res.json(user);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getMe,
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
  updateUserData,
};
