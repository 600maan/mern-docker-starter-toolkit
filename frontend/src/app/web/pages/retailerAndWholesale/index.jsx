import api from "app/web/api";
import CategoryPageLayout from "app/web/components/CategoryPageLayout";
import routeURL from "config/routeURL";
import React from "react";
import ProductCard from "../common/ProductCard";
import config, { RETAILER_AND_WHOLESALE_PAGE_TITLE } from "config";

export default function RetailAndWholesalePage() {
	return (
		<CategoryPageLayout
			title={RETAILER_AND_WHOLESALE_PAGE_TITLE}
			apiURL={{
				get: api.retailer_and_wholesale.readAll,
			}}
		>
			{(item) => (
				<ProductCard
					title={item.name}
					detailLink={routeURL.web.retailer_and_wholesale_detail(item._id)}
					media={config.getImageHost(item.activePhoto)}
					description={item.shortDescription}
					address={item.address}
				/>
			)}
		</CategoryPageLayout>
	);
}
