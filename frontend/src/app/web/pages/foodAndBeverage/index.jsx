import api from "app/web/api";
import CategoryPageLayout from "app/web/components/CategoryPageLayout";
import routeURL from "config/routeURL";
import React from "react";
import ProductCard from "../common/ProductCard";
import config, { FOOD_AND_BEVERAGE_PAGE_TITLE } from "config";
export default function FoodBeverage() {
	return (
		<CategoryPageLayout
			title={FOOD_AND_BEVERAGE_PAGE_TITLE}
			apiURL={{
				get: api.food_and_beverage.readAll,
			}}
		>
			{(item) => (
				<ProductCard
					title={item.name}
					detailLink={routeURL.web.food_and_beverage_detail(item._id)}
					media={config.getImageHost(item.activePhoto)}
					description={item.shortDescription}
					address={item.address}
				/>
			)}
		</CategoryPageLayout>
	);
}
