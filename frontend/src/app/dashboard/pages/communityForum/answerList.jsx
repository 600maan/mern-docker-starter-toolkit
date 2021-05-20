import { Row, Typography } from "antd";
import ListTable from "app/dashboard/components/ListTable";
import routeURL from "config/routeURL";
import React from "react";
import "./index.css";
import api from "app/dashboard/api";
import moment from "moment";
import { Link } from "react-router-dom";

const rowStyle = {
	width: "100%",
};

const columns = [
	// {
	//   title: "Thread Id",
	//   dataIndex: "threadId",
	//   key: "threadId",
	//   sorter: (a, b) => a.threadId - b.threadId,
	//   sortDirections: ["descend", "ascend"],
	//   ellipsis: true,
	// },
	{
		title: "Thread Question",
		dataIndex: "threadQuestion",
		key: "threadQuestion",
		sorter: (a, b) => a.threadQuestion.localeCompare(b.threadQuestion),
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
		title: "Thread Reply",
		dataIndex: "threadAnswer",
		key: "threadAnswer",
		sorter: (a, b) => a.threadAnswer.localeCompare(b.threadAnswer),
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
		title: "Questioned User Name",
		dataIndex: "threadUsername",
		key: "threadUsername",
		sorter: (a, b) => a.threadUsername.localeCompare(b.threadUsername),
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
		title: "Replied User's Name",
		dataIndex: "answerUsername",
		key: "answerUsername",
		sorter: (a, b) => a.answerUsername.localeCompare(b.answerUsername),
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
		title: "Reply Date",
		dataIndex: "createdDateTime",
		key: "createdDateTime",
		sortDirections: ["ascend", "descend"],
		render: (data) => (
			<div
				style={{
					whiteSpace: "pre-line",
				}}
			>
				{moment(data).fromNow()}
			</div>
		),
		sorter: (a, b) =>
			moment(a.createdDateTime).unix() - moment(b.createdDateTime).unix(),
	},
];

const title = "Community Forum";
export default function CommunityForum() {
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
					title: `Add New Thread`,
					url: routeURL.cms.community_add(),
				}}
				edit={{
					url: (answerId, row) =>
						routeURL.cms.community_edit_answer(row.thread_id, answerId),
				}}
				columnData={columns}
				apiURL={{
					get: api.community.readAll,
					delete: api.community.deleteReply,
					deleteMany: api.community.deleteManyReply,
					toggle: api.community.toggleAnswer,
				}}
			></ListTable>
		</Row>
	);
}
