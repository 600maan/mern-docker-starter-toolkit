import { Form, Input, message, Result, Button, Tooltip } from "antd";
import api from "app/web/api";
import DarkBlueRedButton from "app/web/components/Button/DarkBlueRedButton";
import { UserContext } from "context";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
	CONTACT_MESSAGE_SUCCESS_TITLE,
	CONTACT_MESSAGE_SUCCESS_SUBTITLE,
	FACEBOOK_LINK,
	INSTA_LINK,
	RSVP_ADDRESS,
	RSVP_EMAIL,
	RSVP_CONTACT,
} from "config/";
import routeURL from "config/routeURL";
import { Link } from "react-router-dom";
import Icon from "@ant-design/icons";
import {
	FacebookIcon,
	InstaIcon,
	AddressMarkerAltIcon,
	PhoneVolumeIcon,
	EmailOpenIcon,
} from "image/icon-svg";

const rowStyle = { width: "100%" };

export default function ContactUs() {
	const { clientStore, clientDispatch } = useContext(UserContext);
	const isAuth = clientStore.isAuthenticated;
	const [spinning, setSpinning] = useState(false);
	const [submit, setSubmit] = useState(false);
	var formRef = useRef();

	const fillForm = (
		contact = undefined,
		name = undefined,
		subject = undefined,
		message = undefined
	) => {
		formRef.current.setFieldsValue({
			contact,
			name,
			subject,
			message,
		});
	};

	const resetForm = (subject = undefined, message = undefined) => {
		formRef.current.setFieldsValue({
			subject,
			message,
		});
	};
	const onSaveForm = (value) => {
		// client side validation here
		if (true) {
			setSpinning(true);
			api
				.saveContactMessage(value)
				.then((data) => {
					setSubmit(true);
					resetForm(); //not passing any parameter resets the form
					message.info(data.message);
				})
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
	};
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	useEffect(() => {
		if (isAuth)
			api.auth
				.current()
				.then(({ data }) => fillForm(data.email, data.name))
				.catch((err) => {
					if (err.response.data) message.error(err.response.data.message);
				})
				.finally(() => setSpinning(false));
	}, [isAuth]);
	return (
		<div
			id="wrapper-content"
			className="wrapper-content pt-0 pb-0"
			style={{
				fontFamily: "work sans, sans-serif",
				lineHeight: 1.7,
			}}
		>
			<section className="contact-icon bg-off-white">
				<div className="container">
					<div className="row justify-content-center">
						<div className="col-md-10">
							<div className="row bg-white shadow">
								<div className="col-md-4 text-center   border-right">
									<div className="icon">
										<Icon
											component={AddressMarkerAltIcon}
											style={{
												fontSize: 55,
												color: "#165477",
												padding: 20,
												fontWeight: 900,
											}}
										/>
									</div>
									<h6>Address</h6>
									<p>{RSVP_ADDRESS}</p>
								</div>
								<div className="col-md-4 text-center  border-right ">
									<div className="icon">
										<Icon
											component={PhoneVolumeIcon}
											style={{
												fontSize: 55,
												color: "#165477",
												padding: 20,
												fontWeight: 900,
											}}
										/>
									</div>
									<h6>Contact</h6>
									<p>
										{" "}
										<a href={`tel://${RSVP_CONTACT}`}>{RSVP_CONTACT} </a>
									</p>
								</div>
								<div className="col-md-4 text-center   ">
									<div className="icon">
										<Icon
											component={EmailOpenIcon}
											style={{
												fontSize: 55,
												color: "#165477",
												padding: 20,
												fontWeight: 900,
											}}
										/>
									</div>
									<h6>Email</h6>
									<p>
										<span>
											<a href={`mailto:${RSVP_EMAIL}`}>{RSVP_EMAIL}</a>
										</span>
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			<section className="ContactForm bg-white ">
				<div className="container">
					<div className="row  ">
						<div className="col-md-6">
							<h2
								className="text-left  m-t-40 m-b-40"
								style={{
									fontWeight: 600,
								}}
							>
								Have be any Question?
							</h2>
							<h6>Contact us and we'll get back to you within 24 hours.</h6>
							<p />
							<div className="social">
								<Tooltip title="Facebook">
									<a href={FACEBOOK_LINK} target="_blank">
										<Icon
											component={FacebookIcon}
											style={{
												color: "gray",
												fontSize: 16,
											}}
										/>
									</a>
								</Tooltip>
								<Tooltip title="Instagram">
									<a href={INSTA_LINK} target="_blank">
										<Icon
											component={InstaIcon}
											style={{
												color: "gray",
												fontSize: 16,
												marginLeft: 16,
											}}
										/>
									</a>
								</Tooltip>
							</div>
						</div>
						<div className="col-md-6 ">
							<div action="#" className="bg-white shadow p-5">
								<h4 className="mini-head text-center">Contact us</h4>
								{submit ? (
									<Result
										status="success"
										title={CONTACT_MESSAGE_SUCCESS_TITLE}
										subTitle={CONTACT_MESSAGE_SUCCESS_SUBTITLE}
										extra={[
											<Link key="home" to={routeURL.web.home()}>
												<Button type="primary">Back Home</Button>
											</Link>,
											<Button onClick={() => setSubmit(false)}>
												Fill Again
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
											label="Full Name"
											style={{
												width: "100%",
											}}
											name="name"
											rules={[
												{
													required: true,
													message: "Please input your name",
												},
											]}
										>
											<Input size="large" placeholde="Your Name" required />
										</Form.Item>

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
											<Input
												size="large"
												placeholde="Your Email/Phone"
												required
											/>
										</Form.Item>

										<Form.Item
											label="Subject"
											style={{
												width: "100%",
											}}
											name="subject"
										>
											<Input size="large" placeholde="Subject" />
										</Form.Item>

										<Form.Item
											label="Your Message"
											style={{
												width: "100%",
											}}
											name="message"
											rules={[
												{
													required: true,
													message: "Please input your Message",
												},
												{
													min: 50,
													message: "Too short message!",
												},
											]}
										>
											<Input.TextArea
												size="large"
												autoSize={{ minRows: 4 }}
												placeholde="Message"
											/>
										</Form.Item>

										<DarkBlueRedButton htmlType="submit" loading={spinning}>
											Send Message
										</DarkBlueRedButton>
									</Form>
								)}
							</div>
						</div>
					</div>
				</div>
			</section>
			<iframe
				src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3687.6405655457834!2d114.02798231495719!3d22.4425504852498!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3403fa0a086b568b%3A0x501f4bcb66e092ce!2sHop%20Yick%20Commercial%20Centre%2C%2033%20Hop%20Choi%20St%2C%20Yuen%20Long%2C%20Hong%20Kong!5e0!3m2!1sen!2snp!4v1600243870598!5m2!1sen!2snp"
				width="100%"
				height={450}
				frameBorder={0}
				style={{ border: 0 }}
				allowFullScreen
				aria-hidden="false"
				tabIndex={0}
			/>
		</div>
	);
}
