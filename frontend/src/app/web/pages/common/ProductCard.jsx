import React from "react";
import { Link } from "react-router-dom";
import { MarkerAlt } from "image/icon-svg";
import Icon from "@ant-design/icons";
import "./index.css";
import { Row, Col } from "antd";

export default function ProductCard({
	media,
	title,
	detailLink,
	description,
	address,
	logoImage,
}) {
	return (
		<div className="store card border-0 rounded-0">
			<div className="position-relative store-image">
				<Link to={detailLink}>
					<img
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
			<div className="card-body pb-6">
				<Row align="middle">
					{logoImage && (
						<Col>
							<img
								alt={title + "_logo"}
								src={logoImage}
								style={{
									height: 64,
								}}
							/>
						</Col>
					)}
					<Col>
						<Link
							to={detailLink}
							className="card-title h5 text-dark d-inline-block mb-2 text-underline-on-hover"
						>
							<span className="letter-spacing-25">{title}</span>
						</Link>
					</Col>
				</Row>
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
			<div className="card-footer rounded-0 border-top-0 pb-3 pt-0 bg-transparent">
				<div
					className="border-top pt-3"
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
					}}
				>
					<span className="d-inline-block mr-1">
						<Icon component={MarkerAlt} />
					</span>
					<Link
						to={detailLink}
						className="text-secondary text-decoration-none address"
					>
						{address}
					</Link>
				</div>
			</div>
		</div>
	);
}
