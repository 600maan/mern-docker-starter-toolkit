import { Layout } from "antd";
import routeURL from "config/routeURL";
import {
	LOGIN_USER_CLIENT,
	LOGOUT_USER_CLIENT,
	UserContext,
	UserLoginContextProvider,
	UserProvider,
} from "context/";
import React, { useContext, useEffect } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { JwtService } from "services/jwtServiceClient";
import AccountModal from "../components/Account/";
import NavigationFooter from "../components/Footer/";
import NavigationHeader from "../components/Header/";
import TopHeader from "../components/Header/topHeader";
import routeConfig from "./routeConfig";
import api from "app/web/api";
import Page404 from "app/web/components/Error/Page404";

import "./style.css";
const switchRoutes = (routes) => (
	<>
		<Switch>
			<Route exact path={routeURL.web.error404()} component={Page404} />
			{routes.map(({ auth, path, component }) => (
				<Route exact key={path} path={path} component={component} />
			))}
			{/* <Route
					path="/"
					exact={true}
					component={() => <Redirect to="/home" />}
				/> */}
			<Route component={() => <Redirect to={routeURL.web.error404()} />} />
		</Switch>
	</>
);

function ClientLayout(props) {
	const { clientStore, clientDispatch } = useContext(UserContext);
	const isAuth = clientStore.isAuthenticated;
	useEffect(() => {
		if (isAuth === undefined) {
			const token = JwtService.getAccessToken();
			if (JwtService.isAuthTokenValid(token)) {
				clientDispatch({ type: LOGIN_USER_CLIENT });
			} else {
				JwtService.logout();
				clientDispatch({ type: LOGOUT_USER_CLIENT });
			}
		}
	}, [isAuth]);

	api.baseAxios.interceptors.request.use(
		(request) => {
			const token = JwtService.getAccessToken();
			if (token) {
				request.headers.Authorization = token;
			} else {
				// console.log(token, "Token error!");
			}
			return request;
		},

		(err) => {
			return Promise.reject(err);
		}
	);

	api.baseAxios.interceptors.response.use(
		(response) => {
			return response;
		},

		(err) => {
			if (err.response && err.response.status) {
				if (err.response.status === 401) {
					console.log("Response error!");
				}
			}

			return Promise.reject(err);
		}
	);
	return (
		<UserLoginContextProvider>
			<Layout id="site-wrapper" class="site-wrapper home-main">
				<TopHeader />
				<NavigationHeader {...props} />
				{!clientStore.isAuthenticated && (
					<AccountModal history={props.history} />
				)}
				{switchRoutes(routeConfig)}
				<div
					style={{
						padding: 0,
					}}
				>
					<NavigationFooter />
				</div>
			</Layout>
		</UserLoginContextProvider>
	);
}

export default (props) => (
	<UserProvider>
		<ClientLayout {...props}></ClientLayout>
	</UserProvider>
);
