// utils/navigation.js
import { useNavigate } from "react-router-dom";

export const useNavigationHelper = () => {
    const navigate = useNavigate();
    return (path) => navigate(path);
};
