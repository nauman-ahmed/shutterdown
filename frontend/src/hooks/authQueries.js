import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import BASE_URL from "../API";
import { SignInWithGoogleDataAPI, SignUpAPI, verifyEmail } from "../API/userApi";

// Define a function to fetch user data
export const fetchUser = async (token) => {
  
  if (!token) {
    throw new Error("No token found");
  }

  try {
    const response = await axios.get(BASE_URL + "/user/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return { user: response.data };
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Unauthorized");
    }
    throw new Error("Failed to fetch user data");
  }
};



export const signIn = async (data) => {
  console.log('called');
  
  const response = await axios.post(
    BASE_URL + "/sign-in",
    {
      email: data.email,
      password: data.password,
      remember : data.remember
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data

};

export const useSignInQuery = () => {
  return useMutation({
    mutationFn: signIn,
  });
};

export const useSignUpQuery = () => {
  return useMutation({
    mutationFn: SignUpAPI,
  });
};

export const useSignUpGoogleQuery = () => {
  return useMutation({
    mutationFn: SignInWithGoogleDataAPI,
  });
};

export const useForgotPasswordQuery = () => {
  return useMutation({
    mutationFn: verifyEmail,
  });
};
