import axios from "axios"
import BASE_URL from "./index"

export const assignTaskFunction=async(data)=>{
    try {
        const res=await axios.post("http://localhost:5001/MyProfile/Tasks/DailyTasks",{
            Headers:{
                "Content-Type":"application/json"
            },
            data
        })
    } catch (error) {
        console.log(error,"error")
    }
}

export const updatedAssignTaskData=async(data,id)=>{
    try {
        const res=await axios.put(`http://localhost:5001/MyProfile/Tasks/DailyTasks/${id}`,{
            Headers:{
                "Content-Type":"application/json"
            },
            data
        })
    } catch (error) {
        
    }
}

export const getTaskDataHandler = async () => {
    try {
        const res = await axios.get(BASE_URL + `/MyProfile/Tasks/DailyTasks`,{
            Headers:{
                "Content-Type":"application/json"
            },
        })
        return res.data
    } catch (error) {
        
    }
}

export const saveTaskDataHandler = async (taskData) => {
    try {
        const res = await axios.post(BASE_URL + `/MyProfile/Tasks/DailyTasks`,{
            Headers:{
                "Content-Type":"application/json"
            },
            data:taskData

        })
        return res.data
    } catch (error) {
        
    }
}