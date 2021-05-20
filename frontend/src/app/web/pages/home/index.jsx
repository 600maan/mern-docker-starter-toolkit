import React, { useEffect, useState } from "react";
import CategoryCard from "../common/categoryCard";
import HomepageSlider from "../common/homepageSlider";
import "./index.css";
import "../../layout/style.css";
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
import { message } from "antd";
import FoodImage from "image/cover/food_and_beverage.jpg";
import beautyAndHealthCoverImage from "image/cover/beauty_and_health.jpg";
import retailerAndWholesaleCoverImage from "image/cover/retailer_and_wholesaler.jpg";
import toursAndTravelCoverImage from "image/cover/tours_and_travels.jpg";
import jobCoverImage from "image/cover/jobs.jpg";
import rvspProductsCoverImage from "image/cover/rsvp_product.jpg";
import Carousel, { consts } from "react-elastic-carousel";
import Container from "app/web/components/Container";
import api from "app/web/api";
import {
	notificationError,
	// notificationSuccess,
} from "app/web/components/notification";

const iconProps = {
	nextIcon: <CircleArrowIcon isRight />,
	prevIcon: <CircleArrowIcon />,
};
let data = [
	{
		key: "food_and_beverage",
		name: "Foods & Beverage",
		categoryIcon: food_and_beverage_icon,
		categoryLink: routeURL.web.food_and_beverage(),
		subTitle: "20 Listing",
		coverImage: FoodImage,
		inExplore: true,
		countKey: "food-beverage",
	},
	{
		key: "health_and_beauty",
		name: "Health & Beauty",
		categoryIcon: health_and_beauty_icon,
		categoryLink: routeURL.web.health_and_beauty(),
		subTitle: "6 Listing",
		coverImage: beautyAndHealthCoverImage,
		inExplore: true,
		countKey: "beauty-health",
	},
	{
		key: "tours_and_travels",
		name: "Tours & Travels",
		categoryIcon: tours_and_travels_icon,
		categoryLink: routeURL.web.tours_and_travels(),
		subTitle: "12 Listing",
		coverImage: toursAndTravelCoverImage,
		inExplore: true,
		countKey: "travel-tour",
	},
	{
		key: "retailer_and_wholesale",
		name: "Retailer & Wholesale",
		categoryIcon: retailer_and_wholasale_icon,
		categoryLink: routeURL.web.retailer_and_wholesale(),
		subTitle: "4 Listing",
		coverImage: retailerAndWholesaleCoverImage,
		inExplore: true,
		countKey: "retail-wholesale",
	},
	{
		key: "rsvp_product",
		name: "RSVP Product",
		categoryIcon: rsvp_product_icon,
		categoryLink: routeURL.web.rsvp_product(),
		subTitle: "20 Listing",
		coverImage: rvspProductsCoverImage,
		inExplore: true,
		countKey: "rsvp-product",
	},
	{
		inExplore: false,
		key: "community",
		name: "Community",
		categoryIcon: community_icon,
		categoryLink: routeURL.web.community(),
		subTitle: "12 Listing",
		coverImage: jobCoverImage,
		countKey: "community-forum",
	},
	{
		key: "jobs",
		name: "Jobs",
		categoryIcon: jobs_icon,
		categoryLink: routeURL.web.jobs(),
		subTitle: "12 Listing",
		coverImage: jobCoverImage,
		inExplore: true,
		countKey: "job-portal",
	},
];

let CarouselData = data.filter((each) => each.inExplore);

const IntroContainer = () => (
	<section id="section-01" className="home-main-intro">
		<div className="home-main-intro-container">
			<Container>
				<div className="heading mb-9">
					<h1 className="mb-7">
						<span className="d-block theme1">Marketplace</span>
						<span className="font-weight-light d-block">
							Small Business
						</span>
					</h1>
				</div>
				<div className="font-size-lg mb-4 theme2">Select the Category</div>
				<div className="list-inline pb-8 flex-wrap my-n2">
					{data.map((each) => (
						<CategoryCard
							name={each.name}
							categoryIcon={each.categoryIcon}
							categoryLink={each.categoryLink}
						/>
					))}
				</div>
			</Container>
		</div>
	</section>
);
const breakPoints = [
	{ width: 1, itemsToShow: 1, itemsToScroll: 1 },
	{ width: 550, itemsToShow: 2, itemsToScroll: 1 },
	{ width: 850, itemsToShow: 3, itemsToScroll: 1 },
	{ width: 1150, itemsToShow: 4, itemsToScroll: 1 },
	// { width: 1450, itemsToShow: 5, itemsToScroll: 1 },
	// { width: 1750, itemsToShow: 6, itemsToScroll: 1 },
];
const CarouselContainer = () => {
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
			.catch((error) => {
				if (error && error.response && error.response.data) {
					if (typeof error.response.data.message === "string")
						return notificationError(error.response.data.message);
					let errors = error.response.data;
					Object.keys(errors).map((key) =>
						notificationError(errors[key], "Login Failed")
					);
				}
			});
	}, []);
	return (
		<Carousel
			itemPadding={[10, 50]}
			itemsToScroll={2}
			itemsToShow={2}
			breakPoints={breakPoints}
			renderPagination={() => <></>}
			renderArrow={({ type, onClick, isEdge }) => {
				return (
					<span
						onClick={isEdge ? () => null : onClick}
						style={{
							cursor: isEdge ? "not-allowed" : "pointer",
							display: "flex",
							alignItems: "center",
						}}
					>
						{type === consts.PREV ? (
							<CircleArrowIcon disabled={isEdge} />
						) : (
							<CircleArrowIcon isRight disabled={isEdge} />
						)}
					</span>
				);
			}}
		>
			{CarouselData.map((each, key) => (
				<HomepageSlider
					coverImage={each.coverImage}
					title={each.name}
					categoryLink={each.categoryLink}
					subTitle={`${countService[each.countKey]} Listing`}
				/>
			))}
		</Carousel>
	);
};
export default function HomePage() {
	return (
		<>
			<div className="content-wrap">
				<IntroContainer />
				<section
					id="section-02"
					className="pb-8 feature-destination pt-4 bg-white"
				>
					<Container>
						<div className="mb-8">
							<h2>
								<span className="theme2 font-header">Explore </span>
								<span className="font-header font-weight-light theme1">
									More
								</span>
							</h2>
						</div>
						<CarouselContainer />
					</Container>
				</section>
			</div>
		</>
	);
}
