import api from "app/web/api";
import React, { useEffect } from "react";
import DetailPageLayout from "../../components/DetailPageLayout/";
import "../../layout/style.css";

export default function FoodBeverageDetail(props) {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	return (
		<DetailPageLayout
			{...props}
			apiURL={{
				get: api.food_and_beverage.read, //api that fetch the list of items,
			}}
			showMenu={true}
		/>
	);
}
