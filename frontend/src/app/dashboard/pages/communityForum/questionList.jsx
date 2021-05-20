import { Row, Col } from "antd";
import ListTable from "app/dashboard/components/ListTable";
import routeURL from "config/routeURL";
import React from "react";
import "./index.css";
import api from "app/dashboard/api";
import moment from "moment";
import { Link } from "react-router-dom";
import { PlusCircleFilled } from "@ant-design/icons";
const rowStyle = {
	width: "100%",
};

const columns = [
	// {
	//   title: "Thread Id",
	//   dataIndex: "threadId",
	//   key: "threadId",
	//   sorter: (a, b) => a.threadId.length - b.threadId.length,
	//   sortDirections: ["descend", "ascend"],
	//   ellipsis: true,
	// },
	{
		title: "Thread Question",
		dataIndex: "question",
		key: "question",
		sorter: (a, b) => a.question.localeCompare(b.question),
		sortDirections: ["ascend", "descend"],
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
		dataIndex: "userName",
		key: "userName",
		sorter: (a, b) => a.userName.localeCompare(b.userName),
		sortDirections: ["ascend", "descend"],
		ellipsis: true,
		render: (columnData) => (
			<div
				style={{
					whiteSpace: "pre-line",
				}}
			>
				{columnData || "Non-exists user"}
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
		sortDirections: ["ascend", "descend"],
		sorter: (a, b) =>
			moment(a.createdDateTime).unix() - moment(b.createdDateTime).unix(),
	},
];

const title = "Thread Question";
export default function QuestionList() {
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
					url: routeURL.cms.community_edit,
				}}
				columnData={columns}
				apiURL={{
					get: api.community.readAllQuestions,
					delete: api.community.delete,
					deleteMany: api.community.deleteMany,
					toggle: api.community.toggle,
				}}
				actions={(row) => (
					<Col>
						<Link to={routeURL.cms.community_edit_answer(row._id, "new")}>
							<div
								style={{
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
									cursor: "pointer",
									color: "#40a9ff",
								}}
							>
								<PlusCircleFilled style={{ marginRight: 5 }} />
								Add Reply
							</div>
						</Link>
					</Col>
				)}
			></ListTable>
		</Row>
	);
}
