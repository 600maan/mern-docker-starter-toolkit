import api from "app/web/api";
import CategoryPageLayout from "./RSVPPageLayout";
import config, { RSVP_PRODUCT_PAGE_TITLE } from "config";
import routeURL from "config/routeURL";
import RSVPProductCard from "../common/RSVPProductCard";
import React, { useContext, useEffect } from "react";
import { UserContext, UserLoginContext } from "context/";
import UnAuthorized from "../../components/Error/UnAuthorized";
import EmailConfirmation from "app/web/components/EmailConfirmation";

export default function RSVPProductPage() {
	const [isVisible, setVisible, tab, setTab] = useContext(UserLoginContext);
	const { clientStore, clientDispatch } = useContext(UserContext);
	const isAuth = clientStore.isAuthenticated;

	useEffect(() => {
		if (!isAuth) {
			setTab("1");
			setVisible(true);
		}
	}, [isAuth]);

	return isAuth === undefined ? null : isAuth ? (
		<EmailConfirmation>
			<CategoryPageLayout
				title={RSVP_PRODUCT_PAGE_TITLE}
				apiURL={{
					get: api.rsvp_product.readAll,
				}}
			>
				{(item) => (
					<RSVPProductCard
						discountPercent={item.discountPercent}
						price={item.price}
						title={item.name}
						detailLink={routeURL.web.rsvp_product_detail(item._id)}
						media={config.getImageHost(item.activePhoto)}
						description={item.shortDescription}
						address={item.address}
					/>
				)}
			</CategoryPageLayout>
		</EmailConfirmation>
	) : (
		<UnAuthorized />
	);
}
