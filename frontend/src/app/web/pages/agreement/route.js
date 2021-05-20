import AgreementPage from "./index";
import PrivacyPolicyPage from "./PrivacyPolicy";
import routeURL from "config/routeURL";

export default {
	routes: [
		{
			auth: false,
			path: routeURL.web.user_agreement(),
			component: AgreementPage,
		},{
			auth: false,
			path: routeURL.web.privacy_policy(),
			component: PrivacyPolicyPage,
		},
		
	],
};
