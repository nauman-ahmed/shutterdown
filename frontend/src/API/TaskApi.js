import axios from "axios"
import BASE_URL from "./index"
import Cookies from "js-cookie";

export const addTask = async (data) => {
    try {
        await axios.post(BASE_URL + "/MyProfile/Tasks/addTask", {
            Headers: {
                "Content-Type": "application/json"
            },
            data
        }).then(() => { window.notify('Added successfully!', 'success') });
    } catch (error) {
        console.log(error, "error")
    }
}

export const updateTaskData = async (data) => {
    try {
        await axios.put(BASE_URL + '/MyProfile/Tasks/updateTask', {
            Headers: {
                "Content-Type": "application/json"
            },
            data
        }).then(() => { window.notify('Updated successfully!', 'success') });
    } catch (error) {

    }
}

export const getAllTasks = async (page) => {
    try {
        const res = await axios.get(BASE_URL + `/MyProfile/Tasks/getAllTasks`, {
            Headers: {
                "Content-Type": "application/json"
            },
            params : {
                page : page
            }
        })
        return res.data
    } catch (error) {

    }
}

export const getPendingTasks = async (page) => {
    try {
        const res = await axios.get(BASE_URL + `/MyProfile/Tasks/getPendingTasks?page=${page}`, {
            Headers: {
                "Content-Type": "application/json"
            },
        })
        return res.data
    } catch (error) {
        console.log(error);
    }
}

export const getEditorTasks = async (page) => {
    try {
        const currentUser = JSON.parse(Cookies.get('currentUser'));
        const res = await axios.get(BASE_URL + `/MyProfile/Tasks/getEditorTasks/${currentUser._id}?page=${page}`, {
            Headers: {
                "Content-Type": "application/json"
            },
        })
        return res.data
    } catch (error) {

    }
}
