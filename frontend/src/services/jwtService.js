import Axios from "axios";
import jwtDecode from "jwt-decode";
import api from "app/dashboard/api";
import config from "config";

let axios = Axios.create({
	baseURL: config.API_HOST,
});
export const JwtService = {
	updateUserData(user) {
		return axios.post("/api/auth/user/update", {
			user: user,
		});
	},

	signInWithEmailAndPassword(email, password) {
		return new Promise((resolve, reject) =>
			api.auth.admin
				.authenticate(email, password)
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

	setSession(access_token) {
		if (access_token) {
			localStorage.setItem("jwt_access_token", access_token);
			api.baseAxios.defaults.headers.common["Authorization"] =
				"Bearer " + access_token;
		} else {
			localStorage.removeItem("jwt_access_token");
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

	getAccessToken() {
		return window.localStorage.getItem("jwt_access_token");
	},
};
