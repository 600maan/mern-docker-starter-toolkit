import { Button, Col, Form, Input, message, Row } from "antd";
import AddPageLayout from "app/dashboard/components/ListTable/AddPageLayout";
import routeURL from "config/routeURL";
import React, { useEffect, useRef, useState } from "react";
import api from "app/dashboard/api";
import { each } from "lodash";
import { Link } from "react-router-dom";

const rowStyle = {
	width: "100%",
};

const backUrl = routeURL.cms.community();
const pageTitle = "Community Forum";
/*
	Things to Change
	1. imageTitle
	
	
	*/
export default function ItemAdd(props) {
	const {
		match: {
			params: { itemId },
		},
	} = props;
	var formRef = useRef();
	const [spinning, setSpinning] = useState(false);

	const onSaveForm = (value) => {
		// validate here
		if (true) {
			var jsonData = {
				...value,
			};
			if (itemId) jsonData._id = itemId;
			setSpinning(true);
			api.community
				.save(jsonData)
				.then((data) => {
					message.info(data.message);
					props.history.push(backUrl);
				})
				.catch((err) => {
					console.log("error", err);
					// return console.log("error message", err.response.data);
					// if (err.response.data) message.error(err.response.data.message);
				})
				.finally(() => setSpinning(false));
		}
	};

	const fillForm = (data) => {
		// _id: data._id,
		// gps: data.gps,
		// activePhoto: data.activePhoto,

		formRef.current.setFieldsValue({
			threadQuestion: data.threadQuestion,
			activeStatus: data.activeStatus,
			flag: data.flag,
			rank: data.rank,
		});
	};

	useEffect(() => {
		if (itemId) {
			setSpinning(true);
			api.community
				.readQuestion(itemId)
				.then(({ data }) => fillForm(data))
				.catch((err) => {
					console.log("error", err);
					// return console.log("error message", err.response.data);
					// if (err.response.data) message.error(err.response.data.message);
				})
				.finally(() => setSpinning(false));
		}
	}, [itemId]);

	return (
		<Row style={{ ...rowStyle, padding: "24px 40px" }}>
			<AddPageLayout
				title={itemId ? `Update ${pageTitle}` : `Add ${pageTitle}`}
				breadCrumb={[
					{
						title: "Home",
						url: routeURL.cms.home(),
					},
					{
						title: pageTitle,
						url: backUrl,
					},
					{
						title: itemId ? "Update" : "Add",
						url: false,
					},
				]}
				showActions={false}
				backUrl={backUrl}
			>
				{/* <Spin spinning={spinning} wrapperClassName="item-add-spinner"> */}
				<Row
					style={{
						...rowStyle,
						marginTop: 40,
					}}
					justify="center"
				>
					<Col
						xs={24}
						md={24}
						lg={16}
						style={{
							backgroundColor: "#fff",
							borderRadius: 8,
							boxShadow: "rgba(0, 0, 0, 0.15) 0px 2px 8px",
							padding: 30,
						}}
					>
						<Form
							// wrapperCol={{
							// 	offset: 1,
							// }}
							// {...layout}
							ref={formRef}
							// form={form}
							layout="vertical"
							name="control-ref"
							onFinish={onSaveForm}
							requiredMark={true}
							scrollToFirstError
						>
							<Row style={rowStyle} gutter={24}>
								<Col xs={24}>
									<Form.Item
										name="threadQuestion"
										label="Thread Question"
										rules={[
											{
												required: true,
											},
										]}
									>
										<Input.TextArea autoSize={{ minRows: 5 }} />
									</Form.Item>
								</Col>
							</Row>
							{/* {itemId && (
								<Row style={rowStyle} gutter={24}>
									<Col xs={24}>
										<Link to={routeURL.cms.community_edit_answer(itemId)}>
											<Button>add replies</Button>
										</Link>
									</Col>
								</Row>
							)} */}

							<Row
								style={{
									...rowStyle,
									marginTop: 30,
								}}
								gutter={16}
								justify="end"
							>
								<Col>
									<Form.Item>
										<Button type="primary" htmlType="submit" loading={spinning}>
											Create
										</Button>
									</Form.Item>
								</Col>
								<Col>
									<Form.Item>
										<Link to={backUrl}>
											<Button>Cancel</Button>
										</Link>
									</Form.Item>
								</Col>
							</Row>
						</Form>
					</Col>
				</Row>
				{/* </Spin> */}
			</AddPageLayout>
		</Row>
	);
}
