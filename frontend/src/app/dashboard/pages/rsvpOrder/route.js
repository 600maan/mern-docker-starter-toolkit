// import React from "react";
// import {Redirect} from 'react-router-dom';
import routeURL from "config/routeURL";
import RSVPOrder from "./index";
export default {
	routes: [
		{
			auth: true,
			path: routeURL.cms.rsvp_order(),
			component: RSVPOrder,
		},
		
	],
};
