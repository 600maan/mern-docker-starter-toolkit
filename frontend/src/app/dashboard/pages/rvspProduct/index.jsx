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
		title: "Product ID",
		dataIndex: "productId",
		key: "productId",
		sorter: (a, b) => a.productId.localeCompare(b.productId),
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
		title: "Product Name",
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
		title: "Price",
		dataIndex: "price",
		key: "price",
		sorter: (a, b) => a.price - b.price,
		sortDirections: ["descend", "ascend"],
		ellipsis: true,
		render: (price) => <span>{`HK$ ${price}`}</span>,
	},
	{
		title: "Discount",
		dataIndex: "discountPercent",
		key: "discountPercent",
		sorter: (a, b) => a.discountPercent - b.discountOffer,
		sortDirections: ["descend", "ascend"],
		ellipsis: true,
		render: (discount) => `${discount} %`,
	},
];

const title = "RSVP Products";
export default function RSVPProducts() {
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
					url: routeURL.cms.rsvp_product_add(),
				}}
				edit={{
					url: routeURL.cms.rsvp_product_edit,
				}}
				columnData={columns}
				apiURL={{
					get: api.rsvp_product.readAll,
					delete: api.rsvp_product.delete,
					deleteMany: api.rsvp_product.deleteMany,
					toggle: api.rsvp_product.toggle,
				}}
			></ListTable>
		</Row>
	);
}
