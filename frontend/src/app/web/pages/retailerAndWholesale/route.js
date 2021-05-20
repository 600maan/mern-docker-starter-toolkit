import RetailerWholesalePage from "./index";
import RetailerWholesaleDetailpage from "./detail";
import routeURL from "config/routeURL";

export default {
	routes: [
		{
			auth: false,
			path: routeURL.web.retailer_and_wholesale(),
			component: RetailerWholesalePage,
		},
		{
			auth: false,
			path: routeURL.web.retailer_and_wholesale_detail(),
			component: RetailerWholesaleDetailpage,
		},
	],
};
