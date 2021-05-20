import { Row, Typography } from "antd";
import ListTable from "app/dashboard/components/ListTable";
import routeURL from "config/routeURL";
import React from "react";
import "./index.css";
import api from "app/dashboard/api";
import moment from "moment";

const { Title } = Typography;
const rowStyle = {
	width: "100%",
};

const columns = [
	{
		title: "Full Name",
		dataIndex: "name",
		key: "name",
		sorter: (a, b) => a.name.localeCompare(b.name),
		sortDirections: ["descend", "ascend"],
		ellipsis: true,
		render: (columnData) => (
			<div
				style={{
					whiteSpace: "pre-line",
				}}
			>
				{columnData}
			</div>
		),
	},
	{
		title: "Email",
		dataIndex: "email",
		key: "email",
		sorter: (a, b) => a.email.localeCompare(b.email),
		sortDirections: ["descend", "ascend"],
		ellipsis: true,
		render: (columnData) => (
			<div
				style={{
					whiteSpace: "pre-line",
				}}
			>
				{columnData}
			</div>
		),
	},
	{
		title: "Username",
		dataIndex: "username",
		key: "username",
		sorter: (a, b) => a.username.localeCompare(b.username),
		sortDirections: ["descend", "ascend"],
		ellipsis: true,
		render: (columnData) => (
			<div
				style={{
					whiteSpace: "pre-line",
				}}
			>
				{columnData}
			</div>
		),
	},
	{
		title: "Joined Date",
		dataIndex: "joinDate",
		key: "joinDate",
		sorter: (a, b) => moment(a.joinDate).unix() - moment(b.joinDate).unix(),
		sortDirections: ["descend", "ascend"],
		ellipsis: true,
		render: (data) => (
			<div
				style={{
					whiteSpace: "pre-line",
				}}
			>
				{moment(data).fromNow()}
			</div>
		),
	},
];

export default function UserManagement() {
	return (
		<Row style={{ ...rowStyle, padding: "24px 40px" }}>
			<ListTable
				title="User Management"
				breadCrumb={[
					{
						title: "Home",
						url: routeURL.cms.home(),
					},
					{
						title: "User Management",
						url: false,
					},
				]}
				addButton={{
					title: "Add User",
					url: routeURL.cms.user_management_add(),
				}}
				edit={{
					url: routeURL.cms.user_management_edit,
				}}
				columnData={columns}
				apiURL={{
					get: api.auth.admin.readAll,
					delete: api.auth.admin.delete,
					deleteMany: api.auth.admin.deleteMany,
				}}
			></ListTable>
		</Row>
	);
}
