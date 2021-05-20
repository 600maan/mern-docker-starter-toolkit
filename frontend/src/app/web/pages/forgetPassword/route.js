import ForgetPassword from "./index";
import routeURL from "config/routeURL";

export default {
	routes: [
		{
			auth: false,
			path: routeURL.web.forget_password(),
			component: ForgetPassword,
		},
	],
};
