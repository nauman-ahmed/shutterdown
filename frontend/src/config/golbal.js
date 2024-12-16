import { toast } from 'react-toastify'


// import dayjs from 'dayjs'

// window.getRandomId = () => Math.random().toString(34).slice(2);




window.notify = (msg, type) => {
    const option = {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme : 'colored'
    }

    switch (type) {
        case "success":
            toast.success(msg, option)
            break
        case "error":
            toast.error(msg, option)
            break
        case "info":
            toast.info(msg, option)
            break
        case "warning":
            toast.warning(msg, option)
            break
        default:
            toast(msg, option)
    }
}