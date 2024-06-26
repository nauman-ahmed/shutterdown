import { createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import Cookies from "js-cookie";

const initialState = { today: [], previous: [] };
const currentUser = JSON.parse(Cookies.get("currentUser"));
const notifications = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    updateNotifications(state, action) {
      return action.payload;
    },
    updateReadNotification(state, action) {
      if (
        dayjs(action.payload.date).format("YYYY-MM-DD") ===
        dayjs().format("YYYY-MM-DD")
      ) {
        const updatedTodayNotifications = state.today?.map((noti) =>
          noti._id === action.payload._id ? action.payload : noti
        );
        return {
          today: updatedTodayNotifications,
          previous: [...state.previous],
        };
      } else {
        const updatedPreviousNotifications = state.previous?.map((noti) =>
          noti._id === action.payload._id ? action.payload : noti
        );
        return {
          today: [...state.today],
          previous: updatedPreviousNotifications,
        };
      }
    },
    addNewNotification(state, action) {
      if (
        dayjs(action.payload.date).format("YYYY-MM-DD") ===
        dayjs().format("YYYY-MM-DD")
      ) {
        if (action.payload.forManager && currentUser.rollSelect === "Manager") {
          return {
            today: [...state.today, action.payload],
            previous: [...state.previous],
          };
        } else if (
          !action.payload.forManager &&
          currentUser._id === action.payload.forUser
        ) {
          return {
            today: [...state.today, action.payload],
            previous: [...state.previous],
          };
        }
      } else {
        if (action.payload.forManager && currentUser.rollSelect === "Manager") {
          return {
            today: [...state.today],
            previous: [...state.previous, action.payload],
          };
        } else if (
          !action.payload.forManager &&
          currentUser._id === action.payload.forUser
        ) {
          return {
            today: [...state.today],
            previous: [...state.previous, action.payload],
          };
        }
      }
    },
  },
});

export const { updateNotifications, updateReadNotification, addNewNotification } =
  notifications.actions;
export default notifications.reducer;
