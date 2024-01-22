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
  phoneNo: {
    type: String,
  },
  password: {
    type: String,
    // required: true,
  },
  rollSelect: {
    type: String,
    required: true,
  },
  About:{
    type:String,
  },
  AboutMyJob:{
    type:String
  },
  interestAndHobbies:{
    type:String
  },
  middleName:{
    type:String,
  },
   
    Gender:{
      type:String
    },
    DOB:{
type:String
    },
    BloodGroup:{
type:String
    },
    maritalStatus:{
      type:String
    },
  physicalHandicaped:{
    type:String,
  },
    workEmail:{
      type:String
    },
    workPhone:{
      type:String
    },
    currentAddress:{
      type:String
    },
    permanentAddress:{
      type:String
    },
    Experience:{
      type:String
    },
    EmployeeNumber:{
      type:String
    },
    DateOfJoining:{
      type:String
    },
    JobTitle:{
      type:String
    },
    jobType:{
      type:String
    },
    shiftTiming:{
      type:String
    },
    leavePlan:{
      type:String
    }
    
  
});
const userModel = mongoose.model('user', userSchema);
module.exports = userModel;
