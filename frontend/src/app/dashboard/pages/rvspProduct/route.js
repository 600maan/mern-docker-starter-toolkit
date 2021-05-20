// import React from "react";
// import {Redirect} from 'react-router-dom';
import routeURL from "config/routeURL";
import RSVPProducts from "./index";
import ItemAdd from "./ItemAdd";
export default {
	routes: [
		{
			auth: true,
			path: routeURL.cms.rsvp_product(),
			component: RSVPProducts,
		},
		{
			auth: true,
			path: routeURL.cms.rsvp_product_add(),
			component: ItemAdd,
		},
		{
			auth: true,
			path: routeURL.cms.rsvp_product_edit(),
			component: ItemAdd,
		},
	],
};
