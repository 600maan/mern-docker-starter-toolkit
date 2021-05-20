import React from "react";
import { Menu, Dropdown, Avatar } from "antd";
import { AvatarIcon } from "../../components";
import { CaretDownOutlined } from "@ant-design/icons";
import routeURL from "config/routeURL";

export const Profile = ({ history, onLogout, ...props }) => {
	const onMenuClick = ({ key }) => {
		if (key === "logout" && onLogout) {
			onLogout();
		} else if (key === "my_account") {
			history.push(routeURL.cms.account());
		}
	};

	const menu = (
		<Menu onClick={onMenuClick}>
			<Menu.Item key="logout">Logout</Menu.Item>
			<Menu.Item key="my_account">My Account</Menu.Item>
		</Menu>
	);

	return (
		<div style={{ display: "inline-block", ...props.style }}>
			<Dropdown overlay={menu} placement="topLeft">
				<a className="ant-dropdown-link" href="#">
					<Avatar
						size={32}
						icon={<AvatarIcon />}
						style={{ marginRight: "15px" }}
					/>
					<CaretDownOutlined />
				</a>
			</Dropdown>
		</div>
	);
};
