import { Row } from "antd";
import api from "app/dashboard/api";
import ListTable from "app/dashboard/components/ListTable";
import routeURL from "config/routeURL";
import React from "react";
import "./index.css";

const rowStyle = {
	width: "100%",
};

const columns = [
	{
		title: "Vendor ID",
		dataIndex: "vendorId",
		key: "vendorId",
		sorter: (a, b) => a.vendorId.localeCompare(b.vendorId),
		sortDirections: ["descend", "ascend"],
		ellipsis: true,
	},
	{
		title: "Vendor Name",
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
	// {
	// 	title: "Category",
	// 	dataIndex: "category",
	// 	key: "category",
	// 	sorter: (a, b) => a.category.localeCompare(b.category),
	// 	sortDirections: ["descend", "ascend"],
	// 	ellipsis: true,
	// },
	{
		title: "Phone Number",
		dataIndex: "phoneNumber",
		key: "phoneNumber",
		sorter: (a, b) => a.phoneNumber.localeCompare(b.phoneNumber),
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
		title: "Address",
		dataIndex: "address",
		key: "address",
		sorter: (a, b) => a.address.localeCompare(b.address),
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
		title: "website",
		dataIndex: "website",
		key: "website",
		sorter: (a, b) => a.website.localeCompare(b.website),
		sortDirections: ["descend", "ascend"],
		render: (url) => (
			<div
				style={{
					whiteSpace: "pre-line",
				}}
			>
				<a
					target="_blank"
					href={url}
					style={{
						color: "#40a9ff",
						textDecoration: "none",
					}}
				>
					{url}
				</a>
			</div>
		),
		ellipsis: true,
	},
];

const title = "Beauty And Health";
export default function UserManagement() {
	return (
		<Row style={{ ...rowStyle, padding: "24px 40px" }}>
			<ListTable
				title={title}
				breadCrumb={[
					{
						title: "Home",
						url: routeURL.cms.home(),
					},
					{
						title: title,
						url: false,
					},
				]}
				addButton={{
					title: `Add ${title}`,
					url: routeURL.cms.beauty_and_medicals_add(),
				}}
				edit={{
					url: routeURL.cms.beauty_and_medicals_edit,
				}}
				columnData={columns}
				apiURL={{
					get: api.beauty_and_medicals.readAll,
					delete: api.beauty_and_medicals.delete,
					deleteMany: api.beauty_and_medicals.deleteMany,
					toggle: api.beauty_and_medicals.toggle,
				}}
			></ListTable>
		</Row>
	);
}
