import React, { useReducer, createContext } from "react";
import { LOGIN_USER, LOGOUT_USER } from "./types";
const AppContext = createContext(null);

const initialState = {
  isAuthenticated: undefined
};

const appReducer = (state, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        isAuthenticated: true
      };
    case LOGOUT_USER:
      return {
        ...state,
        isAuthenticated: false
      };
    default:
      throw new Error("Unexpected action");
  }
};

const AppProvider = props => {
  const [appStore, appDispatch] = useReducer(appReducer, initialState);
  return (
    <AppContext.Provider value={{ appStore, appDispatch }}>
      {props.children}
    </AppContext.Provider>
  );
};

const AppConsumer = AppContext.Consumer;
export { AppContext, AppProvider, AppConsumer };
