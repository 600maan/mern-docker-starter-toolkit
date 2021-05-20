import { Row } from "antd";
import api from "app/dashboard/api";
import ListTable from "app/dashboard/components/ListTable";
import routeURL from "config/routeURL";
import React from "react";
import { Link } from "react-router-dom";
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
	{
		title: "Category",
		dataIndex: "category",
		key: "category",
		sorter: (a, b) => a.category.localeCompare(b.category),
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
		sorter: (a, b) => a.website.localeCompare(b.website),
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
				<Link
					target="_blank"
					to={url}
					style={{
						color: "#40a9ff",
						textDecoration: "none",
					}}
				>
					{url}
				</Link>
			</div>
		),
		ellipsis: true,
	},
];

const title = "Retailer and Wholesale";
export default function RetailerWholesale() {
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
					url: routeURL.cms.retailer_and_wholesale_add(),
				}}
				edit={{
					url: routeURL.cms.retailer_and_wholesale_edit,
				}}
				columnData={columns}
				apiURL={{
					get: api.retailer_and_wholesale.readAll,
					delete: api.retailer_and_wholesale.delete,
					deleteMany: api.retailer_and_wholesale.deleteMany,
					toggle: api.retailer_and_wholesale.toggle,
				}}
			></ListTable>
		</Row>
	);
}
