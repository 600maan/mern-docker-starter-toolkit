// import React from "react";
// import {Redirect} from 'react-router-dom';
import routeURL from "config/routeURL";
import BeautyAndHealth from "./index";
import ItemAdd from "./ItemAdd";
export default {
	routes: [
		{
			auth: true,
			path: routeURL.cms.beauty_and_medicals(),
			component: BeautyAndHealth,
		},
		{
			auth: true,
			path: routeURL.cms.beauty_and_medicals_add(),
			component: ItemAdd,
		},
		{
			auth: true,
			path: routeURL.cms.beauty_and_medicals_edit(),
			component: ItemAdd,
		},
	],
};
