import { Col, Row, Steps, Input, Form, Result, Button } from "antd";
import Container from "app/web/components/Container";
import React, { useState, useRef, useContext } from "react";
import "./index.css";
import api from "app/web/api";
import {
	notificationError,
	notificationSuccess,
} from "app/web/components/notification/";
import DarkBlueRedButton from "app/web/components/Button/DarkBlueRedButton";
import { UserLoginContext } from "context";
import { Link } from "react-router-dom";
import routeURL from "config/routeURL";

const rowStyle = { width: "100%" };

export default function ForgetPassword() {
	const [isVisible, setVisible] = useContext(UserLoginContext);
	var emailInputRef = useRef();
	const [spinning, setSpinning] = useState(false);
	const [submitted, setSubmitted] = useState(false);

	const onEmailSubmit = (value) => {
		setSpinning(true);
		api.auth
			.forgetUsername(value.email)
			.then(({ message }) => {
				notificationSuccess(message);
				setSubmitted(true);
			})
			.catch((error) => {
				if (error.response && error.response.data) {
					if (typeof error.response.data.message === "string")
						return notificationError(error.response.data.message);
					let errors = error.response.data;
					Object.keys(errors).map((key) => notificationError(errors[key]));
				}
			})
			.finally(() => setSpinning(false));
	};

	return (
		<div
			style={{
				padding: "70px 0px",
				minHeight: 500,
			}}
			className="content-wrap wrapper-content pb-0"
		>
			<Container>
				<div
					style={{
						marginTop: 20,
					}}
				>
					{submitted ? (
						<Result
							status="success"
							title={"Username Requested successfully"}
							subTitle={"Check your email to access your username."}
							extra={[
								<Link key="home" to={routeURL.web.home()}>
									<Button type="primary">Back Home</Button>
								</Link>,
								<Button onClick={() => setVisible(true)}>Login</Button>,
							]}
						/>
					) : (
						<>
							<Row
								justify="center"
								style={{
									marginTop: 50,
									marginBottom: 50,
									...rowStyle,
								}}
							>
								<Col xs={24} md={10} lg={8}>
									<div
										className="border shadow card bg-white"
										style={{
											padding: "30px 30px 0px 30px",
										}}
									>
										<div className="font-size-lg text-dark mt-2 mb-5">
											Recover Username
										</div>
										<p>
											Enter your Email and we will send your username to your
											email
										</p>

										<div className="form-group mb-2">
											<label htmlFor="username" className="sr-only">
												Email
											</label>
											<Form
												ref={emailInputRef}
												layout="vertical"
												name="control-ref"
												onFinish={onEmailSubmit}
												requiredMark={true}
												scrollToFirstError
												style={{
													paddingTop: 15,
													paddingBottom: 15,
												}}
											>
												<Form.Item
													name="email"
													rules={[
														{
															type: "email",
															message: "Please input valid email",
														},
														{
															required: true,
															message: "Please input your Email!",
														},
													]}
												>
													<Input
														id="email"
														className="form-control"
														placeholder="Email"
													/>
												</Form.Item>
												<Form.Item
													style={{
														marginTop: 8,
													}}
												>
													<DarkBlueRedButton
														loading={spinning}
														className="btn btn-info btn-block  font-size-lg rounded-sm mb-8"
														htmlType="submit"
													>
														Confirm Your Account
													</DarkBlueRedButton>
												</Form.Item>
											</Form>
										</div>
									</div>
								</Col>
							</Row>
						</>
					)}
				</div>
			</Container>
		</div>
	);
}
