import axios from "axios"
import BASE_URL from "./index"

export const sendCinematographerName=async(data)=>{    
  try {
      const dataId=JSON.parse(localStorage.getItem("clientInfo"))
      const DeliverableData={
              userId:dataId.userID,
              data:data
      }
  const res = await axios.post(
    'http://localhost:5001/Myprofile/Deliverables/Cinematography',
    {
      Headers: {
        'Content-Type': 'application/json',
      },
      DeliverableData,
    }
  );
  } catch (error) {
      console.log(error,"error")
  }
}

export const sendCinematographyData=async(data)=>{
  try {
    const res= await axios.post(BASE_URL + "/Myprofile/Deliverables/Cinematography",{
      Headers:{
        "Content-Type":"application/json"
      },
      data
    })

  } catch (error) {
    
  }
}

export const sendPhotoData = async (data) => {
  try {
    const res = await axios.post(
      'http://localhost:5001/Myprofile/Deliverables/Photos',
      {
        Headers: {
          'Content-Type': 'application/json',
        },
        data,
      }
    );
  } catch (error) {
    console.log(error,"error")
  }
};

export const getPhotoData = async (data) => {
  try {
    const res = await axios.get( BASE_URL + 
      '/Myprofile/Deliverables/Photos',
      {
        Headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return res.data
  } catch (error) {
    console.log(error,"error")
  }
};

export const sendAlbumData = async (data) => {
  try {
    const res = await axios.post(BASE_URL + 
      '/MyProfile/Deliverables/Albums',
      {
        Headers: {
          'Content-Type': 'application/json',
        },
        data,
      }
    );
  } catch (error) {
    console.log(error, 'error');
  }
};

export const getAlbumData = async (data) => {
  try {
    const res = await axios.get(
      'http://localhost:5001/MyProfile/Deliverables/Albums',
      {
        Headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return res.data
  } catch (error) {
    console.log(error, 'error');
  }
};

export const getDeliverablesCinematography = async (data) => {
  try {
    const res = await axios.get( BASE_URL + 
      '/MyProfile/Deliverables/Cinematography',
      {
        Headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return res.data
  
  } catch (error) {
    console.log(error, 'error');
  }
};