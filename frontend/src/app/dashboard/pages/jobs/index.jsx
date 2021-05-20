import { Row } from "antd";
import api from "app/dashboard/api";
import ListTable from "app/dashboard/components/ListTable";
import routeURL from "config/routeURL";
import moment from "moment";
import React from "react";
import "./index.css";

const rowStyle = {
	width: "100%",
};

const columns = [
	{
		title: "Job ID",
		dataIndex: "jobId",
		key: "jobId",
		sorter: (a, b) => a.jobId.localeCompare(b.jobId),
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
		title: "Job Title",
		dataIndex: "title",
		key: "title",
		sorter: (a, b) => a.title.localeCompare(b.title),
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
		dataIndex: "advertiserEmail",
		key: "advertiserEmail",
		sorter: (a, b) => a.advertiserEmail.localeCompare(b.advertiserEmail),
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
		title: "Posted Date",
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
	{
		title: "Expiry Date",
		dataIndex: "expiryDate",
		key: "expiryDate",
		render: (data) => (
			<div
				style={{
					whiteSpace: "pre-line",
				}}
			>
				{moment(data).fromNow()}
			</div>
		),
		sorter: (a, b) => moment(a.expiryDate).unix() - moment(b.expiryDate).unix(),
		sortDirections: ["descend", "ascend"],
	},
	{
		title: "Salary",
		dataIndex: "salary",
		key: "salary",
		sorter: (a, b) => a.salary - b.salary,
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
];

const title = "Jobs";
export default function Jobs() {
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
					url: routeURL.cms.jobs_add(),
				}}
				edit={{
					url: routeURL.cms.jobs_edit,
				}}
				columnData={columns}
				apiURL={{
					get: api.jobs.readAll,
					delete: api.jobs.delete,
					deleteMany: api.jobs.deleteMany,
					toggle: api.jobs.toggle,
				}}
			></ListTable>
		</Row>
	);
}
