import RSVPPage from "./index";
import RSVPDetailPage from "./detail";
import routeURL from "config/routeURL";

export default {
	routes: [
		{
			auth: false,
			path: routeURL.web.rsvp_product(),
			component: RSVPPage,
		},
		{
			auth: false,
			path: routeURL.web.rsvp_product_detail(),
			component: RSVPDetailPage,
		},
	],
};
