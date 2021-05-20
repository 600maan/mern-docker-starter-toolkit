import "../../layout/style.css";
import api from "app/web/api";
import React, { useEffect, useState, useContext } from "react";
import Container from "app/web/components/Container";
import { Col, message, Row, Divider, Typography } from "antd";
import ItemInfo from "../../components/DetailPageLayout/ItemInfo";
import GalleryLayout from "../../components/DetailPageLayout/GalleryLayout";
import clsx from "clsx";
import ReachUsModal from "../../components/ReachUs";
import { UserContext, UserLoginContext } from "context/";
import UnAuthorized from "../../components/Error/UnAuthorized";
import config from "config";
import ItemNotFound from "app/web/components/Error/ItemNotFound";
import EmailConfirmation from "app/web/components/EmailConfirmation";

const { Title } = Typography;

export default function RSVPProductDetail({ match }) {
	const {
		params: { itemId },
	} = match;
	const [spinning, setSpinning] = useState(false);
	const [itemDetail, setItemDetail] = useState(null);
	const [reachUsVisible, setReachUsVisible] = useState(false);
	const [isVisible, setVisible, tab, setTab] = useContext(UserLoginContext);
	const { clientStore, clientDispatch } = useContext(UserContext);
	const isAuth = clientStore.isAuthenticated;

	useEffect(() => {
		if (!isAuth) {
			setTab("1");
			setVisible(true);
		}
	}, [isAuth]);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	useEffect(() => {
		setSpinning(true);
		if (isAuth && itemId) {
			api.rsvp_product
				.read(itemId)
				.then(({ data }) => setItemDetail(data))
				.catch((err) => {
					// if (err.response.data) message.error(err.response.data.message);
				})
				.finally(() => setSpinning(false));
		}

		window.scrollTo(0, 0);
	}, [itemId, isAuth]);
	return isAuth === undefined ? null : isAuth ? (
		spinning ? (
			<h1>Loading...</h1>
		) : !itemDetail ? (
			<ItemNotFound />
		) : (
			<EmailConfirmation>
				<div
					style={{
						padding: "70px 0px",
					}}
					className="content-wrap wrapper-content pb-0"
				>
					<ReachUsModal
						productId={itemDetail._id}
						isVisible={reachUsVisible}
						setVisible={setReachUsVisible}
					/>
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
										thumbnailPosition="left"
										showFullscreenButton={false}
										showPlayButton={false}
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
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</Row>
							</Col>
							<Col xs={24} md={10} lg={8}>
								<div className="product-details">
									<div className="font-size-h5 text-dark lh-1625">
										{itemDetail.name}
									</div>
									<div className="mb-6">
										<span
											style={{
												fontFamily: "work sans, sans-serif",
											}}
											className={clsx(
												"font-size-h5",
												itemDetail.discountPercent > 0 && "text-danger"
											)}
										>
											HK${" "}
											{(() => {
												const discountPercent = itemDetail.discountPercent;
												if (discountPercent > 0) {
													let discountAmount =
														itemDetail.discountPercent *
														0.01 *
														itemDetail.price;
													let finalPrice = itemDetail.price - discountAmount;
													return finalPrice.toFixed(2);
												} else return itemDetail.price.toFixed(2);
											})()}
										</span>
										{itemDetail.discountPercent > 0 && (
											<span
												style={{
													fontFamily: "work sans, sans-serif",
													marginLeft: 8,
												}}
												className="font-size-md text-dark text-decoration-line-through"
											>
												{`HK$ ${itemDetail.price} `}
											</span>
										)}
									</div>
									<div
										style={{
											fontFamily: "work sans, sans-serif",
											fontSize: "1rem",
											letterSpacing: "-.015em",
										}}
										className="text-gray mb-8 pb-1"
									>
										{itemDetail.shortDescription}
									</div>
									<button
										onClick={() => setReachUsVisible(true)}
										style={{
											width: "100%",
										}}
										className="btn btn-primary text-uppercase btn-block font-size-md rounded-0"
									>
										Reach Us
									</button>
								</div>
							</Col>
						</Row>
					</Container>
					<Container>
						{/* <Divider /> */}
						{/* <RecentView /> */}
					</Container>
				</div>
			</EmailConfirmation>
		)
	) : (
		<UnAuthorized />
	);
}
