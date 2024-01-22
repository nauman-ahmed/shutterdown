
import axios from "axios"
export const getClientEventsApi=async()=>{
  const id=JSON.parse(localStorage.getItem("userEmail"))
    try {
        const res = await axios.get(
          global.BASEURL+`/Calender/View`
        );
        return res
    } catch (error) {
        console.log(error)
    }
}
const id=JSON.parse(localStorage.getItem("userEmail"))

export const apiHit = async () => {
  return await axios.get(global.BASEURL+`/MyProfile/Calender/ListView/${id}`)
}

export const AssignTeam = async () => {
  try {
    const id = JSON.parse(localStorage.getItem('userEmail'));
    const res = await axios.post(
      global.BASEURL+`/MyProfile/Calender/ListView`
    );
    if (res) {
      localStorage.setItem('clientData', JSON.stringify(res));
    }
  } catch (error) {
    console.log(error);
  }
};

export const getManagerApi = async () => {
  try {
    const res = await axios.get(
      global.BASEURL+`/MyProfile/AddClient/Form-I`
    );
    if (res) {
      return res
    }
  } catch (error) {
    console.log(error);
  }
};

export const preWeddingUpdatedData=async(data,i)=>{
try {

  const res=await axios.put(`http://localhost:5001/MyProfile/PreWedShoot/PreWedShootScreen/${data._id}`,{
    Headers:{
      "Content_Type":"application/json"
    },
    data,i
  })
} catch (error) {
  
}
}
