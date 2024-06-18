import axios from "axios"
import BASE_URL from "./index"
import Cookies from "js-cookie"
import { toast } from "react-toastify"


export const postWhatsappText = async (data) => {
    try {

        const res = await axios.post(BASE_URL + '/Whatsapp/postWhatsappText', {
            Headers: {
                "Content-Type": "application/json"
            },
            data,
        },
        )
        return res
    } catch (error) {

    }
}

export const getAllWhatsappText = async () => {
    try {

        const res = await axios.get(BASE_URL + '/Whatsapp/', {
            Headers: {
                "Content-Type": "application/json"
            },
        },
        )
        return res.data
    } catch (error) {

    }
}