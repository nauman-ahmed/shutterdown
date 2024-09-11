const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  accountRequest: {
    type: Boolean,
    default: true
  },
  banAccount: {
    type: Boolean,
    default: false
  },
  phoneNo: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  rollSelect: {
    type: String,
    required: true,
  },
  about: {
    type: String,
  },
  aboutJob: {
    type: String
  },
  interestHobbies: {
    type: String
  },
  middleName: {
    type: String,
  },
  gender: {
    type: String
  },
  DOB: {
    type: Date
  },
  bloodGroup: {
    type: String
  },
  maritalStatus: {
    type: String
  },
  physicallyHandicapped: {
    type: String,
  },
  workEmail: {
    type: String
  },
  workPhone: {
    type: String
  },
  currentAddress: {
    type: String
  },
  permanentAddress: {
    type: String
  },
  experience: {
    type: String
  },
  employeeNumber: {
    type: String
  },
  dateOfJoining: {
    type: Date
  },
  jobTitle: {
    type: String
  },
  jobType: {
    type: String
  },
  shiftTiming: {
    type: String
  },
  leavePlan: {
    type: String
  },
  adharCard : {
    type : Object
  },
  panCard : {
    type : Object
  },
  drivingLicense : {
    type : Object
  },
  voterID : {
    type : Object
  },
  passport : {
    type : Object
  },
  subRole : [{
    type : String
  }],
  photo : {
    type : String
  },
  signature : {
    type : String
  }
});
const userModel = mongoose.model('user', userSchema);
module.exports = userModel;
