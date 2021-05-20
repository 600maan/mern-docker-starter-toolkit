import React from "react";
import { Link } from "react-router-dom";
import "../../layout/style.css";

export default function homepageSlider({
	coverImage,
	categoryLink,
	subTitle,
	title,
}) {
	return (
		<div className="box">
			<div className="card border-0">
				<Link className="hover-scale category-img" to={categoryLink}>
					<img
						src={coverImage}
						alt={title}
						className="image"
						style={{
							height: 450,
							width: 270,
						}}
					/>
				</Link>
				<div className="card-body px-0 pt-4">
					<h5 className="card-title mb-0">
						<Link
							to={categoryLink}
							className="font-size-h5 link-hover-dark-primary"
							style={{ width: "100%" }}
						>
							{title}
						</Link>
					</h5>
					<br />
					<span style={{ width: "100%" }} className="card-text font-size-md">
						{subTitle}
					</span>
				</div>
			</div>
		</div>
	);
}
