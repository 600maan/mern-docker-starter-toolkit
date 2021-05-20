// import React from "react";
// import {Redirect} from 'react-router-dom';
import routeURL from "config/routeURL";
import FoodAndBeverage from "./index";
import ItemAdd from "./ItemAdd";
export default {
	routes: [
		{
			auth: true,
			path: routeURL.cms.food_and_beverage(),
			component: FoodAndBeverage,
		},
		{
			auth: true,
			path: routeURL.cms.food_and_beverage_add(),
			component: ItemAdd,
		},
		{
			auth: true,
			path: routeURL.cms.food_and_beverage_edit(),
			component: ItemAdd,
		},
	],
};
