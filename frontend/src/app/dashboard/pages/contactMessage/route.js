// import React from "react";
// import {Redirect} from 'react-router-dom';
import routeURL from "config/routeURL";
import ContactMessage from "./index";
export default {
	routes: [
		{
			auth: true,
			path: routeURL.cms.contact_message(),
			component: ContactMessage,
		},
	],
};
