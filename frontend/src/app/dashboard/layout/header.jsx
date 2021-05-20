import { Layout } from "antd";
import { Link } from "react-router-dom";
import React, { useContext } from "react";
import { AppContext, LOGOUT_USER } from "context";
import { Profile } from "app/dashboard/components";
import { JwtService } from "services/jwtService";
import { Row, Button, Col } from "antd";
import routeURL from "config/routeURL";
const { Header } = Layout;

const AppHeader = ({ children, ...props }) => {
	const { appDispatch } = useContext(AppContext);

	const onLogout = () => {
		JwtService.logout();
		appDispatch({ type: LOGOUT_USER });
	};

	return (
		<Header
			className="site-layout-background"
			style={{
				backgroundColor: "#fff",
			}}
		>
			{children}

			<div style={{ display: "inline-block", float: "right" }}>
				<Row>
					<Col>
						<Link target="_blank" to={routeURL.web.home()}>
							<Button type="primary" shape="round">
								Open App
							</Button>
						</Link>
					</Col>
					<Col>
						<Profile
							{...props}
							style={{ marginLeft: "30px" }}
							onLogout={onLogout}
						/>
					</Col>
				</Row>
			</div>
		</Header>
	);
};

export default AppHeader;
