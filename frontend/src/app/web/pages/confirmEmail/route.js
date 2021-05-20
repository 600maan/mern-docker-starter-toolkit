import ConfirmEmail from "./index";
import routeURL from "config/routeURL";

export default {
	routes: [
		{
			auth: false,
			path: routeURL.web.confirm_email(),
			component: ConfirmEmail,
		},
	],
};
