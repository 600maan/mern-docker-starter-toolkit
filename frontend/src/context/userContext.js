import React, { useReducer, createContext } from "react";
import { LOGIN_USER_CLIENT, LOGOUT_USER_CLIENT } from "./types";
const UserContext = createContext(null);

const initialState = {
	isAuthenticated: undefined,
};

const clientReducer = (state, action) => {
	switch (action.type) {
		case LOGIN_USER_CLIENT:
			return {
				...state,
				isAuthenticated: true,
			};
		case LOGOUT_USER_CLIENT:
			return {
				...state,
				isAuthenticated: false,
			};
		default:
			throw new Error("Unexpected action");
	}
};

const UserProvider = (props) => {
	const [clientStore, clientDispatch] = useReducer(clientReducer, initialState);
	return (
		<UserContext.Provider value={{ clientStore, clientDispatch }}>
			{props.children}
		</UserContext.Provider>
	);
};

const UserConsumer = UserContext.Consumer;
export { UserContext, UserProvider, UserConsumer };
