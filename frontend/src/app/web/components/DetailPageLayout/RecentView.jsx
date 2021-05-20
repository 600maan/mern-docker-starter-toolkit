import React from "react";
import Image1 from "image/foods/ashoka.jpg";
import Image2 from "image/foods/jun-food.jpg";
import Image3 from "image/foods/thejungles.png";
import routeURL from "config/routeURL";
import { MarkerAlt } from "image/icon-svg";
import Icon from "@ant-design/icons";

import Container from "app/web/components/Container";
import { Row } from "antd";

const recentitems = [
	{
		media: Image1,
		title: "Blue ocean restaurant & bar",
		address: "Ocean Building, 1st floor, 80 Shanghai St, Yau Ma Tei",
		url: routeURL.web.home(),
	},

	{
		media: Image2,
		title: "Ashoka Indian Restaurnt",
		address: "G/F Rear Block, Hoi Fu Building, 240 Shau Kei Wan Road",
		url: routeURL.web.home(),
	},
	{
		media: Image3,
		title: "17 fenwick",
		address: "No. 17 Fenwick St, Wan Chai",
		url: routeURL.web.home(),
	},
];

function RecentItem({ image, title, address }) {
	return (
		<div
			className="col-lg-4 mb-4 mb-lg-0"
			style={{
				padding: "10px 30px 10px 0px",
			}}
		>
			<div className="store media align-items-stretch bg-white">
				<div className="store-image position-relative">
					<a href="images/foods/ashoka.jpg">
						<img src={Image1} alt="Recent view 1" />
					</a>
				</div>
				<div className="media-body pl-0 pl-sm-3 pt-4 pt-sm-0">
					<a
						href="../../listing-details-full-image.html"
						className="font-size-md font-weight-semibold text-dark d-inline-block mb-2 lh-11"
					>
						<span className="letter-spacing-25">
							Blue ocean restaurant &amp; bar
						</span>{" "}
					</a>
					<div>
						<span className="d-inline-block mr-1">
							<Icon component={MarkerAlt} />
						</span>
						<a href="#" className="text-secondary text-decoration-none address">
							Ocean Building, 1st floor, 80 Shanghai St, Yau Ma Tei
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function RecentView() {
	return (
		<div className="recent-view  bg-white pb-10">
			<Row>
				<div className="mb-6">
					<h5 className="mb-0">Recently Viewed</h5>
				</div>
			</Row>
			<Row>
				{recentitems.map((item) => (
					<RecentItem
						image={item.media}
						title={item.title}
						address={item.address}
						url={item.url}
					/>
				))}
			</Row>
		</div>
	);
}
