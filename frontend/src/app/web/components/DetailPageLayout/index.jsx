import { Col, message, Row, Typography } from "antd";
import Container from "app/web/components/Container";
import config from "config";
import React, { useEffect, useState } from "react";
import GalleryLayout from "./GalleryLayout";
import ItemInfo from "./ItemInfo";
import MenuRestuarant from "./MenuRestuarant";
import MapViewer from "app/dashboard/components/MapViewer";

const { Title } = Typography;
export default function DetailPageLayout({ apiURL, match, showMenu = false }) {
	const {
		params: { itemId },
	} = match;
	const [spinning, setSpinning] = useState(false);
	const [itemDetail, setItemDetail] = useState(null);
	useEffect(() => {
		setSpinning(true);
		if (itemId) {
			apiURL
				.get(itemId)
				.then(({ data }) => setItemDetail(data))
				.catch((err) => {
					if (err.response.data) message.error(err.response.data.message);
				})
				.finally(() => setSpinning(false));
		}

		window.scrollTo(0, 0);
	}, [itemId]);
	let mapLink = "";
	if (itemDetail) {
		mapLink =
			"https://maps.google.com/maps?q=10.305385,77.923029&hl=es;z=14&amp;output=embed";
	}
	return spinning ? (
		<h1>Loading...</h1>
	) : !itemDetail ? (
		<h1>No Item Found</h1>
	) : (
		<div
			style={{
				padding: "100px 0px",
			}}
			className="content-wrap wrapper-content pb-0"
		>
			<Container>
				<Row align="middle">
					<Col>
						{itemDetail.logoImage && (
							<Col>
								<img
									alt={itemDetail.name + "_logo"}
									src={config.getImageHost(itemDetail.logoImage)}
									style={{
										height: 64,
									}}
								/>
							</Col>
						)}
					</Col>
					<Col>
						<Title
							level={1}
							style={{
								fontFamily: "work sans, sans-serif",
								fontSize: "2.25rem",
								marginBottom: ".625rem",
							}}
						>
							{itemDetail.name}
						</Title>
					</Col>
				</Row>
				<Title
					level={5}
					className="text-link  align-items-center"
					style={{
						fontFamily: "work sans sans-serif",
						padding: 0,
						marginBottom: "1rem",
						marginTop: 0,
						fontSize: 16,
						textTransform: "capitalize",
						fontWeight: 400,
						marginTop: 0,
						letterSpacing: 1,
					}}
				>
					{itemDetail.category}
				</Title>
			</Container>
			<Container>
				<Row
					justify="space-between"
					style={{
						marginTop: "1.5rem",
					}}
					gutter={[32, 32]}
				>
					<Col xs={24} md={13} lg={15}>
						{itemDetail.photos ? (
							<GalleryLayout
								imageURLs={itemDetail.photos.map((photo) => ({
									original: config.getImageHost(photo),
									thumbnail: config.getImageHost(photo),
								}))}
							/>
						) : (
							<h1>No Images to show</h1>
						)}
						<Row>
							<div className="collapse-tabs mt-7">
								<div className="tabs bg-gray-06 px-4 py-2 mb-6 d-none d-sm-block">
									<ul className="nav nav-pills tab-style-01" role="tablist">
										<li className="nav-item">
											<span
												className="nav-link active"
												id="description-tab"
												data-toggle="tab"
												role="tab"
												aria-controls="description"
												aria-selected="true"
											>
												Description
											</span>
										</li>
									</ul>
								</div>
								<div className="tab-content">
									<div id="collapse-tabs-accordion">
										<div
											className="tab-pane fade show active"
											id="description"
											role="tabpanel"
											aria-labelledby="description-tab"
										>
											<div className="card bg-transparent mb-4 mb-sm-0">
												<div
													className="card-header d-block d-sm-none bg-transparent px-0 py-1"
													id="headingDescription"
												>
													<h5 className="mb-0">
														<button
															className="btn text-uppercase btn-block"
															data-toggle="collapse"
															data-target="#description-collapse"
															aria-expanded="true"
															aria-controls="description-collapse"
														>
															Description
														</button>
													</h5>
												</div>
												<div
													id="description-collapse"
													className="collapse show collapsible"
													aria-labelledby="headingDescription"
													data-parent="#collapse-tabs-accordion"
												>
													<div className="card-body p-sm-0 border-sm-0">
														<div className="mb-6">
															<h6 className="d-block font-size-md mb-4">
																Introduce
															</h6>
															<p
																className="mb-1"
																style={{
																	fontFamily: "work sans, sans-serif",
																	fontSize: "1rem",
																	fontWeight: 400,
																	lineHeight: 1.7,
																	color: "#666",
																	textAlign: "left",
																	backgroundColor: "#fff",
																	letterSpacing: "-.015em",
																}}
															>
																{itemDetail.description}
															</p>
														</div>
														{showMenu && (
															<MenuRestuarant
																menuImage={itemDetail.menuImage}
															/>
														)}
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</Row>
					</Col>
					{itemDetail.gps && (
						<Col xs={24} md={10} lg={8}>
							<div className="widget map mb-6 position-relative mb-6 rounded-0">
								<div
									style={{
										height: 500,
										marginBottom: 10,
									}}
								>
									<MapViewer
										activeMarker={{
											...itemDetail.gps,
											name: itemDetail.name,
										}}
										height={400}
										options={{
											zoom: 13,
											disableDefaultUI: true,
										}}
									/>
								</div>
								{/* <div className="button-direction position-absolute">
									<a
										href={`https://maps.google.com/maps?q=${itemDetail.gps.latitude},${itemDetail.gps.longitude}&hl=es&z=14&amp;output=embed`}
										target="_blank"
										className="btn btn-sm btn-icon-left"
									>
										<i className="fas fa-location-arrow" />
										Get Direction
									</a>
								</div> */}
								<ItemInfo
									address={itemDetail.address}
									phone={itemDetail.phoneNumber}
									website={itemDetail.website}
								/>
							</div>
						</Col>
					)}
				</Row>
			</Container>
			<Container>
				{/* <Divider /> */}
				{/* <RecentView /> */}
			</Container>
		</div>
	);
}
