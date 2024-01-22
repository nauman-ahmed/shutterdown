 const { findByIdAndUpdate } = require('../models/userSchema')
 const clientSchema=require('../models/ClientModel')
const userModel=require('../models/userSchema')

const ProfileHeaderFunction=async(req,res)=>{

try {
    const user=await userModel.findById({_id:req.params.id})
    if (user) {
        res.status(200).json({message:"Api send",data:user})
    }
} catch (error) {
    res.status(404).json(error)
}
}


const UpdateManagerFunction= async(req,res)=>{

try {
  const userID = await userModel.findByIdAndUpdate(
    { _id: req.params.id },
    {
      About: req.body.aboutValue.about,
      AboutMyJob: req.body.aboutValue.What_I_love_about_my_Job,
      interestAndHobbies: req.body.aboutValue.My_Interests_and_hobbies,
    }
  );
  res.status(200).json("User has been updated",userID)

 
} catch (error) {
    
}
}


const ProfileUpdateFunction=async (req,res)=>{
  if (!req.body.primaryValue) {
    try {
      const userID = await userModel.findByIdAndUpdate(
        { _id: req.params.id },
        {
          PhoneNo: req.body.contactValue.mobile_phone,
          workPhone: req.body.contactValue.work_phone,
          workEmail: req.body.contactValue.work_email,
          email: req.body.contactValue.personal_email,
          
        }
      );
      res
        .status(200)
        .json({ message: 'user Updated Successfully', data: userID });
    } catch (error) {}
  }
 if (req.body.primaryValue && !req.body.contactValue&&!req.body.addressValue) {
      try {
        const userID = await userModel.findByIdAndUpdate(
          { _id: req.params.id },
          {
            firstName: req.body.primaryValue.first_name,
            lastName: req.body.primaryValue.last_name,
            MiddleName: req.body.middle_name,
            Gender: req.body.primaryValue.gender,
            DOB: req.body.primaryValue.DOB,
            BloodGroup: req.body.primaryValue.marital_status,
            physicalHandicaped: req.body.primaryValue.physically_handicapped,
          }
        );
        res
          .status(200)
          .json({ message: 'user Updated Successfully', data: userID });
      } catch (error) {}
  }
 if (!req.body.primaryValue&&!req.body.contactValue&&req.body.addressValue) {
      try {
        const userID = await userModel.findByIdAndUpdate(
          { _id: req.params.id },
          {
            currentAddress: req.body.addressValue.current_address,
            permanentAddress: req.body.addressValue.permanent_address,

          }
        );

        res
          .status(200)
          .json({ message: 'user Updated Successfully', data: userID });
      } catch (error) {}
 
 
 }
 if (
   !req.body.primaryValue &&
   !req.body.contactValue &&
   !req.body.addressValue&&
   req.body.experienceValue
 ) {
   try {
 
     const userID = await userModel.findByIdAndUpdate(
       { _id: req.params.id },
       {
         Experience: req.body.experienceValue.experience,
         
       }
     );

     res
       .status(200)
       .json({ message: 'user Updated Successfully', data: userID });
   } catch (error) {}
 }
}

const jobValueFunction=async(req,res)=>{
  const {employee_number,date_of_joining,job_title,job_type,shift_timing,leave_plan}=req.body.jobValue
try {
  const jobValue = await userModel.findByIdAndUpdate(
    { _id: req.params.id },
    {
     EmployeeNumber:employee_number,
     DateOfJoining:date_of_joining,
       jobTitle:job_title,
     jobType:job_type,
      shiftTiming:shift_timing,
     leavePlan:leave_plan
    }
  );
//   const jobValue=await userModel({
// EmployeeNumber:employee_number,
// DateOfJoining:date_of_joining,
// jobTitle:job_title,
// jobType:job_type,
// shiftTiming:shift_timing,
// leavePlan:leave_plan


//   })
  res.status(200).json(jobValue)
} catch (error) {
  res.status(404).json("not posted")
}
}
const clientData=async(req,res)=>{
try {
  
  const clientData=await clientSchema.find({userID:req.params.id})
  res.status(200).json(clientData)
} catch (error) {
  console.log(error,"error")
}
}
module.exports = {
  ProfileHeaderFunction,
  UpdateManagerFunction,
  ProfileUpdateFunction,
  jobValueFunction,
  clientData
};