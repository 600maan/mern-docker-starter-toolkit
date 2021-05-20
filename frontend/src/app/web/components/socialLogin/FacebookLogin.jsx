import FacebookLoginButton from "react-facebook-login/dist/facebook-login-render-props";
import React, { useContext } from "react";
import { FacebookIcon } from "image/icon-svg";
import Icon from "@ant-design/icons";
import { JwtService } from "services/jwtServiceClient";
import { LOGIN_USER_CLIENT, UserContext, UserLoginContext } from "context";
import {
	notificationError,
	notificationSuccess,
} from "app/web/components/notification";
export const FacebookLogin = function () {
	const [isVisible, setVisible] = useContext(UserLoginContext);
	const { clientStore, clientDispatch } = useContext(UserContext);

	const responseFacebook = (response) => {
		if (true) {
			JwtService.signInWithFacebook(response.accessToken, response.userID)
				.then((message) => {
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
			return false;
		}
	};
	return (
		<FacebookLoginButton
			render={(renderProps) => (
				<span className="auth-login facebook-login">
					<Icon
						onClick={renderProps.onClick}
						disabled={renderProps.disabled}
						component={FacebookIcon}
						style={{
							verticalAlign: 3,
						}}
					/>
				</span>
			)}
			appId={process.env.REACT_APP_FACEBOOK_APP_ID}
			autoLoad={false}
			fields="name,email,picture"
			callback={responseFacebook}
			isMobile={false}
		/>
	);
};
