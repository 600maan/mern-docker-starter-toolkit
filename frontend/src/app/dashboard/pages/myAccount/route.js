// import React from "react";
// import {Redirect} from 'react-router-dom';
import routeURL from "config/routeURL";
import MyAccountPage from "./index.jsx";
export default {
	routes: [
		{
			auth: true,
			path: routeURL.cms.account(),
			component: MyAccountPage,
		},
	],
};
