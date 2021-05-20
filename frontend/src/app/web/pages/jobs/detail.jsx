import { HistoryOutlined } from "@ant-design/icons";
import { message, Typography, Row, Col, Tag } from "antd";
import api from "app/web/api";
import Container from "app/web/components/Container";
import React, { useEffect, useState, useContext } from "react";
import "../../layout/style.css";
import { Link } from "react-router-dom";
import moment from "moment";
import routeURL from "config/routeURL";
import { UserContext, UserLoginContext } from "context/";
import UnAuthorized from "../../components/Error/UnAuthorized";
import ApplyJobModal from "../../components/ApplyJob";
import config from "config";
import EmailConfirmation from "app/web/components/EmailConfirmation";

const { Title } = Typography;

export default function JobsDetail({ match }) {
	const {
		params: { itemId },
	} = match;
	const [spinning, setSpinning] = useState(false);
	const [itemDetail, setItemDetail] = useState(null);
	const [isVisible, setVisible, tab, setTab] = useContext(UserLoginContext);
	const { clientStore, clientDispatch } = useContext(UserContext);
	const isAuth = clientStore.isAuthenticated;
	const [applyJobVisible, setApplyJobVisible] = useState(false);

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
		window.scrollTo(0, 0);
	}, []);
	useEffect(() => {
		setSpinning(true);
		if (isAuth && itemId) {
			api.jobs
				.read(itemId)
				.then(({ data }) => setItemDetail(data))
				.catch((err) => {
					if (err.response.data) message.error(err.response.data.message);
				})
				.finally(() => setSpinning(false));
		}

		window.scrollTo(0, 0);
	}, [itemId, isAuth]);

	const getRecruitmentInfo = () => {
		let recruitmentInfo = [
			{
				infoTitle: "Job Title",
				info: itemDetail.title,
			},
		];
		if (itemDetail.workingLocation)
			recruitmentInfo.push({
				infoTitle: "Working Location",
				info: itemDetail.workingLocation,
			});
		if (itemDetail.salary)
			recruitmentInfo.push({
				infoTitle: "Salary",
				info: `HK$ ${itemDetail.salary}`,
			});
		if (itemDetail.applicationDeadline)
			recruitmentInfo.push({
				infoTitle: "Application Deadline",
				info: moment(itemDetail.createdDateTime).format("DD-MMM-YYYY"),
			});
		if (itemDetail.benefits)
			recruitmentInfo.push({
				infoTitle: "Benefits",
				info: itemDetail.benefits,
			});
		if (itemDetail.experienceYears)
			recruitmentInfo.push({
				infoTitle: "Years of Experience",
				info: `${itemDetail.experienceYears} years`,
			});
		return (
			<ul
				className="list-group list-group-flush list-group-borderless"
				style={{
					listStyleType: "disc",
				}}
			>
				{recruitmentInfo.map((each) => (
					<li className="list-group-item p-0 bg-transparent mb-1">
						<div className="row pl-5">
							<span className="text-dark font-weight-semibold col-4">
								{`${each.infoTitle}:`}
							</span>
							<span className="col-8">{each.info}</span>
						</div>
					</li>
				))}
			</ul>
		);
	};

	return isAuth === undefined ? null : isAuth ? (
		spinning ? (
			<h1>Loading...</h1>
		) : !itemDetail ? (
			<h1>No Item Found</h1>
		) : (
			<EmailConfirmation>
				<div
					style={{
						padding: "70px 0px",
					}}
					className="content-wrap wrapper-content pb-0 bg-gray-06"
				>
					<ApplyJobModal
						jobId={itemDetail._id}
						isVisible={applyJobVisible}
						setVisible={setApplyJobVisible}
					/>
					<Container>
						<div
							className="page-wrapper m-t-20 bg-white"
							style={{
								padding: "0px 40px",
								borderRadius: 5,
								fontFamily: "work sans, sans-serif",
								fontSize: "1rem",
								fontWeight: 400,
								lineHeight: 1.7,
								color: "#666",
							}}
						>
							<div className="page-title pt-7 pb-2 border-bottom mb-2">
								<ul className="breadcrumb breadcrumb-style-03 mb-5">
									<li className="breadcrumb-item">
										<Link to={routeURL.web.home()}>Home</Link>
									</li>
									<li className="breadcrumb-item">
										<Link to={routeURL.web.jobs()}>Jobs</Link>
									</li>
									<li className="breadcrumb-item">{itemDetail.title}</li>
								</ul>
								<div className="explore-details-top d-flex flex-wrap flex-lg-nowrap bg-white pb-2">
									<div className="store">
										<Row align="middle" gutter={8}>
											<Col>
												<img
													alt={itemDetail.title}
													src={config.getImageHost(itemDetail.logoImage)}
													style={{
														// width: "100%",
														maxHeight: 128,
														objectFit: "cover",
													}}
												/>
											</Col>
											<Col>
												<h2 className="mr-2 mb-2">{itemDetail.title}</h2>
											</Col>
										</Row>
										<ul className="list-inline d-flex flex-wrap store-meta">
											<li
												className="list-inline-item"
												style={{
													display: "flex",
													flexDirection: "row",
													alignItems: "center",
												}}
											>
												<HistoryOutlined />
												<span
													className="d-inline-block ml-2"
													style={{
														fontFamily: "work sans, sans-serif",
														fontSize: "1rem",
														fontWeight: 400,
														lineHeight: 1.7,
														color: "#666",
													}}
												>
													Posted on{" "}
													{moment(itemDetail.createdDateTime).format(
														"DD-MMM-YYYY"
													)}
													{moment(itemDetail.applicationDeadline).isBefore(
														moment()
													) && (
														<Tag
															style={{
																marginLeft: 12,
															}}
															color="red"
														>
															Application Closed
														</Tag>
													)}
												</span>
											</li>
										</ul>
									</div>
								</div>
							</div>
							<div className="row pt-2 pb-8">
								<div className="page-content col-xl-8 mb-9 mb-xl-0">
									<div className="explore-details-container">
										<div className="mb-7">
											<h3
												className="font-size-lg text-uppercase mb-6 lh-12"
												style={{
													fontWeight: 600,
												}}
											>
												Recruitment Information
											</h3>
											<div className="content-listing">
												{getRecruitmentInfo()}
											</div>
										</div>
										{itemDetail.jobDescriptions && (
											<div className="mb-7">
												<h3 className="font-size-lg text-dark text-uppercase text-dark mb-6 lh-12 font-weight-semibold">
													job description
												</h3>
												<div className="content-listing">
													<ul className="list-group list-group-flush list-group-borderless">
														{itemDetail.jobDescriptions.map((each) => (
															<li className="list-group-item p-0 bg-transparent mb-3">
																<div className="ml-5">{each}</div>
															</li>
														))}
													</ul>
												</div>
											</div>
										)}
										<div className="pt-3">
											<button
												disabled={moment(
													itemDetail.applicationDeadline
												).isBefore(moment())}
												onClick={() => setApplyJobVisible(true)}
												style={{
													width: "100%",
												}}
												className="btn btn-primary text-uppercase btn-block font-size-md rounded-0"
											>
												{moment(itemDetail.applicationDeadline).isBefore(
													moment()
												)
													? "Apply Now (Application Closed)"
													: "Apply Now"}
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</Container>
				</div>
			</EmailConfirmation>
		)
	) : (
		<UnAuthorized />
	);
}
