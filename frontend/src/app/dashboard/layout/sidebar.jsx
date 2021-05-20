import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import Icon, {
	HomeFilled,
	UserOutlined,
	FileOutlined,
} from "@ant-design/icons";
import { NavButton } from "../components";
import logoImg from "image/logo.png";
import { CMS_TITLE } from "config";
import routeURL from "config/routeURL";
import {
	food_and_beverage_icon,
	health_and_beauty_icon,
	retailer_and_wholasale_icon,
	tours_and_travels_icon,
	rsvp_product_icon,
	community_icon,
	jobs_icon,
	RSVPOrderIcon,
	JobApplicationIcon,
	EmailOpenIcon,
} from "image/icon-svg";
const { Sider } = Layout;
const { SubMenu } = Menu;

const sidebar = [
	{
		key: "home",
		route: routeURL.cms.home(),
		label: "Dashboard",
		icon: <HomeFilled />,
		// children: []
	},
	{
		key: "rsvp-order",
		route: routeURL.cms.rsvp_order(),
		label: "RSVP Orders",
		icon: <Icon component={RSVPOrderIcon} />,
		// children: []
	},
	{
		key: "job-application",
		route: routeURL.cms.job_application(),
		label: "Job Applications",
		icon: <Icon component={JobApplicationIcon} />,
		// children: []
	},
	{
		key: "contact-message",
		route: routeURL.cms.contact_message(),
		label: "Contact Messages",
		icon: <Icon component={EmailOpenIcon} />,
		// children: []
	},
	{
		key: "food-and-beverage",
		route: routeURL.cms.food_and_beverage(),
		label: "Food and Beverage",
		icon: <Icon component={food_and_beverage_icon} />,
	},
	{
		key: "beauty_and_medicals",
		route: routeURL.cms.beauty_and_medicals(),
		label: "Beauty and Medicals",
		icon: <Icon component={health_and_beauty_icon} />,
	},
	{
		key: "tours_and_travels",
		route: routeURL.cms.tours_and_travels(),
		label: "Tours and Travels",
		icon: <Icon component={tours_and_travels_icon} />,
	},
	{
		key: "retailer_and_wholesale",
		route: routeURL.cms.retailer_and_wholesale(),
		label: "Retailer and Wholesale",
		icon: <Icon component={retailer_and_wholasale_icon} />,
	},
	{
		key: "rsvp_product",
		route: routeURL.cms.rsvp_product(),
		label: "RSVP Product",
		icon: <Icon component={rsvp_product_icon} />,
	},
	{
		key: "community",
		route: routeURL.cms.community(),
		label: "Community",
		icon: <Icon component={community_icon} />,
	},
	{
		key: "jobs",
		route: routeURL.cms.jobs(),
		label: "Jobs",
		icon: <Icon component={jobs_icon} />,
	},
	{
		key: "user_management",
		route: routeURL.cms.user_management(),
		label: "User Management",
		icon: <UserOutlined />,
	},
	{
		key: "client_list",
		route: routeURL.cms.client_list(),
		label: "Client List",
		icon: <UserOutlined />,
	},
	// {
	// 	key: "log",
	// 	route: routeURL.cms.log(),
	// 	label: "Log Management",
	// 	icon: <FileOutlined />,
	// },
];

// layout sidebar is rendered from here
const Sidebar = (props) => {
	const path = props.location.pathname; //pathname from the url
	const [activeKey, setActiveKey] = useState(""); // to check which sidebar is active

	useEffect(() => {
		if (path === routeURL.cms.home()) {
			// if path is homepage, simply active homepage
			props.setCollapsed(false);
			setActiveKey("home");
		} else {
			props.setCollapsed(true);
			sidebar.forEach((item) => {
				if (item.children) {
					{
						item.children.forEach(setActive);
					}
				} else return setActive(item);
			});
		}
	}, [path]);

	const setActive = ({ route, key }) => {
		if (path.startsWith(route)) {
			//if path startwith the route of the sidebar, active that sidebar
			setActiveKey(key);
		}
	};
	const expandedStyle = {
		flex: "0 0 220px !important",
		maxWidth: "220px !important",
		minWidth: "220px !important",
		width: "220px !important",
	};
	const collapsedStyle = {
		flex: "0 0 80px",
		maxWidth: 80,
		minWidth: 80,
		width: 80,
	};
	return (
		<Sider
			trigger={null}
			collapsible
			collapsed={props.collapsed}
			className="sidebar scrollbar"
			width={props.collapsed ? 80 : 230}
			style={{
				position: "sticky",
				top: 0,
				// padding: "0px 6px",
				// boxShadow: "rgba(0, 0, 0, 0.15) 0px 2px 8px",
				// overflow: "auto",
				// height: "100vh",
				// position: "fixed",
				// left: 0,
			}}
		>
			<div className="logo">
				<Link to={routeURL.cms.home()}>
					<img
						src={logoImg}
						alt="logo"
						style={{
							height: 40,
						}}
					/>
				</Link>
				{!props.collapsed && (
					<span
						style={{
							fontSize: "15px",
							fontWeight: "bold",
							marginLeft: 12,
							whiteSpace: "nowrap",
						}}
					>
						{CMS_TITLE}
					</span>
				)}
			</div>
			<Menu
				selectedKeys={[activeKey]}
				defaultOpenKeys={["sub1"]}
				mode="inline"
				inlineCollapsed={props.collapsed}
			>
				{sidebar.map((item) => {
					if (item.children) {
						return (
							<SubMenu key={item.key} icon={item.icon} title={item.label}>
								{item.children.map((eachChild) => (
									<Link key={eachChild.key + "_link"} to={eachChild.route}>
										<Menu.Item key={eachChild.key} icon={eachChild.icon}>
											{eachChild.label}
										</Menu.Item>
									</Link>
								))}
							</SubMenu>
						);
					} else
						return (
							<Menu.Item
								key={item.key}
								icon={item.icon}
								style={{
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
								}}
							>
								<Link key={item.key + "_link"} to={item.route}>
									{" "}
									{item.label}
								</Link>
							</Menu.Item>
						);
				})}
			</Menu>
		</Sider>
	);
};

export default Sidebar;
