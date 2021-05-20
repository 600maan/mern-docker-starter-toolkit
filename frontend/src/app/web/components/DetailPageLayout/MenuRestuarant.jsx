import React from "react";
import { Row } from "antd";
import SingleImageViewer from "../ImageViewer";
export default function MenuRestuarant({ menuImage }) {
	return menuImage && menuImage.length > 0 ? (
		<div className="mb-6">
			<h6 className="d-block font-size-md mb-4">Menu’s Restaurant</h6>
			{menuImage.map((each) => (
				<Row
					style={{
						padding: 16,
					}}
				>
					<SingleImageViewer url={each} />
					{/* <img src={config.getImageHost(each)} alt="Thai menu" /> */}
				</Row>
			))}
		</div>
	) : null;
}
