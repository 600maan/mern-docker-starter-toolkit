import React from "react";
import Carousel, { consts } from "react-elastic-carousel";
import { CircleArrowIcon } from "image/icon-svg";
import Food from "image/the_jungle.jpg";
import "./index.css";

let CarouselData = [Food, Food, Food, Food];

const breakPoints = [
	{ width: 1, itemsToShow: 1 },
	{ width: 550, itemsToShow: 2 },
	{ width: 850, itemsToShow: 3 },
	{ width: 1150, itemsToShow: 4 },
	// { width: 1450, itemsToShow: 5, itemsToScroll: 1 },
	// { width: 1750, itemsToShow: 6, itemsToScroll: 1 },
];

const CarouselContainer = ({ isParent }) => {
	return (
		<Carousel
			itemsToShow={1}
			breakPoints={breakPoints}
			renderPagination={() => <></>}
			renderArrow={({ type, onClick, isEdge }) => {
				return (
					<span
						onClick={onClick}
						style={{
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
						}}
					>
						{type === consts.PREV ? (
							<CircleArrowIcon />
						) : (
							<CircleArrowIcon isRight />
						)}
					</span>
				);
			}}
		>
			{CarouselData.map((each, key) => (
				<div className="box">
					<img src={each} alt="Gallery 01" />
				</div>
			))}
		</Carousel>
	);
};

export default function detailPageSlider() {
	return (
		<div className="images-gallery">
			<div className="slick-slider slider-for">
				<CarouselContainer isParent={true} />
			</div>
			{/* <div className="slick-slider slider-nav">
            <CarouselContainer isParent={true} />
          </div> */}
		</div>
	);
}
