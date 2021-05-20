import CommunityPage from "./index";
import CommunityDetailPage from "./detail";
import routeURL from "config/routeURL";

export default {
	routes: [
		{
			auth: false,
			path: routeURL.web.community(),
			component: CommunityPage,
		},
		{
			auth: false,
			path: routeURL.web.community_detail(),
			component: CommunityDetailPage,
		},
	],
};
