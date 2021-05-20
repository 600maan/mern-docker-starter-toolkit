// import React from "react";
// import {Redirect} from 'react-router-dom';
import routeURL from "config/routeURL";
import RetailerWholesale from "./index";
import ItemAdd from "./ItemAdd";
export default {
	routes: [
		{
			auth: true,
			path: routeURL.cms.retailer_and_wholesale(),
			component: RetailerWholesale,
		},
		{
			auth: true,
			path: routeURL.cms.retailer_and_wholesale_add(),
			component: ItemAdd,
		},
		{
			auth: true,
			path: routeURL.cms.retailer_and_wholesale_edit(),
			component: ItemAdd,
		},
	],
};
