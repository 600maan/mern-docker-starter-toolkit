import { Spin, Input, message, Result, Button, Tooltip } from "antd";
import api from "app/web/api";
import Container from "app/web/components/Container";
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
import { SmileOutlined } from "@ant-design/icons";
import { JwtService } from "services/jwtServiceClient";
import { withRouter } from "react-router-dom";
import queryString from "query-string";
import {
	notificationError,
	notificationSuccess,
} from "app/web/components/notification";

const rowStyle = { width: "100%" };

function ConfirmEmail(props) {
	const { clientStore, clientDispatch } = useContext(UserContext);
	const isAuth = clientStore.isAuthenticated;

	let params = queryString.parse(props.location.search);
	const { token } = params;
	const [spinning, setSpinning] = useState(false);
	const [success, setSuccess] = useState(false);
	const [message, setMessage] = useState("");
	const [error, setError] = useState(false);
	const [refreshToken, setToken] = useState(false);
	useEffect(() => {
		// if client is logged in, refresh the token where token consist isVerifed=true;
		if (isAuth && refreshToken) {
			JwtService.setSession(refreshToken);
		}
	}, [isAuth, refreshToken]);
	useEffect(() => {
		setSpinning(true);
		api.auth
			.validateEmailConfirmationLink(token)
			.then((data) => {
				setSuccess(true);
				setMessage(data.message);
				setToken(data.token);
			})
			.catch((error) => {
				setError(true);
				if (error.response && error.response.data) {
					if (typeof error.response.data.message === "string") {
						setMessage(error.response.data.message);
						return notificationError(error.response.data.message);
					}
					let errors = error.response.data;
					Object.keys(errors).map((key) => notificationError(errors[key]));
				}
			})
			.finally(() => setSpinning(false));
	}, []);
	return (
		<>
			<div
				style={{
					padding: "70px 0px",
				}}
				className="content-wrap wrapper-content bg-gray-04 pb-0"
			>
				<section
					style={{
						paddingTop: "5rem",
					}}
					id="section-03"
				>
					<Container className="mb-8">
						<Result
							icon={success ? <SmileOutlined /> : ""}
							status={error ? "403" : success ? "success" : "info"}
							title={message}
							extra={
								<Link key="home" to={routeURL.web.home()}>
									<Button type="primary">Goto Home</Button>
								</Link>
							}
						/>

						<Spin spinning={spinning} />
					</Container>
				</section>
			</div>
		</>
	);
}

export default withRouter(ConfirmEmail);
