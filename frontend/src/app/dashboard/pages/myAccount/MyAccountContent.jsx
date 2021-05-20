import { Button, Col, Form, Input, message, Row } from "antd";
import AddPageLayout from "app/dashboard/components/ListTable/AddPageLayout";
import routeURL from "config/routeURL";
import React, { useEffect, useRef, useState } from "react";
import api from "app/dashboard/api";
import { each } from "lodash";
import { Link } from "react-router-dom";

const rowStyle = {
	width: "100%",
};

const backUrl = routeURL.cms.user_management();
const pageTitle = "Profile";
/*
  Things to Change
  1. imageTitle
  
  
  */
export default function ChangePassword(props) {
	const { userId } = props;
	var formRef = useRef();
	var changePasswordFormRef = useRef();
	const [spinning, setSpinning] = useState(false);
	const [spinningTwo, setSpinningTwo] = useState(false);

	const onSaveForm = (value) => {
		console.log("saveForm", value);
		// validate here
		if (true) {
			var jsonData = {
				...value,
			};
			if (userId) jsonData._id = userId;
			setSpinning(true);
			api.auth.admin
				.editUser(jsonData)
				.then((data) => {
					message.info(data.message);
					props.history.push();
				})
				.catch((error) => {
					if (error && error.data && typeof error.data.message === "string")
						message.error(error.data.message);
				})
				.finally(() => setSpinning(false));
		}
	};

	const onUpdatePassword = (value) => {
		if (true) {
			var jsonData = {
				...value,
			};
			if (userId) jsonData._id = userId;
			setSpinningTwo(true);
			api.auth.admin
				.changePassword(jsonData)
				.then((data) => {
					message.info(data.message);
					changePasswordFormRef.current.setFieldsValue({
						oldPassword: "",
						password: "",
						confirmPassword: "",
					});
				})
				.catch((error) => {
					if (error && error.data && typeof error.data.message === "string")
						message.error(error.data.message);
				})
				.finally(() => setSpinningTwo(false));
		}
	};

	const fillForm = (data) => {
		// _id: data._id,
		// gps: data.gps,
		// activePhoto: data.activePhoto,

		formRef.current.setFieldsValue({
			email: data.email,
			flag: data.flag,
			username: data.username,
			name: data.name,
		});
	};

	useEffect(() => {
		if (userId) {
			setSpinning(true);
			api.auth.admin
				.read(userId)
				.then(({ data }) => fillForm(data))
				.catch((err) => {
					console.log("error", err);
					// return console.log("error message", err.response.data);
					// if (err.response.data) message.error(err.response.data.message);
				})
				.finally(() => setSpinning(false));
		}
	}, [userId]);

	return (
		<Row style={{ ...rowStyle, padding: "24px 40px" }}>
			<AddPageLayout
				title={userId ? `Update ${pageTitle}` : `Add ${pageTitle}`}
				breadCrumb={[
					{
						title: "Home",
						url: routeURL.cms.home(),
					},
					{
						title: pageTitle,
						url: backUrl,
					},
					{
						title: userId ? "Update" : "Add",
						url: false,
					},
				]}
				showActions={false}
				backUrl={backUrl}
			>
				{/* <Spin spinning={spinning} wrapperClassName="item-add-spinner"> */}
				<Row
					style={{
						width: "100%",
						marginTop: 30,
					}}
					gutter={16}
					justify="space-between"
				>
					<Col
						xs={24}
						md={8}
						order={2}
						style={{
							backgroundColor: "#fff",
							borderRadius: 8,
							boxShadow: "rgba(0, 0, 0, 0.15) 0px 2px 8px",
							padding: 30,
						}}
					>
						<Form
							// wrapperCol={{
							// 	offset: 1,
							// }}
							// {...layout}
							ref={changePasswordFormRef}
							// form={form}
							layout="vertical"
							name="control-ref"
							onFinish={onUpdatePassword}
							requiredMark={true}
						>
							<Form.Item
								style={{
									width: "100%",
								}}
								name="oldPassword"
								label="Old Password"
								rules={[
									{ required: true, message: "Please input old Password!" },
								]}
							>
								<Input.Password
									style={{
										borderRadius: 5,
									}}
									size="large"
									placeholder="*******"
								/>
							</Form.Item>

							<Form.Item
								style={{
									marginTop: 10,
								}}
								name="password"
								label="New Password"
								hasFeedback
								rules={[
									{
										required: true,
										message: "Please input strong new Password!",
									},
								]}
							>
								<Input.Password
									style={{
										borderRadius: 5,
									}}
									size="large"
									placeholder="*******"
								/>
							</Form.Item>

							<Form.Item
								name="confirmPassword"
								dependencies={["password"]}
								hasFeedback
								label="Confirm Password"
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
									placeholder="*******"
								/>
							</Form.Item>

							<Row
								style={{
									...rowStyle,
									marginTop: 30,
								}}
								gutter={16}
								justify="end"
							>
								<Col>
									<Form.Item>
										<Button
											type="primary"
											htmlType="submit"
											loading={spinningTwo}
										>
											Update
										</Button>
									</Form.Item>
								</Col>
								<Col>
									<Form.Item>
										<Link to={backUrl}>
											<Button>Cancel</Button>
										</Link>
									</Form.Item>
								</Col>
							</Row>
						</Form>
					</Col>

					<Col
						md={15}
						style={{
							backgroundColor: "#fff",
							borderRadius: 8,
							boxShadow: "rgba(0, 0, 0, 0.15) 0px 2px 8px",
							padding: 30,
						}}
					>
						<Form
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
						>
							<Form.Item
								style={rowStyle}
								name="name"
								label="Name"
								rules={[
									{
										required: true,
									},
								]}
							>
								<Input required />
							</Form.Item>

							<Form.Item
								style={rowStyle}
								name="email"
								label="Email"
								rules={[
									{
										required: true,
									},
								]}
							>
								<Input required />
							</Form.Item>

							<Form.Item
								style={rowStyle}
								name="username"
								label="Username"
								rules={[
									{
										required: true,
									},
								]}
							>
								<Input required />
							</Form.Item>

							<Row
								style={{
									...rowStyle,
									marginTop: 30,
								}}
								gutter={16}
								justify="end"
							>
								<Col>
									<Form.Item>
										<Button type="primary" htmlType="submit" loading={spinning}>
											Update
										</Button>
									</Form.Item>
								</Col>
								<Col>
									<Form.Item>
										<Link to={backUrl}>
											<Button>Cancel</Button>
										</Link>
									</Form.Item>
								</Col>
							</Row>
						</Form>
					</Col>
				</Row>
				{/* </Spin> */}
			</AddPageLayout>
		</Row>
	);
}
