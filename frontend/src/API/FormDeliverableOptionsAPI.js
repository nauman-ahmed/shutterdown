import axios from "axios"
import BASE_URL from "./index"
import Cookies from "js-cookie"
import { toast } from "react-toastify"

export const getAllDeliverableOptions = async (data) => {
    try {
        const res = await axios.get(BASE_URL + '/deliverableOptions/getAll', {
            Headers: {
                "Content-Type": "application/json"
            }
        },
        )
        return res.data[0]
    } catch (error) {

    }
}

export const updateAllDeliverableOptions = async (data) => {
    try {
        const res = await axios.post(BASE_URL + '/deliverableOptions/updateAll', {
            Headers: {
                "Content-Type": "application/json"
            },
            data
        },
        )
        return res
    } catch (error) {

    }
}