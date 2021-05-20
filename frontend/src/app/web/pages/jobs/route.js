import JobPage from "./index";
import JobDetailpage from "./detail";
import routeURL from "config/routeURL";

export default {
	routes: [
		{
			auth: false,
			path: routeURL.web.jobs(),
			component: JobPage,
		},
		{
			auth: false,
			path: routeURL.web.jobs_detail(),
			component: JobDetailpage,
		},
	],
};
