import axios from 'axios';
import BASE_URL from '.';
import Cookies from 'js-cookie'
import { toast } from 'react-toastify';

export const GetsignUPData = async (data, phoneNo) => {

  const { firstName, lastName, email, password, confirmPassword,rollSelect } = data;

  console.log(data);

  const res = await axios.post(BASE_URL+'/Signup', {
    Headers: {
      'Content-Type': 'application/json',
    },

    firstName: firstName,
    lastName: lastName,
    email: email,
    phoneNo: phoneNo,
    password: password, 
    confirmPassword: confirmPassword,
    rollSelect:rollSelect
  });

   localStorage.setItem('res', JSON.stringify(res));
};
export const GetSignInWithGoogleData = async (data, phoneNo) => {

  // console.log(`this is roll base ${rollSelect}`);

  const { firstName, lastName, email, rollSelect } =
    data;

  const res = await axios.post(BASE_URL + '/signInWithGoogle', {
    Headers: {
      'Content-Type': 'application/json',
    },
    firstName: firstName,
    lastName: lastName,
    email: email,
    phoneNo: phoneNo,
    rollSelect: rollSelect,
  });
  localStorage.setItem('loginUser', JSON.stringify(res));
  localStorage.setItem("res",JSON.stringify(res))
};
export const checkExistEmail=async(data)=>{
  try {
    const res=await axios.post("http://localhost:5002/",{
      Headers:{
        "Content-Type":"application/json"
      },
      data
    })
    localStorage.setItem('loginUser', JSON.stringify(res));
    localStorage.setItem('res', JSON.stringify(res));
    
  } catch (error) {
    console.log(error,"error")
  }
}
export const GetSignInApi = async (data) => {
  const { email, password } = data;
  console.log(data);
  console.log(BASE_URL);
  await axios.post(BASE_URL, {
    Headers: {
      'Content-Type': 'application/json',
    },
    email: email,
    password: password,
  }).then(res => {
    Cookies.set('currentUser', JSON.stringify(res.data.User))
    toast.success('Logged in successfully!')
  
  }).catch(err => {
    console.log(err);
    if(err.response.status === 404){
      window.notify(err.response.data, 'error')
    }
    Cookies.remove('currentUser');
  });

};
export const verifyEmail = async (data) => {
  const { email, password } = data;
  try {
    const res = await axios.post(BASE_URL+'/emailVerify', {
      Headers: {
        'Content-Type': 'application/json',
      },
      password: password,
      email: email,
    });
  } catch (error) {
    console.log(error, 'error');
  }
};

export const newPass = async (data) => {
  const { password } = data;
  try {
    const res = await axios.put(BASE_URL+'/ResetPassword', {
      Headers: {
        'Content-Type': 'application/json',
      },

      password: password,
    });
    if (res.status === 200) {
      alert('Email Is Verified');
    }
  } catch (error) {
    alert(error.toString());
  }
};

export const getAllUsers = async () => {
  try {
    const res = await axios.get(BASE_URL+'/getAllUsers', {
      Headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data
  } catch (error) {
    alert(error.toString());
  }
};


export const getEditors = async () => {
  try {
    const res = await axios.get(BASE_URL+'/getEditors', {
      Headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data
  } catch (error) {
    alert(error.toString());
  }
};


