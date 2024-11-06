import React, { useReducer, useContext, createContext, useState } from "react";
import UserReducer from "../reducer/UserReducer"; // Make sure this path is correct

const initialState = {
  user: null,
  dashboardData: {
    defaultPath: "",
    activeBtn: "",
    minNmax: false,
  },
};

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(UserReducer, initialState);

  const updateUserData = (data) => {
    dispatch({ type: "SET_USER", payload: data });
  };
  const logoutUser = () => {
    dispatch({ type: "SET_USER_LOGOUT", payload: null });

    console.log("User logged out"); // Optional: For debugging
  };
  const adminDashBoardData = (data) => {
    dispatch({ type: "SET_ADMIN_DASHBOARD_DATA", payload: data });
  };

  return (
    <UserContext.Provider
      value={{
        ...state,
        updateUserData,
        adminDashBoardData,
        logoutUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};

export { UserContext };
