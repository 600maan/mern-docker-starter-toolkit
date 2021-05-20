import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Checkbox, Col, Form, Input, Modal, Row, Tabs } from "antd";
import routeURL from "config/routeURL";
import { LOGIN_USER_CLIENT, UserContext, UserLoginContext } from "context";
import React, { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { JwtService } from "services/jwtServiceClient";
import DarkBlueRedButton from "../Button/DarkBlueRedButton";
import { notificationError, notificationSuccess } from "../notification";
import { FacebookLogin, GoogleLogin } from "../socialLogin/";
import "./index.css";

const { TabPane } = Tabs;

const LoginForm = ({ history }) => {
	const [isVisible, setVisible] = useContext(UserLoginContext);
	const { clientStore, clientDispatch } = useContext(UserContext);

	var loginRef = useRef();
	const [spinning, setSpinning] = useState(false);
	const onSaveForm = (value) => {
		// client side validation here
		if (true) {
			setSpinning(true);
			JwtService.signInWithEmailAndPassword(value)
				.then((tokenInfo) => {
					notificationSuccess("Logged in successfully!");
					clientDispatch({ type: LOGIN_USER_CLIENT });
					setVisible(false);
				})
				.catch((error) => {
					if (error && error.data) {
						if (typeof error.data.message === "string")
							return notificationError(error.data.message);
						let errors = error.data;
						Object.keys(errors).map((key) =>
							notificationError(errors[key], "Login Failed")
						);
					}
				})
				.finally(() => setSpinning(false));
		}
	};

	return (
		<Form
			ref={loginRef}
			layout="vertical"
			name="control-ref"
			onFinish={onSaveForm}
			requiredMark={true}
			scrollToFirstError
			style={{
				paddingTop: 15,
				paddingBottom: 15,
			}}
		>
			{" "}
			<Form.Item
				name="emailOrUsername"
				rules={[
					{ required: true, message: "Please input your Email or Username!" },
				]}
			>
				<Input
					style={{
						borderRadius: 5,
					}}
					size="large"
					prefix={<UserOutlined className="site-form-item-icon" />}
					placeholder="Email/Username"
				/>
			</Form.Item>
			<Form.Item
				style={{
					marginTop: 10,
				}}
				name="password"
				rules={[{ required: true, message: "Please input your Password!" }]}
			>
				<Input.Password
					style={{
						borderRadius: 5,
					}}
					size="large"
					prefix={<LockOutlined className="site-form-item-icon" />}
					placeholder="Password"
				/>
			</Form.Item>
			<Form.Item
				style={{
					marginTop: 10,
				}}
			>
				<Form.Item name="remember" valuePropName="checked" noStyle>
					<Link
						to={routeURL.web.forget_username()}
						onClick={() => {
							setVisible(false);
							// history.push(routeURL.web.forget_password());
						}}
					>
						Forgot Username
					</Link>
				</Form.Item>

				<Link
					to={routeURL.web.forget_password()}
					className="login-form-forgot"
					onClick={() => {
						setVisible(false);
						// history.push(routeURL.web.forget_password());
					}}
				>
					Forgot password
				</Link>
			</Form.Item>
			<Form.Item>
				<DarkBlueRedButton
					loading={spinning}
					className="login-form-button"
					htmlType="submit"
				>
					Log in
				</DarkBlueRedButton>
			</Form.Item>
		</Form>
	);
};

const RegisterForm = () => {
	const [isVisible, setVisible] = useContext(UserLoginContext);
	const { clientStore, clientDispatch } = useContext(UserContext);

	var registerRef = useRef();
	const [spinning, setSpinning] = useState(false);
	const [errors, setErrors] = useState(null);
	const onSaveForm = (value) => {
		// client side validation here
		if (true) {
			setSpinning(true);
			JwtService.registerWithEmailAndPassword(value)
				.then((tokenInfo) => {
					notificationSuccess("Logged in successfully!");
					clientDispatch({ type: LOGIN_USER_CLIENT });
					setVisible(false);
				})
				.catch((error) => {
					if (error && error.data) {
						if (typeof error.data.message === "string")
							return notificationError(error.data.message);
						let errors = error.data;
						Object.keys(errors).map((key) =>
							notificationError(errors[key], "Registration Failed")
						);
					}
				})
				.finally(() => setSpinning(false));
		}
	};
	return (
		<Form
			// wrapperCol={{
			// 	offset: 1,
			// }}
			// {...layout}
			ref={registerRef}
			// form={form}
			layout="vertical"
			name="control-ref"
			onFinish={onSaveForm}
			requiredMark={true}
			style={{
				paddingTop: 15,
				paddingBottom: 15,
			}}
			scrollToFirstError
		>
			{" "}
			<Form.Item
				name="name"
				rules={[{ required: true, message: "Please input your full name!" }]}
			>
				<Input
					style={{
						borderRadius: 5,
					}}
					size="large"
					placeholder="Full Name"
				/>
			</Form.Item>
			<Form.Item
				name="username"
				rules={[{ required: true, message: "Please input your username!" },{
					validator: (rule, username) => {
						if(!username) return Promise.resolve()
						else if (username.length < 3) return Promise.reject("Username must be 4 character long.");
						const re = /^[a-zA-Z0-9]+$/;
						if (re.test(username)) {
							return Promise.resolve();
						}
						return Promise.reject("Invalid Username");
					},
				},]}
			>
				<Input
					style={{
						borderRadius: 5,
					}}
					size="large"
					placeholder="Username"
				/>
			</Form.Item>
			<Form.Item
				name="email"
				rules={[
					{ type: "email", message: "Invalid email!" },
					{ required: true, message: "Please input your email!" },
				]}
			>
				<Input
					style={{
						borderRadius: 5,
					}}
					size="large"
					placeholder="Email"
				/>
			</Form.Item>
			<Form.Item
				style={{
					marginTop: 10,
				}}
				name="password"
				hasFeedback
				rules={[{ required: true, message: "Please input your Password!" }]}
			>
				<Input.Password
					style={{
						borderRadius: 5,
					}}
					size="large"
					placeholder="Strong Password"
				/>
			</Form.Item>
			<Form.Item
				name="confirm"
				dependencies={["password"]}
				hasFeedback
				rules={[
					{
						required: true,
						message: "Please confirm your password!",
					},
					({ getFieldValue }) => ({
						validator(rule, value) {
							if (!value || getFieldValue("password") === value) {
								return Promise.resolve();
							}
							return Promise.reject(
								"The two passwords that you entered do not match!"
							);
						},
					}),
				]}
			>
				<Input.Password
					style={{
						borderRadius: 5,
					}}
					size="large"
					placeholder="Confirm Password"
				/>
			</Form.Item>
			<Form.Item
				style={{
					marginTop: 10,
				}}
				name="agreement"
				valuePropName="checked"
				rules={[
					{
						validator: (_, value) =>
							value
								? Promise.resolve()
								: Promise.reject("Should accept agreement"),
					},
				]}
				wrapperCol={{
					xs: {
						span: 24,
						offset: 0,
					},
					sm: {
						span: 16,
						offset: 8,
					},
				}}
			>
				<Checkbox>
					I have read the <Link onClick={()=>setVisible(false)} to={routeURL.web.user_agreement()}>agreement</Link>
				</Checkbox>
			</Form.Item>
			<Form.Item>
				<DarkBlueRedButton
					loading={spinning}
					className="login-form-button"
					htmlType="submit"
				>
					Register
				</DarkBlueRedButton>
			</Form.Item>
		</Form>
	);
};
export default function Account({ history }) {
	const [isVisible, setVisible, tab, setTab] = useContext(UserLoginContext);

	return (
		<Modal
			title={null}
			footer={false}
			visible={isVisible}
			// onOk={this.handleOk}
			onCancel={() => {
				setTab("1");
				setVisible(false);
			}}
			style={{ top: 20 }}
		>
			<Tabs onChange={setTab} activeKey={tab || "1"} centered>
				<TabPane tab={<h3 className="theme1">Log In</h3>} key="1">
					<LoginForm history={history} />
				</TabPane>
				<TabPane tab={<h3 className="theme2">Register</h3>} key="2">
					<RegisterForm history={history} />
				</TabPane>
			</Tabs>
			<div className="tab-content">
				<div className="social-icon origin-color si-square">
					<div className="font-size-md text-dark "> Log In With</div>
					<Row
						gutter={16}
						style={{
							width: "100%",
							marginTop: 20,
						}}
					>
						<Col>
							<FacebookLogin />
						</Col>
						<Col>
							<GoogleLogin />
						</Col>
					</Row>
				</div>
			</div>
		</Modal>
	);
}
