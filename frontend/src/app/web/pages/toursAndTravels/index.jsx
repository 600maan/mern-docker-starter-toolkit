import api from "app/web/api";
import CategoryPageLayout from "app/web/components/CategoryPageLayout";
import config, { TOURS_AND_TRAVEL_PAGE_TITLE } from "config";
import routeURL from "config/routeURL";
import React from "react";
import ProductCard from "../common/ProductCard";

export default function ToursAndTravelPage() {
	return (
		<CategoryPageLayout
			title={TOURS_AND_TRAVEL_PAGE_TITLE}
			apiURL={{
				get: api.tours_and_travels.readAll,
			}}
		>
			{(item) => (
				<ProductCard
					title={item.name}
					detailLink={routeURL.web.tours_and_travels_detail(item._id)}
					media={config.getImageHost(item.activePhoto)}
					logoImage={config.getImageHost(item.logoImage)}
					description={item.shortDescription}
					address={item.address}
				/>
			)}
		</CategoryPageLayout>
	);
}
