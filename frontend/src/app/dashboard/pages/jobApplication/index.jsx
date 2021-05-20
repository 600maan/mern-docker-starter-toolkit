import { Col, Row, Tooltip } from "antd";
import api from "app/dashboard/api";
import ListTable from "app/dashboard/components/ListTable";
import routeURL from "config/routeURL";
import React, { useState } from "react";
import "./index.css";
import { DownloadOutlined } from "@ant-design/icons";
import config from "config";
import Downloader from "js-file-downloader";
import { CommentOutlined } from "@ant-design/icons";
import SendEmail from "app/dashboard/components/SendEmail";
import moment from "moment";

const rowStyle = {
	width: "100%",
};

const columns = [
	{
		title: "Id",
		dataIndex: "applicationId",
		key: "applicationId",
		width: 100,
		sorter: (a, b) => a.applicationId.localeCompare(b.applicationId),
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
		title: "Job Id",
		dataIndex: "jobId",
		key: "jobId",
		width: 100,
		sorter: (a, b) => a.jobId.localeCompare(b.jobId),
		sortDirections: ["descend", "ascend"],
		ellipsis: true,
	},
	{
		title: "Company Name",
		dataIndex: "companyName",
		key: "companyName",
		sorter: (a, b) => a.companyName.localeCompare(b.companyName),
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
		title: "Title",
		dataIndex: "jobTitle",
		key: "jobTitle",
		sorter: (a, b) => a.jobTitle.localeCompare(b.jobTitle),
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
		title: "CV",
		dataIndex: "cv",
		key: "cv",
		width: 70,
		ellipsis: true,
		render: (cv_file) => (
			<Tooltip title="Download CV">
				<DownloadOutlined
					onClick={() => {
						new Downloader({
							url: `${config.API_HOST}/api/imageUpload/image/${cv_file}`,
							// headers: [
							// 	{
							// 		name: "Authorization",
							// 		value: "Bearer " + JwtService.getAccessToken(),
							// 	},
							// ],
							filename: cv_file,
						})
							.then(function () {
								console.log("downloaded");
							})
							.catch((err) => console.log("error on file download", err));
					}}
				></DownloadOutlined>
			</Tooltip>
		),
	},
	{
		title: "Applied Date",
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

const title = "Job Application";
export default function JobApplicationPage() {
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
					get: api.jobs_application.readAll,
					delete: api.jobs_application.delete,
					deleteMany: api.jobs_application.deleteMany,
					toggle: api.jobs_application.toggle,
				}}
				actions={(row) => {
					return (
						<Col key={row._id}>
							{/* key must be provided to see changes */}
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
										subject: `RSVP HK || About Job Application #${row.applicationId}: '${row.jobTitle}'`,
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
					);
				}}
			></ListTable>
		</Row>
	);
}
