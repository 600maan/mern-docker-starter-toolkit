import { Form, Input, message, Result, Button, Spin, Row, Col } from "antd";
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
import Comment from "./SingleComment";
import EmailConfirmation from "app/web/components/EmailConfirmation";

export default function CommunityPage() {
	const [isVisible, setVisible, tab, setTab] = useContext(UserLoginContext);
	const { clientStore, clientDispatch } = useContext(UserContext);
	const isAuth = clientStore.isAuthenticated;
	const [forums, setForums] = useState([]);
	const [question, setQuestion] = useState("");
	const [spinning, setSpinning] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	var formRef = useRef();
	useEffect(() => {
		if (!isAuth) {
			setTab("1");
			setVisible(true);
		} else if (isAuth) {
			setSpinning(true);
			api.community
				.readAll()
				.then(({ data }) => setForums(data))
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
		}
	}, [isAuth]);

	const fetchForums = () => {
		setSpinning(true);
		api.community
			.readAll()
			.then(({ data }) => setForums(data))
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
	};
	const onSaveForm = (value) => {
		// client side validation here
		if (true) {
			setSubmitting(true);
			api.community
				.postQuestion(value)
				.then((data) => {
					setSubmitted(true);
					fetchForums();
					message.info(data.message);
				})
				.catch((error) => {
					console.log("error s", error);
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
						<div
							className="community-center-panel card"
							style={{
								padding: "10px 20px",
							}}
						>
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
										label="What is your Question?"
										style={{
											width: "100%",
										}}
										name="threadQuestion"
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
											placeholde="Write your question here..."
										/>
									</Form.Item>
									<Form.Item
										style={{
											paddingTop: 15,
										}}
									>
										<DarkBlueRedButton htmlType="submit" loading={submitting}>
											Post
										</DarkBlueRedButton>
									</Form.Item>
								</Form>
							)}
						</div>
						{spinning ? (
							<Row style={{ width: "100%", height: 200 }} justify="center">
								<Col>
									<Spin
										spinning={spinning}
										style={{
											minHeight: 200,
										}}
									/>
								</Col>
							</Row>
						) : (
							forums.map((question) => {
								return (
									<Comment
										isAdmin={question.isAdmin}
										linkToNavigate={routeURL.web.community_detail(question._id)}
										userIcon={CommentImage}
										author={question.QuestionUserName}
										dateTime={moment(question.createdDateTime).format(
											"MMM DD YYYY"
										)}
										comment={question.threadQuestion}
										repliesLength={question.commentsLength}
									/>
								);
							})
						)}
					</div>
				</div>
			</Container>
		</EmailConfirmation>
	) : (
		<UnAuthorized />
	);
}
