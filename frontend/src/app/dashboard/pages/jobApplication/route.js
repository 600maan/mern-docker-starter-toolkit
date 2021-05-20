// import React from "react";
// import {Redirect} from 'react-router-dom';
import routeURL from "config/routeURL";
import JobsApplication from "./index";
export default {
	routes: [
		{
			auth: true,
			path: routeURL.cms.job_application(),
			component: JobsApplication,
		},
	],
};
