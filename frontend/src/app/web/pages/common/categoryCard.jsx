import Icon from "@ant-design/icons";
import React from "react";
import { Link } from "react-router-dom";
import "../../layout/style.css";

export default function categoryCard({ categoryLink, categoryIcon, name }) {
	return (
		<div className="list-inline-item py-2 ">
			<Link
				to={categoryLink}
				className="card border-0 icon-box-style-01 link-hover-dark-white"
			>
				<div className="card-body p-0">
					{categoryIcon && (
						<Icon
							component={categoryIcon}
							style={{
								fontSize: 32,
							}}
							className="category-card-icon"
						/>
					)}
					<span className="card-text font-size-md font-weight-semibold mt-2 d-block">
						{name}
					</span>
				</div>
			</Link>
		</div>
	);
}
