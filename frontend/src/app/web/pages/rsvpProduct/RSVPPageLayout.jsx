import React, { useEffect, useState } from "react";
import Container from "app/web/components/Container";
import { Col, message, Pagination, Row, Spin, Input } from "antd";
import {
	notificationError,
	notificationSuccess,
} from "app/web/components/notification";

const rowsPerPage = 20;
export default function CategoryPageLayout({ apiURL, title, children }) {
	const [spinning, setSpinning] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [items, setItems] = useState([]);
	const [tempData, setTempData] = useState([]);
	const [totalItemLength, setTotalItemLength] = useState(0);
	const [searchText, setSearchText] = useState("");
	useEffect(() => {
		setSpinning(true);
		apiURL
			.get()
			.then((res) => {
				let data = res.data;
				data.sort((a, b) => a.rank - b.rank);
				// data = [...Array(10000).keys()].map((each, idx) => ({
				// 	...data[0],
				// 	name: data[0].name + "_" + (idx + 1),
				// }));
				setTotalItemLength(data.length);
				setItems(data);
				setTempData(data.map((each) => ({ ...each })));
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

		window.scrollTo(0, 0);
	}, []);

	const onPagination = (page) => {
		// show data only on pagination
		setCurrentPage(page);
	};
	const onSearch = () => {
		if (!searchText || searchText === "")
			setTempData(items.map((each) => ({ ...each })));
		else
			setTempData(
				items.filter((each) =>
					each.name.toLowerCase().includes(searchText.toLowerCase())
				)
			);
	};
	return (
		<>
			<div
				style={{
					padding: "70px 0px",
				}}
				className="content-wrap wrapper-content bg-gray-04 pb-0"
			>
				<section
					style={{
						paddingTop: "5rem",
					}}
					id="section-03"
				>
					<Container className="mb-8">
						<div className="mb-5">
							<h5
								className="text-center text-uppercase"
								style={{ marginBottom: "0 !important" }}
							>
								{title}
							</h5>
						</div>
						<div class="form-search product-search">
							<Row justify="center">
								<Col xs={24} md={20}>
									<div
										className="input-group"
										style={{
											alignItems: "unset",
											backgroundColor: "unset",
										}}
									>
										<Input
											style={{
												border: "1px solid #000",
												height: 40,
											}}
											onKeyPress={(event) => {
												if (event.key === "Enter") {
													onSearch();
												}
											}}
											onChange={({ target: { value } }) => setSearchText(value)}
											type="text"
											className="form-control"
											placeholder="Search"
										/>
										<div className="input-group-append">
											<button
												onClick={onSearch}
												className="btn btn-info"
												type="submit"
												style={{
													height: 40,
												}}
											>
												Search
											</button>
										</div>
									</div>
								</Col>
							</Row>
						</div>
					</Container>
					<Container>
						<Row justify="center">
							{spinning ? (
								<Spin spinning={spinning} />
							) : typeof children === "function" ? (
								(rowsPerPage > 0
									? tempData.slice(
											(currentPage - 1) * rowsPerPage,
											(currentPage - 1) * rowsPerPage + rowsPerPage
									  )
									: tempData
								).map((item) => (
									<Col
										xs={24}
										sm={18}
										md={11}
										xl={8}
										style={{
											padding: 8,
										}}
									>
										<div
											style={{
												backgroundColor: "#fff",
												height: "100%",
											}}
										>
											{children(item)}
										</div>
									</Col>
								))
							) : (
								children
							)}
						</Row>
					</Container>
					<Container
						outerStyle={{
							paddingTop: 30,
							paddingBottom: 30,
						}}
					>
						<Row justify="end">
							<Col>
								<Pagination
									defaultCurrent={1}
									onChange={onPagination}
									current={currentPage}
									total={totalItemLength}
									showSizeChanger={false}
									defaultPageSize={rowsPerPage}
									showTotal={(total, range) =>
										`${range[0]}-${range[1]} of ${total} items`
									}
								/>
							</Col>
						</Row>
					</Container>
				</section>
			</div>
		</>
	);
}
