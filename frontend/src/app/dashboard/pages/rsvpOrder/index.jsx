import { Row, Col } from "antd";
import api from "app/dashboard/api";
import ListTable from "app/dashboard/components/ListTable";
import routeURL from "config/routeURL";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./index.css";
import { CommentOutlined } from "@ant-design/icons";
import SendEmail from "app/dashboard/components/SendEmail";
import moment from "moment";

const rowStyle = {
	width: "100%",
};

const columns = [
	{
		title: "Order Id",
		dataIndex: "orderId",
		key: "orderId",
		width: 100,
		sorter: (a, b) => a.orderId.localeCompare(b.orderId),
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
		title: "Product Id",
		dataIndex: "productId",
		key: "productId",
		width: 100,
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
		dataIndex: "productName",
		key: "productName",
		sorter: (a, b) => a.productName.localeCompare(b.productName),
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
		title: "User",
		dataIndex: "userName",
		key: "userName",
		sorter: (a, b) => a.userName.localeCompare(b.userName),
		sortDirections: ["descend", "ascend"],
		ellipsis: true,
		render: (columnData) => (
			<div
				style={{
					whiteSpace: "pre-line",
				}}
			>
				{columnData || "User Not Exist"}
			</div>
		),
	},
	{
		title: "Contact",
		dataIndex: "contact",
		key: "contact",
		sorter: (a, b) => a.contact.localeCompare(b.contact),
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
		title: "Message",
		dataIndex: "message",
		key: "message",
		sorter: (a, b) => a.message.localeCompare(b.message),
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
		title: "Ordered Date",
		dataIndex: "createdDateTime",
		key: "createdDateTime",
		render: (data) => (
			<div
				style={{
					whiteSpace: "pre-line",
				}}
			>
				{moment(data).fromNow()}
			</div>
		),
		sortDirections: ["descend", "ascend"],
		sorter: (a, b) =>
			moment(a.createdDateTime).unix() - moment(b.createdDateTime).unix(),
	},
];

const title = "RSVP Orders";
export default function RSVPOrderPage() {
	const [visible, setVisible] = useState(false);
	const [detail, setDetail] = useState({});

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
				columnData={columns}
				apiURL={{
					get: api.rsvp_order.readAll,
					delete: api.rsvp_order.delete,
					deleteMany: api.rsvp_order.deleteMany,
					toggle: api.rsvp_order.toggle,
				}}
				actions={(row) => (
					<Col key={row._id}>
						<SendEmail
						key={detail.email}
							subject={detail.subject}
							email={detail.email}
							visible={visible}
							onClose={() => setVisible(false)}
						/>
						<div
							onClick={() => {
								setDetail({
									subject: `RSVP HK || About Your Order #${row.orderId}: '${row.productName}'`,
									email: row.contact,
								});
								setVisible(true);
							}}
							style={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								cursor: "pointer",
								color: "#40a9ff",
							}}
						>
							<CommentOutlined style={{ marginRight: 5 }} />
							Reply
						</div>
					</Col>
				)}
			></ListTable>
		</Row>
	);
}
