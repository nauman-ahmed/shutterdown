import axios from "axios"
import BASE_URL from "./index"

export const CheckListDataPost=async(data,id)=>{
    try {
        const res=await axios.post(BASE_URL + "/MyProfile/CheckLists",{
            headers:{
                "Content-Type":"application/json"
            },
            data,id
        })
    } catch (error) {
        
    }
}

export const getCheckListData = async () => {
    try {
        const res=await axios.get(BASE_URL + "/CheckLists",{
            headers:{
                "Content-Type":"application/json"
            },
        })
        return res.data
    } catch (error) {
        
    }
}