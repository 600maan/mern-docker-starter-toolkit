import React from "react";
import { Link } from "react-router-dom";
import { MarkerAlt } from "image/icon-svg";
import Icon from "@ant-design/icons";
import "./index.css";
import { Row, Col } from "antd";

export default function RSVPProductCard({
	media,
	title,
	detailLink,
	description,
	discountPercent,
	price,
}) {
	return (
		<div className="store card border-0 rounded-0">
			<div className="position-relative store-image">
				<Link to={detailLink}>
					<img
						className="card-img-top rounded-0"
						alt={title}
						src={media}
						style={{
							width: "100%",
							maxHeight: 320,
							objectFit: "cover",
						}}
					/>
				</Link>
			</div>
			<div className="card-body pb-4 ">
				<Link
					to={detailLink}
					className="card-title h5 text-dark d-inline-block mb-2 text-underline-on-hover"
				>
					<span className="letter-spacing-25">{title}</span>
				</Link>
				<ul className="list-inline store-meta  font-size-sm d-flex align-items-center flex-wrap">
					{discountPercent > 0 && (
						<li className="list-inline-item">
							<span className="badge badge-danger d-inline-block mr-1">
								{`${discountPercent}% discount`}
							</span>
						</li>
					)}
					<li className="list-inline-item">
						<span className="mr-1">From</span>
						<span className="text-danger font-weight-semibold">{`HK$ ${price.toFixed(
							2
						)}`}</span>
					</li>
				</ul>
			</div>
			<div className="card-footer rounded-0 border-top-0 pb-3 pt-0 bg-transparent">
				<div className="media">
					<div
						className="media-body lh-14 font-size-sm"
						style={{
							paddingBottom: 10,
							fontFamily: "work sans, sans-serif",
							color: "#666666",
						}}
					>
						{description}
					</div>
				</div>
			</div>
		</div>
	);
}
