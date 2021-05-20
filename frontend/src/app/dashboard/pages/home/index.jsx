import React, { useEffect, useState } from "react";
import api from "app/dashboard/api";
import { Row, Col, message } from "antd";
import Icon, { RightCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import {
	food_and_beverage_icon,
	health_and_beauty_icon,
	retailer_and_wholasale_icon,
	tours_and_travels_icon,
	rsvp_product_icon,
	community_icon,
	jobs_icon,
	CircleArrowIcon,
} from "image/icon-svg";
import routeURL from "config/routeURL";

let data = [
	{
		key: "food_and_beverage",
		backgroundColor: "#00c0ef",
		name: "Foods & Beverage",
		categoryIcon: food_and_beverage_icon,
		categoryLink: routeURL.cms.food_and_beverage(),
		countKey: "food-beverage",
	},
	{
		key: "health_and_beauty",
		backgroundColor: "#00a65a",
		name: "Beauty & Medicals",
		categoryIcon: health_and_beauty_icon,
		categoryLink: routeURL.cms.beauty_and_medicals(),
		countKey: "beauty-health",
	},
	{
		key: "tours_and_travels",
		backgroundColor: "#f39c12",
		name: "Tours & Travels",
		categoryIcon: tours_and_travels_icon,
		categoryLink: routeURL.cms.tours_and_travels(),
		countKey: "travel-tour",
	},
	{
		key: "retailer_and_wholesale",
		backgroundColor: "#dd4b39",
		name: "Retailer & Wholesale",
		categoryIcon: retailer_and_wholasale_icon,
		categoryLink: routeURL.cms.retailer_and_wholesale(),
		countKey: "retail-wholesale",
	},
	{
		key: "rsvp_product",
		backgroundColor: "#00a65a",
		name: "RSVP Product",
		categoryIcon: rsvp_product_icon,
		categoryLink: routeURL.cms.rsvp_order(),
		countKey: "rsvp-product",
	},
	{
		inExplore: false,
		key: "community",
		backgroundColor: "#f39c12",
		name: "Community",
		categoryIcon: community_icon,
		categoryLink: routeURL.cms.community(),
		countKey: "community-forum",
	},
	{
		key: "jobs",
		backgroundColor: "#00c0ef",
		name: "Jobs",
		categoryIcon: jobs_icon,
		categoryLink: routeURL.cms.jobs(),
		countKey: "job-portal",
	},
];
export default function Home() {
	const [countService, setCountService] = useState({
		"food-beverage": 0,
		"beauty-health": 0,
		"community-forum": 0,
		"job-portal": 0,
		"retail-wholesale": 0,
		"rsvp-product": 0,
		"travel-tour": 0,
	});

	useEffect(() => {
		api.dashbaord
			.countService()
			.then(({ data }) => setCountService(data))
			.catch((err) => {
				if (err.response.data) message.error(err.response.data.message);
			});
	}, []);

	return (
		<div style={{ width: "100%", padding: "24px 40px" }}>
			<Row
				style={{
					width: "100%",
					// maxWidth: 1200,
				}}
			>
				{data.map((each) => (
					<Col
						xs={12}
						md={8}
						lg={5}
						style={{
							padding: 0,
							borderRadius: 2,
							position: "relative",
							display: "block",
							margin: 10,
							boxShadow: "0 1px 1px rgba(0,0,0,0.1)",
							backgroundColor: each.backgroundColor,
							color: "#fff",
							maxWidth: 300,
						}}
					>
						<div
							style={{
								padding: 10,
								marginBottom: 20,
							}}
						>
							<h3
								style={{
									fontSize: 38,
									fontWeight: "bold",
									margin: "0 0 10px 0",
									whiteSpace: "nowrap",
									padding: 0,
									color: "#fff",
								}}
							>
								{countService[each.countKey]}
							</h3>
							<p>{each.name}</p>
						</div>
						<Icon
							component={each.categoryIcon}
							style={{
								fontSize: 65,
								transition: "all .3s linear",
								position: "absolute",
								top: 10,
								right: 10,
								zIndex: 0,
								// fontSize: 90,
								color: "rgba(0,0,0,0.15)",
							}}
						/>
						<Link
							to={each.categoryLink}
							style={{
								position: "absolute",
								bottom: 0,
								left: 0,
								right: 0,
								transition:
									"color .1s linear 0s,background-color .1s linear 0s!important",
								textAlign: "center",
								padding: "3px 0",
								color: "#fff",
								color: "rgba(255,255,255,0.8)",
								zIndex: 10,
								fontSize: 14,
								background: "rgba(0,0,0,0.1)",
								textDecoration: "none",
							}}
						>
							More info{" "}
							<RightCircleOutlined
								style={{
									marginLeft: 8,
									verticalAlign: 0,
								}}
							/>
						</Link>
					</Col>
				))}
			</Row>
		</div>
	);
}
