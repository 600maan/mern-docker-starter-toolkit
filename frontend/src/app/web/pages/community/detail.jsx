import {
	Form,
	Input,
	message,
	Result,
	Button,
	Spin,
	Row,
	Col,
	Avatar,
	Tag,
} from "antd";
import api from "app/web/api";
import routeURL from "config/routeURL";
import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext, UserLoginContext } from "context/";
import UnAuthorized from "../../components/Error/UnAuthorized";
import CommentImage from "image/blog/single-gallery-comment-1.jpg";
import Container from "../../components/Container";
import DarkBlueRedButton from "app/web/components/Button/DarkBlueRedButton";
import {
	COMMUNITY_POST_SUCCESS_TITLE,
	COMMUNITY_POST_SUCCESS_SUBTITLE,
} from "config";
import { Link } from "react-router-dom";
import moment from "moment";
import SingleComment from "./SingleComment";
import { AvatarIcon } from "app/dashboard/components";
import EmailConfirmation from "app/web/components/EmailConfirmation";

export default function CommunityDetailPage({ match }) {
	const {
		params: { itemId },
	} = match;
	const [isVisible, setVisible, tab, setTab] = useContext(UserLoginContext);
	const { clientStore, clientDispatch } = useContext(UserContext);
	const isAuth = clientStore.isAuthenticated;
	const [forum, setForum] = useState(null);
	const [replies, setReplies] = useState([]);
	const [fetchingAnswer, setFetchingAnswer] = useState(false);
	const [spinning, setSpinning] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	var formRef = useRef();
	useEffect(() => {
		if (!isAuth) {
			setTab("1");
			setVisible(true);
		}
	}, [isAuth]);

	useEffect(() => {
		if (itemId && isAuth) {
			setSpinning(true);
			setFetchingAnswer(true);
			api.community
				.readThread(itemId)
				.then(({ data }) => setForum(data))
				.catch((error) => {
					if (
						error &&
						error.response &&
						error.response.data &&
						typeof error.response.data.message === "string"
					)
						message.error(error.response.data.message);
				})
				.finally(() => setSpinning(false));
			api.community
				.readReplies(itemId)
				.then(({ data }) => setReplies(data))
				.catch((error) => {
					if (
						error &&
						error.response &&
						error.response.data &&
						typeof error.response.data.message === "string"
					)
						message.error(error.response.data.message);
				})
				.finally(() => setFetchingAnswer(false));
		}
	}, [itemId, isAuth]);

	const fetchReplies = () => {
		setFetchingAnswer(false);
		api.community
			.readReplies(itemId)
			.then(({ data }) => setReplies(data))
			.catch((error) => {
				if (
					error &&
					error.response &&
					error.response.data &&
					typeof error.response.data.message === "string"
				)
					message.error(error.response.data.message);
			})
			.finally(() => setFetchingAnswer(false));
	};
	const onSaveForm = (value) => {
		// client side validation here
		if (true) {
			setSubmitting(true);
			api.community
				.postAnswer({ ...value, threadId: itemId })
				.then((data) => {
					setSubmitted(true);
					fetchReplies();
					message.info(data.message);
				})
				.catch((error) => {
					if (
						error &&
						error.response &&
						error.response.data &&
						typeof error.response.data.message === "string"
					)
						message.error(error.response.data.message);
				})
				.finally(() => setSubmitting(false));
		}
	};

	return isAuth === undefined ? null : isAuth ? (
		<EmailConfirmation>
			<Container
				outerStyle={{
					backgroundColor: "#EFEFEF",
					paddingTop: 100,
				}}
			>
				<div
					id="wrapper-content"
					style={{
						width: "100%",
						paddingTop: 0,
					}}
					className="wrapper-content bg-off-white community-content "
				>
					<div className="page-content justify-content-center offset-1  mb-8 mb-lg-0">
						<div className="community-center-panel card">
							{forum && (
								<SingleComment
									isAdmin={forum.isAdmin}
									linkToNavigate={false}
									userIcon={CommentImage}
									author={forum.QuestionUserName}
									dateTime={moment(forum.createdDateTime).format("MMM DD YYYY")}
									comment={forum.threadQuestion}
									repliesLength={fetchingAnswer ? false : replies.length}
								/>
							)}
							<div id="demo" className=" community-cmt" style={{}}>
								<div className="comments ">
									{submitted ? (
										<Result
											status="success"
											title={COMMUNITY_POST_SUCCESS_TITLE}
											subTitle={COMMUNITY_POST_SUCCESS_SUBTITLE}
											extra={[
												<Link key="home" to={routeURL.web.home()}>
													<Button type="primary">Back Home</Button>
												</Link>,
												<Button onClick={() => setSubmitted(false)}>
													Post Again
												</Button>,
											]}
										/>
									) : (
										<Form
											className="comment-form"
											// wrapperCol={{
											// 	offset: 1,
											// }}
											// {...layout}
											ref={formRef}
											// form={form}
											layout="vertical"
											name="control-ref"
											onFinish={onSaveForm}
											requiredMark={true}
											scrollToFirstError
										>
											<Form.Item
												style={{
													width: "100%",
												}}
												name="threadAnswer"
												rules={[
													{
														required: true,
														message: "Please input your Message",
													},
												]}
											>
												<Input.TextArea
													size="large"
													autoSize={{ minRows: 4 }}
													placeholde="Write Your Comment here..."
												/>
											</Form.Item>
											<Form.Item>
												<DarkBlueRedButton
													htmlType="submit"
													loading={submitting}
												>
													Post
												</DarkBlueRedButton>
											</Form.Item>
										</Form>
									)}

									<Row
										style={{
											marginTop: 10,
										}}
									>
										{fetchingAnswer ? (
											<Row
												style={{ width: "100%", height: 200 }}
												justify="center"
											>
												<Col>
													<Spin
														spinning={fetchingAnswer}
														style={{
															minHeight: 200,
														}}
													/>
												</Col>
											</Row>
										) : (
											replies.map((reply) => {
												return (
													<div
														className="media"
														style={{
															width: "100%",
														}}
													>
														<span className="image d-inline-block mr-4">
															<Avatar
																size={32}
																icon={<AvatarIcon />}
																style={{ marginRight: "15px" }}
															/>
														</span>
														<div className="media-body border-top">
															<ul className="list-inline mb-0">
																<li className="list-inline-item mr-0">
																	<span
																		href="#"
																		className="link-hover-dark-primary font-weight-semibold d-inline-block mr-1"
																	>
																		{reply.answererName}
																	</span>
																</li>
																{reply.isAdmin && (
																	<Tag
																		style={{
																			margin: "0px 5px",
																		}}
																		size="small"
																		color="blue"
																	>
																		Admin
																	</Tag>
																)}
																<li className="list-inline-item mr-0">
																	<span className="font-weight-semibold">
																		-
																	</span>
																</li>
																<li className="list-inline-item">
																	<span className="text-uppercase">
																		commented on{" "}
																		{moment(reply.createdDateTime).format(
																			"MMM DD YYYY"
																		)}
																	</span>
																</li>
															</ul>
															<p>{reply.threadAnswer}</p>
														</div>
													</div>
												);
											})
										)}
									</Row>
								</div>
							</div>
							{/* <a href="#" className="pull-right">
							Load More
						</a> */}
						</div>
					</div>
				</div>
			</Container>
		</EmailConfirmation>
	) : (
		<UnAuthorized />
	);
}
