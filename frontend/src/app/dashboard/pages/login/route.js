// import React from "react";
// import {Redirect} from 'react-router-dom';
import routeURL from "config/routeURL";
import Login from "./index";
export default {
	routes: [
		{
			exact: true,
			auth: false,
			path: routeURL.cms.login(),
			component: Login,
		},
	],
};
// we don't  include this login to the routeConfig of cms because it doesnot include sidebar,header,footer ( config will always pass through layout )
