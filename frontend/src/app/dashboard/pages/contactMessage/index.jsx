import { CommentOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import api from "app/dashboard/api";
import ListTable from "app/dashboard/components/ListTable";
import SendEmail from "app/dashboard/components/SendEmail";
import routeURL from "config/routeURL";
import React, { useState } from "react";
import moment from "moment";

import "./index.css";

const rowStyle = {
	width: "100%",
};

const columns = [
	{
		title: "Name",
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
		title: "Subject",
		dataIndex: "subject",
		key: "subject",
		sorter: (a, b) => a.subject.localeCompare(b.subject),
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
		title: "Arrival Date",
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

const title = "Contact Message";
export default function ContactMessagePage() {
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
					get: api.contact_message.readAll,
					delete: api.contact_message.delete,
					deleteMany: api.contact_message.deleteMany,
					toggle: api.contact_message.toggle,
				}}
				actions={(row) => (
					<Col key={row._id}>
						<SendEmail
							key={detail.email}
							subject={detail.subject}
							visible={visible}
							email={detail.email}
							onClose={() => setVisible(false)}
						/>
						<div
							onClick={() => {
								setDetail({
									subject: `RSVP HK || About your message: ${row.message}'`,
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
