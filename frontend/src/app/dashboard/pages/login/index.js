import React, { useContext, useState, useEffect } from "react";
import { Layout, Form, Input, Row, Button, message } from "antd";
import { AppContext, LOGOUT_USER, LOGIN_USER } from "context/";

import { JwtService } from "services";

import "./index.css";

import bgImg from "image/background.jpg";
import logoImg from "image/logo.png";
import routeURL from "config/routeURL";

const { Content } = Layout;

const Login = (props) => {
	const { appStore, appDispatch } = useContext(AppContext);
	const [errors, setErrors] = useState(null)
	const [loading, setLoading] = useState(false);
	const [isLogged, setIsLogged] = useState(false);

	useEffect(() => {
		if (appStore.isAuthenticated === undefined) {
			const token = JwtService.getAccessToken();
			if (JwtService.isAuthTokenValid(token)) {
				appDispatch({ type: LOGIN_USER });
				setIsLogged(true);
			}
		}
	}, [appStore.isAuthenticated]);

	useEffect(() => {
		if (isLogged) {
			props.history.push(routeURL.cms.home());
		}
	}, [isLogged]);

	const onSubmitLogin = (values) => {
		setLoading(true);
		JwtService.signInWithEmailAndPassword(values.email, values.password)
			.then((tokenInfo) => {
				setLoading(false);
				setIsLogged(true);
				console.log("tokenInfo", tokenInfo);
				appDispatch({ type: LOGIN_USER });
				props.history.push(routeURL.cms.home());
			})
			.catch((error) => {
				setLoading(false);
				if (error && error.data && error.data.errors) {
					setErrors(error.data.errors);
				}
				// if (!error) return message.error("Cannot connect to server");
				// if (error.status === 502) {
				// 	message.error("Server currently offline!");
				// } else {

				// 	message.error(error.data.msg);
				// }
			});
	};
	const [form] = Form.useForm();

	return (
		<Layout
			style={{
				position: "absolute",
				width: "100%",
				height: "100vh",
				backgroundImage: `url(${bgImg})`,
				backgroundSize: "cover",
			}}
		>
			<Content>
				<div className="login-main">
					<div className="login-header">
						<Row justify="center">
							<img alt="logo" src={logoImg} style={{ marginBottom: "20px" }} />
						</Row>
						<Row justify="center">
							<span
								style={{
									fontSize: "30px",
									fontWeight: "bold",
									marginBottom: 10,
								}}
							>
								Login to your account
							</span>
						</Row>
					</div>

					<Form form={form} onFinish={onSubmitLogin} className="login-form">
						<Form.Item
							name="email"
							label="Email"
							validateStatus={errors && errors.emailOrUsername && "error"}
							help={errors && errors.emailOrUsername}
							rules={[{ required: true, message: "Please input your E-mail!" }]}
						>
							<Input
								placeholder="example@mail.com"
								style={{
									marginBottom: 24,
								}}
							/>
						</Form.Item>

						<Form.Item
							name="password"
							label="Password"
							validateStatus={errors && errors.password && "error"}
							help={errors && errors.password}
							rules={[
								{ required: true, message: "Please input your password!" },
							]}
						>
							<Input
								type="password"
								placeholder="••••••"
								style={{
									marginBottom: 24,
								}}
							/>
						</Form.Item>
						{/* <Form.Item>
              {getFieldDecorator("remember", {
                valuePropName: "checked",
                initialValue: true
              })(<Checkbox>Incorrect email or password</Checkbox>)}
              <a
                className="login-form-forgot"
                href="#"
                style={{ fontWeight: "bold", float: "right" }}
              >
                Forgot password?
              </a>
            </Form.Item> */}
						<Form.Item>
							<Button
								type="primary"
								htmlType="submit"
								loading={loading}
								style={{
									width: "100%",
									height: "42px",
									borderRadius: "10px",
								}}
							>
								Login
							</Button>
						</Form.Item>
						{/* <Form.Item style={{ textAlign: "center", fontWeight: "bold" }}>
              <Row>Do not have an account?</Row>
              <Row style={{ lineHeight: "10px" }}>
                <a href="#">Or create account</a>
              </Row>
            </Form.Item> */}
					</Form>
				</div>
			</Content>
		</Layout>
	);
};

export default Login;
