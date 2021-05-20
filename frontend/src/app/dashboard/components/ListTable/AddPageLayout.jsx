import {
	ArrowLeftOutlined,
	ExclamationCircleOutlined,
	PlusOutlined,
	RightCircleOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Col, Input, message, Row, Typography, Modal } from "antd";
import OwnButton from "app/dashboard/components/Button";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./index.css";
const { Title } = Typography;
const { confirm } = Modal;
const rowStyle = {
	width: "100%",
};
const breadCrumbStyle = {
	color: "#9e9e9e",
	fontSize: 12,
};

export default function AddPageLayout({
	title,
	breadCrumb,
	children,
	backUrl = false,
}) {
	return (
		<Row style={rowStyle}>
			<Row style={rowStyle} justify="space-between" align="middle">
				<Col
					style={{
						display: "flex",
						alignItems: "center",
					}}
				>
					<Link to={backUrl}>
						<ArrowLeftOutlined
							style={{
								marginRight: 16,
								fontSize: 22,
								cursor: "pointer",
								color: "unset",
							}}
						/>
					</Link>
					<Title
						level={3}
						style={{
							marginBottom: 0,
							letterSpacing: 1,
						}}
					>
						{title}
					</Title>
				</Col>
				<Col>
					<Breadcrumb separator=">">
						{breadCrumb.map((each) => {
							return (
								<Breadcrumb.Item key={each.title}>
									{each.url ? (
										<Link to={each.url} style={breadCrumbStyle}>
											{each.title}
										</Link>
									) : (
										<span style={breadCrumbStyle}>{each.title}</span>
									)}
								</Breadcrumb.Item>
							);
						})}
					</Breadcrumb>
				</Col>
			</Row>

			{children}
		</Row>
	);
}
