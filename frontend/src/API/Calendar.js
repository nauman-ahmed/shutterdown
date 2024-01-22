import axios from "axios"
import BASE_URL from "./index"


export const getAllEventsDates = async () => { 
    try {
        const res = await axios.get(BASE_URL + '/Calender/View//onlyDates',{
                    Headers:{
                        "Content-Type":"application/json"
                    },
                },
            )
        return res.data
    } catch (error) {
        console.log("CALENDAR FILE API")
        
    }
}

export const getClientEventsApi = async () => {
      try {
          const res = await axios.get(
            BASE_URL+`/Calender/View`
          );
          return res
      } catch (error) {
          console.log(error)
      }
  }

export const CalendarListViewSave = async (data) => {
  try {
      const res = await axios.post(BASE_URL+
        `/Calender/View/save`,
        {
          Headers: {
            'Content-Type': 'application/json',
          },
        data
        }
      );

  } catch (error) {
      console.log(error,"error")
  }
};

export const savePreWedShootScreen = async (data) => {
  try {
      const res = await axios.post(BASE_URL + 
        `/MyProfile/PreWedShoot/PreWedShootScreen/save`,
        {
          Headers: {
            'Content-Type': 'application/json',
          },
        data:data
        }
      );

  } catch (error) {
      console.log(error,"error")
  }
};

export const getPreWedShootScreen = async () => {
  try {
    const res = await axios.get(BASE_URL + 
      `/MyProfile/PreWedShoot/PreWedShootScreen`,
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