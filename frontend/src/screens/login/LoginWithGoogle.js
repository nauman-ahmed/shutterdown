import React,{useEffect,useState} from 'react'
import CommonDropText from '../../components/CommonDropText';

import { FormGroup, Input, Label, Button, Form } from 'reactstrap';
import '../../assets/css/common.css';
import { useNavigate,useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Logo from '../../components/Logo';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import Signup from '../signup/Signup';
import { checkExistEmail } from '../../API/userApi';
import { GetSignInWithGoogleData } from '../../API/userApi';
const LoginWithGoogle = () => {
    const location=useLocation()
    const navigate=useNavigate()
    let array=[]
    array.push(location?.state?.data)
    const [isSignInWithGoogle,setIsSignInWithGoogle]=useState(false)
    const getExistEmaiData=async()=>{
      try {
        
        const email = JSON.parse(localStorage.getItem('signInWithGoogle'));
        const email1 = email.data.email;
        await checkExistEmail(email1)
      } catch (error) {
        console.log(error,"error")
      }
    }
    useEffect(()=>{
setIsSignInWithGoogle(true)


getExistEmaiData()



    },[])
  return (
   <>
   
   <Signup signInWithGoogle={isSignInWithGoogle}/>
   </>
  )
}

export default LoginWithGoogle