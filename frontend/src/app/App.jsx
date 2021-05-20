import React, { useEffect, useContext } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// import AppLayout from "./layout";
import AdminLayout from "app/dashboard/layout";
import ClientLayout from "app/web/layout/index";
import routeURL from "config/routeURL";
import LoginPage from "app/dashboard/pages/login";
import "antd/dist/antd.css";
import { JwtService } from "services/jwtService";
import { API_HOST } from "config";
import api from "./dashboard/api";
// import { message } from "antd";
JwtService.isAuthTokenValid(JwtService.getAccessToken());
class App extends React.Component {
	constructor(props) {
		super(props);
	}

	// logging the client side error, catch all the console error and send it to the API
	componentDidMount() {
		//report all user console errors
		window.onerror = function (message, url, lineNumber) {
			var errorMessage =
				"Console error- " + url + " : " + lineNumber + ": " + message;
			api.clientLoggingURL.send(errorMessage).then();
			return true;
		};
	}

	render() {
		return (
			<Router>
				<Switch>
					<Route
						exact
						path={routeURL.cms.error404()}
						component={() => <h1>404 Page Not Found For Admin</h1>}
					/>

					<Route exact path={routeURL.cms.login()} component={LoginPage} />
					<Route path={routeURL.cms.home()} component={AdminLayout} />
					<Route path={routeURL.web.home()} component={ClientLayout} />
				</Switch>
			</Router>
		);
	}
}

export default App;
