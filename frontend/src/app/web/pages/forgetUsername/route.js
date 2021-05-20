import ForgetUsername from "./index";
import routeURL from "config/routeURL";

export default {
	routes: [
		{
			auth: false,
			path: routeURL.web.forget_username(),
			component: ForgetUsername,
		},
	],
};
