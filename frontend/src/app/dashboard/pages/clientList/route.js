// import React from "react";
// import {Redirect} from 'react-router-dom';
import routeURL from "config/routeURL";
import ClientList from "./index";
export default {
	routes: [
		{
			auth: true,
			path: routeURL.cms.client_list(),
			component: ClientList,
		},
	],
};
