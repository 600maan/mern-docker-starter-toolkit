import HealthAndBeauty from "./index";
import HealthAndBeautyDetailPage from "./detail";
import routeURL from "config/routeURL";

export default {
	routes: [
		{
			auth: false,
			path: routeURL.web.health_and_beauty(),
			component: HealthAndBeauty,
		},
		{
			auth: false,
			path: routeURL.web.health_and_beauty_detail(),
			component: HealthAndBeautyDetailPage,
		},
	],
};
