import React, { useState } from "react";
import api from "app/web/api";
import { JwtService } from "services/jwtServiceClient";
import Container from "app/web/components/Container";
import { Row, Col, Result, Button } from "antd";
import DarkBlueRedButton from "../Button/DarkBlueRedButton";
import { notificationError, notificationSuccess } from "../notification";
import routeURL from "config/routeURL";
import { Link } from "react-router-dom";

export default function EmailConfirmation({ access = false, children }) {
	const isEmailVerified = JwtService.isUserEmailVerified();
	const [submitting, setSubmitting] = useState(false);
	const onEmailConfirmationLinkSend = () => {
		if (!isEmailVerified) {
			setSubmitting(true);
			api.auth
				.resendEmailConfirmationLink()
				.then((data) => {
					notificationSuccess(data.message);
				})
				.catch((error) => {
					if (error.response.data) {
						if (typeof error.response.data.message === "string")
							return notificationError(error.response.data.message);
						let errors = error.response.data;
						if (typeof errors === "object")
							Object.keys(errors).map((key) => notificationError(errors[key]));
					}
				})
				.finally(() => setSubmitting(false));
		}
	};
	return isEmailVerified ? (
		children
	) : (
		<div
			style={{
				padding: "70px 0px",
			}}
			className="content-wrap wrapper-content bg-gray-04 pb-0"
		>
			<Container>
				<Row
					justify="space-between"
					align="middle"
					style={{
						marginTop: 20,
						width: "100%",
						backgroundColor: "#ef9a9a",
						padding: 10,
						borderRadius: 5,
					}}
				>
					<Col>Please Confirm Your email address.</Col>
					<Col>
						<Button loading={submitting} onClick={onEmailConfirmationLinkSend}>
							Send Link Again
						</Button>
					</Col>
				</Row>
				{!access && (
					<Row style={{ width: "100%", marginTop: 50 }} justify="center">
						<Result
							status="error"
							title="Please Confirm your Email address."
							subTitle={
								"Sorry! We do not accept unverified email. Please verify your Email address and refresh this page."
							}
							extra={[
								<Link key="home" to={routeURL.web.home()}>
									<Button type="primary">Back Home</Button>
								</Link>,
							]}
						/>
					</Row>
				)}
			</Container>
		</div>
	);
}
