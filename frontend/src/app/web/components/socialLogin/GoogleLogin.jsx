import GoogleLoginButton from "react-google-login";
import React, { useContext } from "react";
import { GoogleIcon } from "image/icon-svg";
import Icon from "@ant-design/icons";
import { JwtService } from "services/jwtServiceClient";
import { LOGIN_USER_CLIENT, UserContext, UserLoginContext } from "context";
import {
	notificationError,
	notificationSuccess,
} from "app/web/components/notification";
export const GoogleLogin = function () {
	const [isVisible, setVisible] = useContext(UserLoginContext);
	const { clientStore, clientDispatch } = useContext(UserContext);

	const responseGoogle = (response) => {
		if (true) {
			JwtService.signInWithGoogle(response.tokenId)
				.then((message) => {
					console.log("message", message);
					notificationSuccess(message);
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
				});
			// .finally(() => setSpinning(false));
		}
	};
	return (
		<GoogleLoginButton
			render={(renderProps) => (
				<span className="auth-login google-login">
					<Icon
						onClick={renderProps.onClick}
						disabled={renderProps.disabled}
						component={GoogleIcon}
						style={{
							verticalAlign: 3,
						}}
					/>
				</span>
			)}
			clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
			buttonText="Login"
			onSuccess={responseGoogle}
			onFailure={responseGoogle}
			cookiePolicy={"single_host_origin"}
		/>
	);
};
