import Axios from "axios";
import jwtDecode from "jwt-decode";
import api from "app/web/api";
import config from "config";

let axios = Axios.create({
	baseURL: config.API_HOST,
});
export const JwtService = {
	registerWithEmailAndPassword(user) {
		return new Promise((resolve, reject) =>
			api.auth
				.register(user)
				.then((response) => {
					let { token } = response.data;
					if (token) {
						this.setSession(response.data.token);
						resolve(response.data.token);
					} else {
						reject(response.data.error);
					}
				})
				.catch((error) => {
					reject(error.response);
				})
		);
	},

	signInWithEmailAndPassword(user) {
		return new Promise((resolve, reject) =>
			api.auth
				.authenticate(user)
				.then((response) => {
					let { token } = response.data;
					if (token) {
						this.setSession(response.data.token);
						resolve(response.data.token);
					} else {
						reject(response.data.error);
					}
				})
				.catch((error) => {
					reject(error.response);
				})
		);
	},
	signInWithGoogle(tokenId) {
		return new Promise((resolve, reject) =>
			api.auth
				.googleLogin(tokenId)
				.then((response) => {
					let { token, message } = response.data;
					if (token) {
						this.setSession(token);
						resolve(message);
					} else {
						reject(response.data.error);
					}
				})
				.catch((error) => {
					reject(error.response);
				})
		);
	},
	signInWithFacebook(accessToken, userId) {
		return new Promise((resolve, reject) =>
			api.auth
				.facebookLogin(accessToken, userId)
				.then((response) => {
					let { token, message } = response.data;
					if (token) {
						this.setSession(token);
						resolve(message);
					} else {
						reject(response.data.error);
					}
				})
				.catch((error) => {
					reject(error.response);
				})
		);
	},

	setSession(access_token) {
		if (access_token) {
			localStorage.setItem("jwt_access_token_client", access_token);
			api.baseAxios.defaults.headers.common["Authorization"] = access_token;
		} else {
			localStorage.removeItem("jwt_access_token_client");
			delete api.baseAxios.defaults.headers.common["Authorization"];
		}
	},

	logout() {
		this.setSession(null);
	},

	isAuthTokenValid(access_token) {
		if (!access_token) {
			return false;
		}
		const decoded = jwtDecode(access_token);
		const currentTime = Date.now() / 1000;
		if (decoded.exp < currentTime) {
			console.warn("access token expired");
			return false;
		} else {
			return true;
		}
	},
	isUserEmailVerified() {
		const access_token = this.getAccessToken();
		if (!access_token) {
			return false;
		}
		const decoded = jwtDecode(access_token);
		if (decoded.isVerified) {
			return true;
		} else {
			return false;
		}
	},

	getAccessToken() {
		return window.localStorage.getItem("jwt_access_token_client");
	},
};
