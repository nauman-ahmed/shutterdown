import React, { useState,useEffect } from "react";
import { Button } from "reactstrap";
import "../../assets/css/Profile.css";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthContext } from "../../config/context";
import Cookies from "js-cookie";
// import { useAuthContext } from "../config/context";



// This is a Value Of About Sections 
const aboutInput = {
  about: "",
  What_I_love_about_my_Job: "",
  My_Interests_and_hobbies: "",
}


function About() {

const {GetDataProfile}=useAuthContext();

  useEffect(() => {
    GetDataProfile();
  }, [])


  const [aboutValue, setAboutValue] = useState(aboutInput)

  // This is Function of About Section Start...


  const handleAbout = e => {
    setAboutValue(s => ({ ...s, [e.target.name]: e.target.value }))
  }

  const handleUpdateAbout =  async(e) => {
    e.preventDefault();

    // let {
    //   about,
    //   What_I_love_about_my_Job,
    //   My_Interests_and_hobbies,
    // } = aboutValue

    let user = JSON.parse(Cookies.get('currentUser'))
    let id = user._id

    try {
      const res = await axios.put(
        `http://localhost:5001/MyProfile/About/${id}`,
        {
          Headers: {
            'Content-Type': 'application/json',
          },
          aboutValue
        }
      );
      toast.success('You Are Registered Successfully');
      if (res.status===200) {
  toast.success('You Are Registered Successfully');
         setAboutValue({
           about: '',
           What_I_love_about_my_Job: '',
           My_Interests_and_hobbies: '',
         });
      }
     
    } catch (error) {
      console.log(error, "error")
    }

    

    // This is Function of About Section End...
  }

  return (
    <>
      <div className="AboutCard ">

        <div className="Text16N">About</div>

        <textarea name="about" placeholder="Add your answer here" value={aboutValue.about} className="input mt7 Text10N" cols="20" rows="5" onChange={handleAbout}></textarea>

        <div className="Text16N mt15">What I love about my Job</div>

        <textarea name="What_I_love_about_my_Job" placeholder="Add your answer here" value={aboutValue.What_I_love_about_my_Job} className="input mt7 Text10N" cols="20" rows="5" onChange={handleAbout}></textarea>

        <div className="Text16N mt15">My Interests and hobbies</div>

        <textarea name="My_Interests_and_hobbies" placeholder="Add your answer here" value={aboutValue.My_Interests_and_hobbies} className="input mt7 Text10N" cols="20" rows="5" onChange={handleAbout}></textarea>


      </div>
      <div className="pb-5 mb-3 text-center">
        <Button className="Update_btn" onClick={handleUpdateAbout}>
          Update
        </Button>
      </div>

    </>
  );
}

export default About;
