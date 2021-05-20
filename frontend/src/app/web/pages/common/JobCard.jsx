import { Row } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import "./index.css";

export default function JobCard({
	media,
	title,
	detailLink,
	workTime,
	companyName,
	workingLocation,
	salary,
}) {
	return (
		<div
			className="box parent-height"
			style={{
				padding: 20,
			}}
		>
			<div className="store bg-white media">
				<Link to={detailLink} className="store-image">
					<img
						alt={title}
						src={media}
						style={{
							// width: "100%",
							maxHeight: 128,
							objectFit: "cover",
						}}
					/>
				</Link>

				<div className="media-body pl-5 pt-0 h-100 d-flex flex-column">
					<div className="mb-4">
						<span className="text-gray">{companyName}</span>
						<Row
							style={{
								marginTop: 8,
							}}
						>
							<Link
								to={detailLink}
								className="card-title h5 text-dark d-inline-block mb-2 text-underline-on-hover"
							>
								<span className="letter-spacing-25">{title}</span>
							</Link>
						</Row>
						<div className="mb-1">
							<span>{workingLocation}</span>
						</div>
						<div className="text-danger">
							<span>
								{workTime === "full_time"
									? `HK$ ${salary} per month`
									: `HK$ ${salary} per hour`}
							</span>
						</div>
					</div>
					<div className="border-top pt-2 mt-auto d-flex align-items-center">
						<span className="text-link">
							{workTime === "full_time" ? "Full Time" : "Part Time"}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
