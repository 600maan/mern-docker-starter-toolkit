import React, { useContext, useEffect, useState } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import routeConfig from "./routeConfig";
import routeURL from "config/routeURL";
import api from "app/dashboard/api";
import { JwtService } from "services";
import { AppContext, LOGOUT_USER, LOGIN_USER, AppProvider } from "context/";
import { Layout } from "antd";
import "./index.css";
import Sidebar from "./sidebar";
import Header from "./header.jsx";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

const { Content } = Layout;

const switchRoutes = (routes) => (
	<>
		<Switch>
			{routes.map(({ auth, path, component }) => (
				<Route exact key={path} path={path} component={component} />
			))}
			{/* <Route
					path="/"
					exact={true}
					component={() => <Redirect to="/home" />}
				/> */}
			<Route component={() => <Redirect to={routeURL.cms.error404()} />} />
		</Switch>
	</>
);

const AuthenticatedLayout = (props) => {
	const [collapsed, setCollapsed] = useState(false);
	const { appStore, appDispatch } = useContext(AppContext);
	// message.config({
	// 	duration: 5,
	// });

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
					JwtService.logout();
					appDispatch({ type: LOGOUT_USER });
					props.history.push(routeURL.cms.login());
				}
			}

			return Promise.reject(err);
		}
	);

	useEffect(() => {
		if (appStore.isAuthenticated === false) {
			console.log("Logout!");
			JwtService.logout();
		} else if (appStore.isAuthenticated === undefined) {
			const token = JwtService.getAccessToken();
			if (JwtService.isAuthTokenValid(token)) {
				appDispatch({ type: LOGIN_USER });
			} else {
				JwtService.logout();
				appDispatch({ type: LOGOUT_USER });
				props.history.push(routeURL.cms.login());
			}
		}
	}, [appStore.isAuthenticated]);
	return (
		<Layout style={{ minHeight: "100vh", backgroundColor: "#F2F4F8" }}>
			<Sidebar {...props} collapsed={collapsed} setCollapsed={setCollapsed} />
			<Layout className="site-layout">
				<Header {...props}>
					{React.createElement(
						collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
						{
							className: "trigger",
							onClick: () => setCollapsed(!collapsed),
						}
					)}
				</Header>

				<Content
					className="site-layout-background"
					style={
						{
							// margin: "24px 16px",
							// padding: 24,
							// minHeight: 280,
						}
					}
				>
					{switchRoutes(routeConfig)}
				</Content>
			</Layout>
		</Layout>
	);
};
const AppLayout = (props) => {
	const { appStore, appDispatch } = useContext(AppContext);

	const isAuth = appStore.isAuthenticated;
	useEffect(() => {
		if (appStore.isAuthenticated === undefined) {
			const token = JwtService.getAccessToken();
			if (JwtService.isAuthTokenValid(token)) {
				appDispatch({ type: LOGIN_USER });
			} else {
				props.history.push(routeURL.cms.login());
			}
		}
	}, [appStore.isAuthenticated]);
	return isAuth === true ? (
		<AuthenticatedLayout {...props} />
	) : isAuth === false ? (
		<Redirect to={routeURL.cms.login()} />
	) : (
		<></>
	);
};

export default (props) => (
	<AppProvider>
		<AppLayout {...props}></AppLayout>
	</AppProvider>
);
