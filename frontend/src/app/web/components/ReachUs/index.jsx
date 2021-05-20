import "./index.css";
import {
	Button,
	Form,
	Input,
	message,
	Modal,
	Result,
	Typography,
	notification,
} from "antd";
import api from "app/web/api";
import { RSVP_ORDER_SUCCESS_SUBTITLE, RSVP_ORDER_SUCCESS_TITLE } from "config";
import routeURL from "config/routeURL";
import { UserContext } from "context";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import DarkBlueRedButton from "../Button/DarkBlueRedButton";
import { notificationError, notificationSuccess } from "../notification";

const { Title } = Typography;
const ReachUsForm = ({ productId, setVisible, userData }) => {
	var formRef = useRef();
	const [spinning, setSpinning] = useState(false);
	const [submit, setSubmit] = useState(false);
	const onSaveForm = (value) => {
		// client side validation here
		if (true) {
			setSpinning(true);
			api.rsvp_order
				.reach({
					productId: productId,
					...value,
				})
				.then((data) => {
					setSubmit(true);
					formRef.current.setFieldsValue({
						message: "",
					});
					notificationSuccess(data.message);
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
		}
	};

	useEffect(() => {
		if (userData)
			formRef.current.setFieldsValue({
				contact: userData.email,
			});
	}, [userData]);
	return submit ? (
		<Result
			status="success"
			title={RSVP_ORDER_SUCCESS_TITLE}
			subTitle={RSVP_ORDER_SUCCESS_SUBTITLE}
			extra={[
				<Link key="home" to={routeURL.web.home()}>
					<Button type="primary">Back Home</Button>
				</Link>,
				<Button onClick={() => setVisible(false)}>Back to Product</Button>,
			]}
		/>
	) : (
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
			<Form.Item
				label="Your Email/Phone"
				style={{
					width: "100%",
				}}
				name="contact"
				rules={[
					{
						required: true,
						message: "Please input Your Email/Phone",
					},
				]}
			>
				<Input size="large" placeholde="Your Email/Phone" required />
			</Form.Item>

			<Form.Item
				label="Your Message (optional)"
				style={{
					width: "100%",
				}}
				name="message"
				rules={[
					{
						min: 20,
						message: "Too short message!",
					},
				]}
			>
				<Input.TextArea
					size="large"
					autoSize={{ minRows: 3 }}
					placeholde="Message"
				/>
			</Form.Item>

			<DarkBlueRedButton
				style={{
					width: "100%",
				}}
				htmlType="submit"
				loading={spinning}
			>
				Reach Us
			</DarkBlueRedButton>
		</Form>
	);
};

export default function ReachUsModal({ productId, isVisible, setVisible }) {
	const { clientStore, clientDispatch } = useContext(UserContext);
	const isAuth = clientStore.isAuthenticated;
	const [userData, setUserData] = useState(null);
	useEffect(() => {
		if (isAuth) {
			api.auth
				.current()
				.then(({ data }) => setUserData(data))
				.catch((err) => {
					if (err.response.data) notificationError(err.response.data.message);
				});
		} else {
			setVisible(false);
		}
	}, [isAuth]);
	return (
		<Modal
			title={`Hi ${userData && userData.name}`}
			footer={false}
			visible={isVisible}
			onCancel={() => setVisible(false)}
			maskClosable={false}
		>
			<ReachUsForm
				productId={productId}
				setVisible={setVisible}
				userData={userData}
			/>
		</Modal>
	);
}
