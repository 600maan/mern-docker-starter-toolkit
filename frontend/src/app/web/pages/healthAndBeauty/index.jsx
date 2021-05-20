import api from "app/web/api";
import CategoryPageLayout from "app/web/components/CategoryPageLayout";
import routeURL from "config/routeURL";
import React from "react";
import ProductCard from "../common/ProductCard";
import config, { HEALTH_AND_BEAUTY_PAGE_TITLE } from "config";
export default function HealthBeautyPage() {
	return (
		<CategoryPageLayout
			title={HEALTH_AND_BEAUTY_PAGE_TITLE}
			apiURL={{
				get: api.beauty_and_medicals.readAll,
			}}
		>
			{(item) => (
				<ProductCard
					title={item.name}
					detailLink={routeURL.web.health_and_beauty_detail(item._id)}
					media={config.getImageHost(item.activePhoto)}
					description={item.shortDescription}
					address={item.address}
				/>
			)}
		</CategoryPageLayout>
	);
}
