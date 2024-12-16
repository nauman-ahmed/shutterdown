import { create } from "zustand";

export const useOpenedMenu = create((set) => ({
  openedMenu: null,
  setOpenedMenu: (menuName) => set({ openedMenu: menuName }),
}));

export const useLoggedInUser = create((set) => ({
  userData :  null,
  updateUserData: (newData) => set({ userData: newData }),
}));
