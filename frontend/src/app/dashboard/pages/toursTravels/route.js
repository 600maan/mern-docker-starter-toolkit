// import React from "react";
// import {Redirect} from 'react-router-dom';
import routeURL from "config/routeURL";
import ToursTravel from "./index";
import ItemAdd from "./ItemAdd";
export default {
	routes: [
		{
			auth: true,
			path: routeURL.cms.tours_and_travels(),
			component: ToursTravel,
		},
		{
			auth: true,
			path: routeURL.cms.tours_and_travels_add(),
			component: ItemAdd,
		},
		{
			auth: true,
			path: routeURL.cms.tours_and_travels_edit(),
			component: ItemAdd,
		},
	],
};
