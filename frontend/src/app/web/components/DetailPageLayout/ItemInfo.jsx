import React from "react";
import Icon from "@ant-design/icons";
import { MarkerAlt, PhoneIcon, WebIcon } from "image/icon-svg";
import { getFullWebsite } from "services/util";
export default function ItemInfo({ address, phone, website }) {
	return (
		<div className="card p-4 widget border-0 infomation pt-0 bg-gray-06">
			<div className="card-body px-0 py-2">
				<ul className="list-group list-group-flush">
					<li
						className="list-group-item bg-transparent d-flex text-dark px-0"
						style={{
							alignItems: "center",
						}}
					>
						<span className="item-icon mr-3">
							<Icon
								component={MarkerAlt}
								style={{
									fontSize: 14,
								}}
							/>
						</span>
						<span className="card-text">{address}</span>
					</li>
					<li
						className="list-group-item bg-transparent d-flex text-dark px-0"
						style={{
							alignItems: "center",
						}}
					>
						<span className="item-icon mr-3">
							<Icon
								component={PhoneIcon}
								style={{
									fontSize: 14,
								}}
							/>
						</span>
						<span className="card-text">{phone}</span>
					</li>
					<li
						className="list-group-item bg-transparent d-flex text-dark px-0"
						style={{
							alignItems: "center",
						}}
					>
						<span className="item-icon mr-3">
							<Icon
								component={WebIcon}
								style={{
									fontSize: 14,
								}}
							/>
						</span>
						<span className="card-text">
							<a target="_blank" href={getFullWebsite(website)}>
								{website}
							</a>
						</span>
					</li>
				</ul>
			</div>
		</div>
	);
}
