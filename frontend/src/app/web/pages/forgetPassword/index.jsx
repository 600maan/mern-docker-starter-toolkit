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
	var pinInputRef = useRef();
	var passwordInputRef = useRef();

	const [currentStep, setCurrentStep] = useState(0);
	const [spinning, setSpinning] = useState(false);
	const [account, setAccount] = useState("");
	const [token, setToken] = useState(null);
	const [submitted, setSubmitted] = useState(false);

	const onEmailOrUsernameSubmit = (value) => {
		sendPIN(value.emailOrUsername, true);
	};

	const sendPIN = (account, step) => {
		if (true) {
			setSpinning(true);
			api.auth
				.forgetPassword(account)
				.then(({ message, account }) => {
					setAccount(account);
					notificationSuccess(message);
					if (step) setCurrentStep(1);
				})
				.catch((error) => {
					if (error && error.response && error.response.data) {
						if (typeof error.response.data.message === "string")
							return notificationError(error.response.data.message);
						let errors = error.response.data;
						Object.keys(errors).map((key) => notificationError(errors[key]));
					}
				})
				.finally(() => setSpinning(false));
		}
	};

	const onPINSubmit = (value) => {
		if (account) {
			setSpinning(true);
			api.auth
				.validatePIN(account, value.pin)
				.then(({ token, message }) => {
					notificationSuccess(message);
					setToken(token);
					setCurrentStep(2);
				})
				.catch((error) => {
					if (error.response.data) {
						if (typeof error.response.data.message === "string")
							return notificationError(error.response.data.message);
						let errors = error.response.data;
						Object.keys(errors).map((key) => notificationError(errors[key]));
					}
				})
				.finally(() => setSpinning(false));
		} else {
			notificationError("Please complete First step");
		}
	};

	const onResetPassword = (value) => {
		if (token) {
			setSpinning(true);
			api.auth
				.resetPassword(value.password, token)
				.then(({ message }) => {
					notificationSuccess(message);
					setSubmitted(true);
				})
				.catch((error) => {
					if (error.response.data) {
						if (typeof error.response.data.message === "string")
							return notificationError(error.response.data.message);
						let errors = error.response.data;
						Object.keys(errors).map((key) => notificationError(errors[key]));
					}
				})
				.finally(() => setSpinning(false));
		} else {
			notificationError("Please complete Second step");
		}
	};

	const getEmailInputUI = () => {
		return (
			<Row style={rowStyle} justify="center">
				<Col xs={24} md={10} lg={8}>
					<div
						className="border shadow card bg-white"
						style={{
							padding: "30px 30px 0px 30px",
						}}
					>
						<div className="font-size-lg text-dark mt-2 mb-5">
							Recover Password
						</div>
						<p>
							Enter your Email or username and Confirmation PIN will be sent to
							your email!
						</p>

						<div className="form-group mb-2">
							<label htmlFor="username" className="sr-only">
								Email/Username
							</label>
							<Form
								ref={emailInputRef}
								layout="vertical"
								name="control-ref"
								onFinish={onEmailOrUsernameSubmit}
								requiredMark={true}
								scrollToFirstError
								style={{
									paddingTop: 15,
									paddingBottom: 15,
								}}
							>
								<Form.Item
									name="emailOrUsername"
									rules={[
										{
											required: true,
											message: "Please input your Email or Username!",
										},
									]}
								>
									<Input
										id="username"
										className="form-control"
										placeholder="Email or username"
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
		);
	};

	const getPINInputUI = () => {
		return (
			<Row style={rowStyle} justify="center">
				<Col xs={24} md={10} lg={8}>
					<div
						className="border shadow card bg-white"
						style={{
							padding: "30px 30px 0px 30px",
						}}
					>
						<div className="font-size-lg text-dark mt-2 mb-5">Enter Code.</div>
						<p>Enter the code send to your email.!</p>

						<div className="form-group mb-2">
							<label htmlFor="username" className="sr-only">
								Code
							</label>
							<Form
								ref={pinInputRef}
								layout="vertical"
								name="control-ref"
								onFinish={onPINSubmit}
								requiredMark={true}
								scrollToFirstError
								style={{
									paddingTop: 15,
									paddingBottom: 15,
								}}
							>
								<Form.Item
									name="pin"
									rules={[
										{
											required: true,
											message: "PIN is required",
										},
										{
											len: 5,
											message: "Code must be 5 digit long",
										},
									]}
								>
									<Input
										id="PIN"
										className="form-control"
										placeholder="5 Digit Code"
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
										Validate PIN
									</DarkBlueRedButton>
								</Form.Item>
								<p>
									If you do not receive code,
									<span
										onClick={() => sendPIN(account, false)}
										type="button"
										className="font-size-md rounded-sm mb-8 ml-4"
									>
										Resend Now
									</span>
								</p>
							</Form>
						</div>
					</div>
				</Col>
			</Row>
		);
	};

	const getResetPasswordUI = () => {
		return (
			<Row style={rowStyle} justify="center">
				<Col xs={24} md={10} lg={8}>
					<div
						className="border shadow card bg-white"
						style={{
							padding: "30px 30px 0px 30px",
						}}
					>
						<div className="font-size-lg text-dark mt-2 mb-5">
							Change Password
						</div>
						<p>
							Its good idea to use a strong password that you are not using
							elsewhere
						</p>

						<div className="form-group mb-2">
							<label htmlFor="username" className="sr-only">
								password
							</label>
							<Form
								ref={passwordInputRef}
								layout="vertical"
								name="control-ref"
								onFinish={onResetPassword}
								requiredMark={true}
								scrollToFirstError
								style={{
									paddingTop: 15,
									paddingBottom: 15,
								}}
							>
								<Form.Item
									name="password"
									rules={[
										{
											required: true,
											message: "Please input your password",
										},
									]}
								>
									<Input.Password
										id="username"
										className="form-control"
										placeholder="Password"
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
										Change Password
									</DarkBlueRedButton>
								</Form.Item>
							</Form>
						</div>
					</div>
				</Col>
			</Row>
		);
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
							title={"Password changed successfully"}
							subTitle={"Please use new password to login into the system."}
							extra={[
								<Link key="home" to={routeURL.web.home()}>
									<Button type="primary">Back Home</Button>
								</Link>,
								<Button onClick={() => setVisible(true)}>Login</Button>,
							]}
						/>
					) : (
						<>
							<Row justify="center">
								<Col
									xs={24}
									md={20}
									lg={16}
									style={{
										maxWidth: 800,
									}}
								>
									<Steps current={currentStep} onChange={setCurrentStep}>
										<Steps.Step
											title="Email/Username"
											description="Email or username of your account"
										/>
										<Steps.Step
											title="Validation PIN"
											description="Check Email and confirm that It's you!"
										/>
										<Steps.Step
											title="Reset Password"
											description="Set a new password"
										/>
									</Steps>
								</Col>
							</Row>
							<Row
								style={{
									marginTop: 50,
									marginBottom: 50,
									...rowStyle,
								}}
							>
								{currentStep === 0 && getEmailInputUI()}
								{currentStep === 1 && getPINInputUI()}
								{currentStep === 2 && getResetPasswordUI()}
							</Row>
						</>
					)}
				</div>
			</Container>
		</div>
	);
}
