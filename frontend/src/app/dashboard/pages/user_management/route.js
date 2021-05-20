// import React from "react";
// import {Redirect} from 'react-router-dom';
import routeURL from "config/routeURL";
import UserList from "./index";
import UserAdd from "./UserAdd";
export default {
	routes: [
		{
			auth: true,
			path: routeURL.cms.user_management(),
			component: UserList,
		},
		{
			auth: true,
			path: routeURL.cms.user_management_add(),
			component: UserAdd,
		},
		{
			auth: true,
			path: routeURL.cms.user_management_edit(),
			component: UserAdd,
		},
	],
};
