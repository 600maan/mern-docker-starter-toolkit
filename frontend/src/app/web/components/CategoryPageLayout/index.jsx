import React, { useEffect, useState } from "react";
import Container from "app/web/components/Container";
import { Col, message, Pagination, Row, Spin } from "antd";
import Animate from "rc-animate";
import "./index.css";
import moment from "moment";
const rowsPerPage = 20;
export default function CategoryPageLayout({ apiURL, title, children }) {
	const [spinning, setSpinning] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [items, setItems] = useState([]);
	const [totalItemLength, setTotalItemLength] = useState(0);
	useEffect(() => {
		setSpinning(true);
		apiURL
			.get()
			.then((res) => {
				let data = res.data;
				data.sort(
					(a, b) =>
						moment(a.createdDateTime).unix() - moment(b.createdDateTime).unix()
				);

				setTotalItemLength(data.length);
				setItems(data);
			})
			.catch((err) => {
				if (err.response && err.response.data)
					message.error(err.response.data.message);
			})
			.finally(() => setSpinning(false));

		window.scrollTo(0, 0);
	}, []);

	console.log("items", items, totalItemLength);
	const onPagination = (page) => {
		// show data only on pagination
		setCurrentPage(page);
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
					<Container>
						<div className="mb-8">
							<h5
								className="text-center text-uppercase"
								style={{ marginBottom: "0 !important" }}
							>
								{title}
							</h5>
						</div>
					</Container>
					<Container>
						<Row justify="center">
							{spinning ? (
								<Spin spinning={spinning} />
							) : typeof children === "function" ? (
								(rowsPerPage > 0
									? items.slice(
											(currentPage - 1) * rowsPerPage,
											(currentPage - 1) * rowsPerPage + rowsPerPage
									  )
									: items
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
