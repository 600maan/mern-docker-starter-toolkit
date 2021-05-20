import { Row, Typography, Tag } from "antd";
import ListTable from "app/dashboard/components/ListTable";
import routeURL from "config/routeURL";
import React from "react";
import "./index.css";
import api from "app/dashboard/api";
import moment from "moment";
import { FacebookOutlined, GoogleOutlined } from "@ant-design/icons";
import { EmailOpenIcon } from "image/icon-svg";
import { ACCOUNT_TYPE_GOOGLE, ACCOUNT_TYPE_FACEBOOK } from "config";
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
		sorter: (a, b) => {
			const first = a.username || "",
				second = b.username || "";
			return first.localeCompare(second);
		},
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
	{
		title: "Account Type",
		dataIndex: "accountType",
		key: "accountType",
		sorter: (a, b) => a.accountType.localeCompare(b.accountType),
		sortDirections: ["descend", "ascend"],
		ellipsis: true,
		render: (data) =>
			data === ACCOUNT_TYPE_FACEBOOK ? (
				<Tag color="blue">facebook</Tag>
			) : data === ACCOUNT_TYPE_GOOGLE ? (
				<Tag color="red">Google</Tag>
			) : (
				<Tag color="green">Email</Tag>
			),
	},
];

export default function UserManagement() {
	return (
		<Row style={{ ...rowStyle, padding: "24px 40px" }}>
			<ListTable
				title="Client List"
				breadCrumb={[
					{
						title: "Home",
						url: routeURL.cms.home(),
					},
					{
						title: "Client List",
						url: false,
					},
				]}
				columnData={columns}
				apiURL={{
					get: api.client.readAll,
					delete: api.client.delete,
					deleteMany: api.client.deleteMany,
					toggle: api.client.toggle,
				}}
			></ListTable>
		</Row>
	);
}
