import { atom } from 'jotai';


const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'Decemeber']

// Create an atom with an initial value
export const clientFilterMonth = atom(months[new Date().getMonth()]);
export const clientFilterYear = atom(new Date().getFullYear());
export const clientFilterDate = atom(null);
