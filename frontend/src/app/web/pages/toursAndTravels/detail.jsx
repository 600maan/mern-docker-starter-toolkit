import React, { useEffect } from "react";
import DetailPageSlider from "../common/detailPageSlider";
import DetailPageSidebar from "../common/detailPageSidebar";
import DetailPageLayout from "../../components/DetailPageLayout/";
import "../../layout/style.css";
import api from "app/web/api";

export default function ToursAndTravelDetail(props) {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	return (
		<DetailPageLayout
			{...props}
			apiURL={{
				get: api.tours_and_travels.read, //api that fetch the list of items,
			}}
		/>
	);
}
