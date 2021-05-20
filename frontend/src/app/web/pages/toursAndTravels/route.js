import ToursAndTravelPage from "./index";
import ToursAndTravelDetailPage from "./detail";
import routeURL from "config/routeURL";

export default {
	routes: [
		{
			auth: false,
			path: routeURL.web.tours_and_travels(),
			component: ToursAndTravelPage,
		},
		{
			auth: false,
			path: routeURL.web.tours_and_travels_detail(),
			component: ToursAndTravelDetailPage,
		},
	],
};
