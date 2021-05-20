import React, { useRef, useState } from "react";
import { Drawer, Form, Button, Col, Row, Input, Result, Divider } from "antd";
import "./index.css";
import api from "app/dashboard/api";
import {
	notificationError,
	notificationSuccess,
} from "app/web/components/notification";

export default function SendEmail({
	visible = false,
	onClose,
	email,
	isEmailDisabled = false,
	subject,
}) {
	var formRef = useRef();
	const [submit, setSubmit] = useState(false);
	const [spinning, setSpinning] = useState(false);
	const onEmailSend = (value) => {
		if (true) {
			setSpinning(true);
			let data = {
				...value,
			};
			api.email
				.send(data)
				.then((data) => {
					setSubmit(true);
					notificationSuccess(data.message);
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
	return (
		<Drawer
			title="Send Email"
			width={720}
			onClose={onClose}
			visible={visible}
			bodyStyle={{ paddingBottom: 80 }}
			footer={false}
		>
			{submit ? (
				<Result
					status="success"
					title="Email Successfully sent"
					subTitle=""
					extra={[
						<Button
							type="primary"
							onClick={() => {
								setSubmit(false);
								onClose();
							}}
						>
							Okay
						</Button>,
						<Button onClick={() => setSubmit(false)}>Send Again</Button>,
					]}
				/>
			) : (
				<Form
					ref={formRef}
					onFinish={onEmailSend}
					requiredMark={true}
					scrollToFirstError
					name="control-ref"
					layout="vertical"
					hideRequiredMark={false}
				>
					<Row gutter={16}>
						<Col span={24}>
							<Form.Item
								initialValue={email}
								name="email"
								label="Email ID"
								rules={[
									{ required: true, message: "Please enter Receipt's email" },
									{ type: "email", message: "Please enter valid email" },
								]}
							>
								<Input
									disabled={isEmailDisabled}
									placeholder="Receipt's Email ID"
								/>
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item
								initialValue={subject}
								name="subject"
								label="Subject"
								rules={[{ required: true, message: "Please enter Subject" }]}
							>
								<Input
									style={{ width: "100%" }}
									placeholder="Please enter Subject"
								/>
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={16}>
						<Col span={24}>
							<Form.Item
								name="body"
								label="Message Body"
								rules={[
									{
										required: true,
										message: "please input email body",
									},
								]}
							>
								<Input.TextArea
									rows={7}
									placeholder="please input email body"
								/>
							</Form.Item>
						</Col>
					</Row>
					<Divider />
					<Row
						style={{ width: "100%", marginTop: 20 }}
						gutter={16}
						justify="end"
					>
						<div
							style={{
								textAlign: "right",
							}}
						>
							<Button onClick={onClose} style={{ marginRight: 8 }}>
								Discard
							</Button>
							<Button
								htmlType="submit"
								loading={spinning}
								onClick={onEmailSend}
								type="primary"
							>
								Send
							</Button>
						</div>
					</Row>
				</Form>
			)}
		</Drawer>
	);
}
