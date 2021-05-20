import { DeleteFilled, EditFilled } from "@ant-design/icons";
import { Col, message, Popconfirm, Row, Spin, Table, Switch } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./index.css";
import _ from "lodash";
import PageLayout from "./PageLayout";
import moment from "moment";
import { notificationError } from "../notification";

const rowStyle = {
	width: "100%",
};

export default function ListTable({
	title,
	breadCrumb,
	addButton,
	edit,
	columnData,
	apiURL,
	actions = false,
}) {
	const [filteredInfo, setFilteredInfo] = useState(null);
	const [sortedInfo, setSortedInfo] = useState(null);
	const [columns, setColumns] = useState([]);
	const [rowsData, setRowsData] = useState([]);
	const [tempData, setTempData] = useState([]);
	const [spinning, setSpinning] = useState(false);
	const [selectedRowsKey, setSelectedRowsKey] = useState([]);
	const [loadingRows, setLoadingRows] = useState([]);
	const [key, setKey] = useState(0);
	const unsetLoading = (indexToBeUpdate) => {
		setLoadingRows((prevArr) => {
			function removeItemOnce(arr, value) {
				var index = arr.indexOf(value);
				if (index > -1) {
					arr.splice(index, 1);
					return removeItemOnce(arr, value);
				}
				return arr;
			}

			return removeItemOnce(prevArr, indexToBeUpdate);
		});
		setKey(Math.random());
	};

	const onSwitchChange = (checked, index, row) => {
		setLoadingRows((prev) => [...prev, index]);
		apiURL
			.toggle(row._id, checked ? "on" : "off")
			.then((res) => {
				const newRow = { ...row, activeStatus: checked };
				var tempCopyData = [...tempData];
				tempCopyData[index] = newRow;
				syncData(tempCopyData);
			})
			.catch((err) => {
				if (err.response.data) message.error(err.response.data.message);
			})
			.finally(() => unsetLoading(index));
	};

	const renderStatus = (activeStatus, row, idx) => {
		return (
			<Switch
				key={key}
				loading={loadingRows.includes(idx)}
				checked={activeStatus}
				onChange={(checked) => {
					onSwitchChange(checked, idx, row);
				}}
			/>
		);
	};
	// useEffect(() => {
	let intialColumn = [];
	if (columnData) {
		intialColumn = [...columnData];
		apiURL.toggle &&
			intialColumn.push({
				width: 80,
				title: "Status",
				dataIndex: "activeStatus",
				filterMultiple: false,
				filteredValue: filteredInfo ? filteredInfo.activeStatus : null,
				filters: [
					{
						text: "on",
						value: true,
					},
					{
						text: "off",
						value: false,
					},
				],
				onFilter: (value, record) => record.activeStatus === value,
				render: renderStatus,
			});
		let width = 70;
		if (actions) width += 100;
		if (edit) width += 50;
		intialColumn.push({
			title: "Actions",
			width: width,
			dataIndex: "_id",
			render: (rowId, row) => {
				return (
					<Row gutter={16} align="middle">
						{typeof actions === "function" && actions(row)}
						{edit && (
							<Col>
								<Link to={edit.url(rowId, row)}>
									<div
										style={{
											display: "flex",
											flexDirection: "row",
											alignItems: "center",
											cursor: "pointer",
											color: "#40a9ff",
										}}
									>
										<EditFilled style={{ marginRight: 5 }} />
										Edit
									</div>
								</Link>
							</Col>
						)}
						<Col>
							<Popconfirm
								title="Are you sure delete this user?"
								onConfirm={() => {
									onDeleteRow(rowId);
								}}
							>
								<div
									style={{
										display: "flex",
										flexDirection: "row",
										alignItems: "center",
										cursor: "pointer",
										color: "red",
									}}
								>
									<DeleteFilled style={{ marginRight: 5 }} />
									Delete
								</div>
							</Popconfirm>
						</Col>
					</Row>
				);
			},
		});

		// setColumns(intialColumn);
	}
	// }, [columnData]);

	const syncData = (data) => {
		setRowsData(
			data
				.map((each, idx) => ({ key: idx, ...each }))
				.sort(
					(a, b) =>
						moment(b.createdDateTime).unix() - moment(a.createdDateTime).unix()
				)
		);
		setTempData(
			data
				.map((each, idx) => ({ key: idx, ...each }))
				.sort(
					(a, b) =>
						moment(b.createdDateTime).unix() - moment(a.createdDateTime).unix()
				)
		);
	};
	useEffect(() => {
		setSpinning(true);
		apiURL
			.get()
			.then(({ data }) => syncData(data))
			.catch((error) => {
				if (error && error.response && error.response.data)
					message.error(error.response.data.message);
			})
			.finally(() => setSpinning(false));
	}, []);

	const onRefreshData = () => {
		setSpinning(true);
		setSelectedRowsKey([]);
		apiURL
			.get()
			.then(({ data }) => syncData(data))
			.catch((error) => {
				if (error.response && error.response.data) {
					if (typeof error.response.data.message === "string")
						return notificationError(error.response.data.message);
					let errors = error.response.data;
					Object.keys(errors).map((key) => notificationError(errors[key]));
				}
			})
			.finally(() => setSpinning(false));
	};

	const onDeleteRow = (adminid) => {
		setSpinning(true);
		apiURL
			.delete(adminid)
			.then((res) => {
				onRefreshData();
				message.success(res.message);
			})
			.catch((error) => {
				if (error.response && error.response.data) {
					if (typeof error.response.data.message === "string")
						return notificationError(error.response.data.message);
					let errors = error.response.data;
					Object.keys(errors).map((key) => notificationError(errors[key]));
				}
			})
			.finally(() => setSpinning(false));
	};

	const onDeleteRows = (adminids) => {
		setSpinning(true);
		apiURL.deleteMany &&
			apiURL
				.deleteMany(adminids.map((each) => tempData[each]._id))
				.then((res) => {
					onRefreshData();
					message.success(res.message);
				})
				.catch((error) => {
					if (error.response && error.response.data) {
						if (typeof error.response.data.message === "string")
							return notificationError(error.response.data.message);
						let errors = error.response.data;
						Object.keys(errors).map((key) => notificationError(errors[key]));
					}
				})
				.finally(() => setSpinning(false));
	};

	const onSearch = (searchText) => {
		if (!!searchText)
			setTempData(
				searchText.length === 0
					? rowsData
					: _.filter(rowsData, (item) => {
							let isMatch = false;
							for (const eachColumn of columnData)
								if (
									item[eachColumn.dataIndex] &&
									item[eachColumn.dataIndex]
										.toLowerCase()
										.includes(searchText.toLowerCase())
								)
									isMatch = true;
							return isMatch;
					  })
			);
	};

	const onReset = () => {
		setFilteredInfo(null);
		setTempData(rowsData);
	};

	const handleChange = (pagination, filters, sorter) => {
		console.log("Various parameters", pagination, filters, sorter);
		setFilteredInfo(filters);
		// this.setState({
		//   filteredInfo: filters,
		//   sortedInfo: sorter,
		// });
	};

	return (
		<Row style={rowStyle}>
			<PageLayout
				title={title}
				breadCrumb={breadCrumb}
				addButton={addButton}
				deleteRows={{
					selectedKeys: selectedRowsKey,
					onDeleteRows: onDeleteRows,
				}}
				onSearch={onSearch}
				onReset={onReset}
			>
				<Row style={{ ...rowStyle, marginTop: 40 }}>
					<Spin spinning={spinning}>
						<Table
							style={{ whiteSpace: "pre" }}
							rowSelection={{
								selectedRowKeys: selectedRowsKey,
								type: "checkbox",
								onChange: (selectedRowKeys) =>
									setSelectedRowsKey(selectedRowKeys),
							}}
							columns={intialColumn}
							dataSource={tempData}
							onChange={handleChange}
						/>
					</Spin>
				</Row>
			</PageLayout>
		</Row>
	);
}
