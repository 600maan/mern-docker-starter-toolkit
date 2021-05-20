import FoodAndBeverage from "./index";
import FoodAndBeverageDetail from "./detail";
import routeURL from "config/routeURL";

export default {
	routes: [
		{
			auth: false,
			path: routeURL.web.food_and_beverage(),
			component: FoodAndBeverage,
		},
		{
			auth: false,
			path: routeURL.web.food_and_beverage_detail(),
			component: FoodAndBeverageDetail,
		},
	],
};
