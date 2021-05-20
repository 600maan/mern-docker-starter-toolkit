import { Button, Col, Form, Input, message, Row } from "antd";
import AddPageLayout from "app/dashboard/components/ListTable/AddPageLayout";
import routeURL from "config/routeURL";
import React, { useEffect, useRef, useState } from "react";
import api from "app/dashboard/api";
import { Link } from "react-router-dom";

const rowStyle = {
	width: "100%",
};

// const imageTitle = "user";
const backUrl = routeURL.cms.user_management();
const pageTitle = "User";
/*
  Things to Change
  1. imageTitle
  
  
  */
export default function UserAdd(props) {
	const {
		match: {
			params: { userId },
		},
	} = props;
	var formRef = useRef();
	const [spinning, setSpinning] = useState(false);
	const [errors, setErrors] = useState(null);
	// const [fileNames, setFileNames] = useState([]);
	// const [activeImage, setActiveImage] = useState(-1);

	const onSaveForm = (value) => {
		// validate here
		if (true) {
			var jsonData = {
				...value,
			};
			if (userId) jsonData._id = userId;
			setSpinning(true);
			api.auth.admin
				.register(jsonData)
				.then((data) => {
					message.info(data.message);
					props.history.push(backUrl);
				})
				.catch((error) => {
					if (error && error.response && error.response.data) {
						let errors = error.response.data;
						Object.keys(errors).map((key) => message.error(errors[key]));
						// message.error(error.data.errors);
						// setErrors(error.data.errors);
					}
				})
				.finally(() => setSpinning(false));
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
				.catch((error) => {
					if (error && error.data && error.data.errors)
						message.error(error.data.errors);
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
						title: userId ? "Update" : "Register",
						url: false,
					},
				]}
				showActions={false}
				backUrl={backUrl}
			>
				{/* <Spin spinning={spinning} wrapperClassName="item-add-spinner"> */}
				<Row
					style={{
						...rowStyle,
						marginTop: 40,
					}}
					justify="center"
				>
					<Col
						xs={24}
						md={24}
						lg={16}
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
							scrollToFirstError
						>
							<Row style={rowStyle} gutter={24}>
								<Col xs={24} lg={12}>
									<Form.Item
										name="username"
										label="Username"
										rules={[
											{
												required: true,
												message: "Username is required",
											},
											{
												validator: (rule, username) => {
													if(!username) return Promise.resolve()
													else if (username.length < 3) return Promise.reject("Username must be 4 character long.");
													const re = /^[a-zA-Z0-9]+$/;
													if (re.test(username)) {
														return Promise.resolve();
													}
													return Promise.reject("Invalid Username");
												},
											},
										]}
									>
										<Input />
									</Form.Item>
								</Col>
								<Col xs={24} lg={12}>
									<Form.Item
										name="name"
										label="Name"
										rules={[
											{
												required: true,
												message: "Please input Full Name",
											},
										]}
									>
										<Input />
									</Form.Item>
								</Col>
							</Row>

							<Row style={rowStyle} gutter={24}>
								<Col xs={24} lg={12}>
									<Form.Item
										name="email"
										label="Email"
										rules={[
											{
												type: "email",
												message: "Invalid email!",
											},
											{
												required: true,
												message: "Please input the email",
											},
										]}
									>
										<Input />
									</Form.Item>
								</Col>

								{!userId && (
									<Col xs={24} lg={12}>
										<Form.Item
											name="password"
											label="Password"
											rules={[
												{
													required: true,
													message: "Please input the valid password",
												},
											]}
										>
											<Input.Password />
										</Form.Item>
									</Col>
								)}
							</Row>

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
											Create
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
