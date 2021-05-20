import { InboxOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Result, Typography, Upload } from "antd";
import api from "app/web/api";
import {
	JOB_APPLICATION_SUCCESS_SUBTITLE,
	JOB_APPLICATION_SUCCESS_TITLE,
} from "config";
import routeURL from "config/routeURL";
import { UserContext } from "context";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import DarkBlueRedButton from "../Button/DarkBlueRedButton";
import { notificationError, notificationSuccess } from "../notification";
import "./index.css";

const { Title } = Typography;

const ApplyJobForm = ({ jobId, setVisible, userData }) => {
	var formRef = useRef();
	const [spinning, setSpinning] = useState(false);
	const [submit, setSubmit] = useState(false);
	const [cvList, setCvList] = useState([]);
	const normFile = (e) => {
		if (Array.isArray(e)) {
			return e;
		} else if (e.fileList && e.fileList.length > 1) return [e.fileList[1]];
		return e && [e.file];
	};

	const onSaveForm = (value) => {
		// client side validation here
		if (cvList.length < 1)
			return notificationError("Please Upload your CV before apply.");
		if (true) {
			setSpinning(true);
			let data = new FormData();
			data.append("file", cvList[0].originFileObj);
			data.append("jobId", jobId);
			data.append("contact", value.contact);
			data.append("message", value.message);
			console.log("formData", data, cvList);
			api.jobs_application
				.apply(data)
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

	useEffect(() => {
		if (userData)
			formRef.current.setFieldsValue({
				contact: userData.email,
			});
	}, [userData]);

	const beforeUpload = (file) => {
		const MAX_CV_SIZE = 5; //in MB
		const isCVFileType = [
			"image/jpeg",
			"image/png",
			"application/pdf",
			"application/msword",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		].includes(file.type);
		if (!isCVFileType) {
			notificationError("Please upload valid file!");
			return false;
		}
		const isImageWithinLimitSize = file.size / 1024 / 1024 < MAX_CV_SIZE;
		if (!isImageWithinLimitSize) {
			notificationError("CV must smaller than " + MAX_CV_SIZE + "MB!");
		}
		return isCVFileType && isImageWithinLimitSize;
	};

	return submit ? (
		<Result
			status="success"
			title={JOB_APPLICATION_SUCCESS_TITLE}
			subTitle={JOB_APPLICATION_SUCCESS_SUBTITLE}
			extra={[
				<Link key="home" to={routeURL.web.home()}>
					<Button type="primary">Back Home</Button>
				</Link>,
				<Button onClick={() => setVisible(false)}>
					Back to Job Description
				</Button>,
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
				<Input size="large" placeholder="Your Email/Phone" required />
			</Form.Item>

			<Form.Item
				label="Your Message"
				style={{
					width: "100%",
				}}
				name="message"
				rules={[
					{
						min: 25,
						message: "Too short message!",
					},
				]}
			>
				<Input.TextArea
					size="large"
					autoSize={{ minRows: 3 }}
					placeholder="eg: Your Expertise area..."
				/>
			</Form.Item>

			<Form.Item label="Your CV">
				<Form.Item
					name="cv"
					valuePropName="file"
					getValueFromEvent={normFile}
					noStyle
				>
					<Upload.Dragger
						beforeUpload={beforeUpload}
						customRequest={({ file, onSuccess, onError }) =>
							setTimeout(() => {
								const MAX_CV_SIZE = 5; //in MB
								const isCVFileType = [
									"image/jpeg",
									"image/png",
									"application/pdf",
									"application/msword",
									"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
								].includes(file.type);
								if (!isCVFileType) {
									onError("Please upload valid file!");
									return false;
								}
								const isImageWithinLimitSize =
									file.size / 1024 / 1024 < MAX_CV_SIZE;
								if (!isImageWithinLimitSize) {
									return onError("CV must smaller than " + MAX_CV_SIZE + "MB!");
								}
								return onSuccess("success");
							}, 100)
						}
						fileList={cvList}
						multiple={false}
						name="file"
						onChange={({ fileList }) => {
							console.log("fileList onCh", fileList);
							if (fileList.length > 1) {
								setCvList([fileList[1]]);
							} else setCvList(fileList);
						}}
					>
						<div>
							<p className="ant-upload-drag-icon">
								<InboxOutlined />
							</p>
							<p className="ant-upload-text">
								Click or drag your CV to this area to upload
							</p>
							{/* <p className="ant-upload-hint">
								Support for a single or bulk upload.
							</p> */}
						</div>
					</Upload.Dragger>
				</Form.Item>
			</Form.Item>

			<DarkBlueRedButton
				style={{
					width: "100%",
				}}
				htmlType="submit"
				loading={spinning}
			>
				Apply Now
			</DarkBlueRedButton>
		</Form>
	);
};

export default function ApplyJobModal({ jobId, isVisible, setVisible }) {
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
			style={{
				top: 10,
			}}
		>
			<ApplyJobForm jobId={jobId} setVisible={setVisible} userData={userData} />
		</Modal>
	);
}
