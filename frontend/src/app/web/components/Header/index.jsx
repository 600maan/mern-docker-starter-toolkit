import { Col, Row } from "antd";
import routeURL from "config/routeURL";
import { LOGOUT_USER_CLIENT, UserContext, UserLoginContext } from "context/";
import LogoImage from "image/logo.png";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { JwtService } from "services/jwtServiceClient";
import DarkBlueRedButton from "../Button/DarkBlueRedButton";
import Container from "../Container";
import useBreakPoints from "services/Breakpoint";
import clsx from "clsx";
import "./index.css";

const UserAccount = () => {
	const { clientStore, clientDispatch } = useContext(UserContext);
	const isAuth = clientStore.isAuthenticated;
	const [isVisible, setVisible, tab, setTab] = useContext(UserLoginContext);

	const onLogout = () => {
		JwtService.logout();
		clientDispatch({ type: LOGOUT_USER_CLIENT });
	};

	return isAuth ? (
		<Row gutter={8}>
			<Col>
				<DarkBlueRedButton onClick={onLogout}>Logout</DarkBlueRedButton>
			</Col>
		</Row>
	) : (
		<Row gutter={8}>
			<Col>
				<DarkBlueRedButton
					onClick={() => {
						setTab("1");
						setVisible(true);
					}}
				>
					Login
				</DarkBlueRedButton>
			</Col>
			<Col>
				<DarkBlueRedButton
					onClick={() => {
						setTab("2");
						setVisible(true);
					}}
				>
					Register
				</DarkBlueRedButton>
			</Col>
		</Row>
	);
};
const HeaderHome = () => {
	console.log("screen", window.screen.width, window.screen.availWidth);
	return (
		<header
			id="header"
			className="main-header header-sticky header-sticky-smart header-style-01 header-float text-uppercase"
		>
			<div
				className="header-light header-wrapper sticky-area"
				style={{
					backgroundColor: "#fff",
				}}
			>
				<Container>
					<nav className="navbar navbar-expand-xl">
						<Row
							style={{
								width: "100%",
								paddingTop: 10,
								paddingBottom: 10,
							}}
							justify="space-between"
							align="middle"
						>
							<Col>
								<Link to={routeURL.web.home()}>
									<img src={LogoImage} alt={"RVSPHK LOGO"} />
								</Link>
							</Col>

							<Col>
								<UserAccount />
							</Col>
						</Row>
					</nav>
				</Container>
			</div>
		</header>
	);
};

const menuList = [
	{
		menu: "Home",
		url: routeURL.web.home(),
	},
	{
		menu: "Food",
		url: routeURL.web.food_and_beverage(),
	},
	{
		menu: "Beauty",
		url: routeURL.web.health_and_beauty(),
	},
	{
		menu: "Tours",
		url: routeURL.web.tours_and_travels(),
	},
	{
		menu: "Retailer",
		url: routeURL.web.retailer_and_wholesale(),
	},
	{
		menu: "RSVP Products",
		url: routeURL.web.rsvp_product(),
		auth: true,
	},
	{
		menu: "Community",
		url: routeURL.web.community(),
		auth: true,
	},
	{
		menu: "Jobs",
		url: routeURL.web.jobs(),
		auth: true,
	},
];

const DefaultHeader = (props) => {
	const path = props.location.pathname; //pathname from the url

	useEffect(() => {
		setIsMobileNavOpen(false);
	}, [path]);
	const { clientStore, clientDispatch } = useContext(UserContext);
	const isAuth = clientStore.isAuthenticated;
	const [isVisible, setVisible, tab, setTab] = useContext(UserLoginContext);
	const point = useBreakPoints();
	const prepareMenu = (auth, menu, url) => {
		const link = (
			<Link
				style={{
					textDecoration: "none",
					color: "#000",
					textTransform: "uppercase",
					fontSize: "1rem",
					fontWeight: 600,
					fontStyle: "normal",
					letterSpacing: ".05em",
				}}
				onClick={() => {
					if (isMobileNavOpen) setIsMobileNavOpen(false);
				}}
				to={url}
			>
				<span className="header-menu">{menu}</span>
			</Link>
		);
		return link;
		// if we had to bypass going to the page, uncomment below and comments up code
		// if (!auth || isAuth) return link;

		// return (
		// 	<Link
		// 		style={{
		// 			textDecoration: "none",
		// 			color: "#000",
		// 			textTransform: "uppercase",
		// 			fontSize: "1rem",
		// 			fontWeight: 600,
		// 			fontStyle: "normal",
		// 			letterSpacing: ".05em",
		// 		}}
		// 		onClick={() => setVisible(true)}
		// 	>
		// 		<span className="header-menu">{menu}</span>
		// 	</Link>
		// );
	};

	const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

	const onLogout = () => {
		if (isMobileNavOpen) setIsMobileNavOpen(false);
		JwtService.logout();
		clientDispatch({ type: LOGOUT_USER_CLIENT });
	};
	let onScroll = (event) => {
		const pageYOffset = window.pageYOffset;
		if (isMobileNavOpen && pageYOffset > 100) {
			setIsMobileNavOpen(false);
		}
	};
	useEffect(() => {
		if (window) {
			window.addEventListener("scroll", onScroll, true);
		}
		return () => {
			window.removeEventListener("scroll", onScroll);
		};
	}, [isMobileNavOpen]);
	return (
		<header
			id="header"
			className="main-header header-sticky header-sticky-smart header-style-01 header-float text-uppercase"
		>
			<div
				className="header-light header-wrapper sticky-area"
				style={{
					backgroundColor: "#fff",
				}}
			>
				<Container>
					{["sm", "md", "xs"].includes(point) ? (
						<nav className="navbar navbar-expand-xl">
							<Row
								style={{
									width: "100%",
									paddingTop: 10,
									paddingBottom: 10,
								}}
								justify="space-between"
								align="middle"
							>
								<Col>
									<Link to={routeURL.web.home()}>
										<img src={LogoImage} alt={"RVSPHK LOGO"} />
									</Link>
								</Col>
								<Col
									style={{
										paddingTop: 15,
										paddingBottom: 15,
									}}
								>
									<div
										onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
										className={clsx(
											"navbar-toggler toggle-icon",
											isMobileNavOpen && "collapsed in"
										)}
										data-toggle="collapse"
										data-target="#navbar-main-menu"
									>
										<span />
									</div>
								</Col>
							</Row>
							{isMobileNavOpen && (
								<Row
									gutter={16}
									align="middle"
									style={{
										paddingLeft: 8,
									}}
								>
									{menuList.map(({ auth, menu, url }) => (
										<Row
											style={{
												width: "100%",
												marginTop: 4,
											}}
										>
											{prepareMenu(auth, menu, url)}
										</Row>
									))}
									{isAuth ? (
										<Row
											style={{
												textDecoration: "none",
												color: "#000",
												textTransform: "uppercase",
												fontSize: "1rem",
												fontWeight: 600,
												fontStyle: "normal",
												letterSpacing: ".05em",
												width: "100%",
												marginTop: 4,
											}}
											onClick={onLogout}
										>
											<span className="header-menu">Logout</span>
										</Row>
									) : (
										<>
											<Row
												style={{
													textDecoration: "none",
													color: "#000",
													textTransform: "uppercase",
													fontSize: "1rem",
													fontWeight: 600,
													fontStyle: "normal",
													letterSpacing: ".05em",
													width: "100%",
													marginTop: 4,
												}}
												onClick={() => {
													if (isMobileNavOpen) setIsMobileNavOpen(false);
													setTab("1");
													setVisible(true);
												}}
											>
												<span className="header-menu">Login</span>
											</Row>
											<Row
												style={{
													textDecoration: "none",
													color: "#000",
													textTransform: "uppercase",
													fontSize: "1rem",
													fontWeight: 600,
													fontStyle: "normal",
													letterSpacing: ".05em",
													width: "100%",
													marginTop: 4,
												}}
												onClick={() => {
													if (isMobileNavOpen) setIsMobileNavOpen(false);
													setTab("2");
													setVisible(true);
												}}
											>
												<span className="header-menu">Register</span>
											</Row>
										</>
									)}
								</Row>
							)}
						</nav>
					) : (
						<nav className="navbar navbar-expand-xl">
							<Row
								style={{
									width: "100%",
									paddingTop: 10,
									paddingBottom: 10,
								}}
								justify="space-between"
								align="middle"
							>
								<Col>
									<Row gutter={24} align="middle">
										<Col sm={2}>
											<Link to={routeURL.web.home()}>
												<img src={LogoImage} alt={"RVSPHK LOGO"} />
											</Link>
										</Col>
										<Col
											xs={0}
											sm={20}
											style={{
												paddingTop: 15,
												paddingBottom: 15,
											}}
										>
											<Row gutter={16} align="middle">
												{menuList.map(({ auth, menu, url }) => (
													<Col>{prepareMenu(auth, menu, url)}</Col>
												))}
											</Row>
										</Col>
									</Row>
								</Col>

								<Col>
									<UserAccount />
								</Col>
							</Row>
						</nav>
					)}
				</Container>
			</div>
		</header>
	);
};

export default function NavigationHeader(props) {
	const path = props.location.pathname; //pathname from the url
	const isHomePage = () => path === routeURL.web.home();
	return isHomePage() ? <HeaderHome /> : <DefaultHeader {...props} />;
}
