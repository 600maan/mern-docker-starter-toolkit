// import React from "react";
// import {Redirect} from 'react-router-dom';
import routeURL from "config/routeURL";
import Jobs from "./index";
import ItemAdd from "./ItemAdd";
export default {
	routes: [
		{
			auth: true,
			path: routeURL.cms.jobs(),
			component: Jobs,
		},
		{
			auth: true,
			path: routeURL.cms.jobs_add(),
			component: ItemAdd,
		},
		{
			auth: true,
			path: routeURL.cms.jobs_edit(),
			component: ItemAdd,
		},
	],
};
