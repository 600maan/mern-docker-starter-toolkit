import { Button, Col, Form, Input, message, Row, Typography } from "antd";
import AddPageLayout from "app/dashboard/components/ListTable/AddPageLayout";
import routeURL from "config/routeURL";
import React, { useEffect, useRef, useState } from "react";
import api from "app/dashboard/api";
import { each } from "lodash";
import { Link } from "react-router-dom";
import {
	notificationSuccess,
	notificationError,
} from "app/dashboard/components/notification";
const { Title } = Typography;

const rowStyle = {
	width: "100%",
};

const backUrl = routeURL.cms.community();
const pageTitle = "Thread Answers";
/*
	Things to Change
	1. imageTitle
	
	
	*/
export default function AnswerItem(props) {
	/*
	URL template:  /admin/community-answer/5f720241bca88f1ad4f577b1/new
	itemId = new => threadAnswer Id [use for update]
	questionId =5f720241bca88f1ad4f577b1 => thread _id , [use for ]

	*/
	const {
		match: {
			params: { itemId, questionId },
		},
	} = props;
	var formRef = useRef();
	const [spinning, setSpinning] = useState(false);
	const [question, setQuestion] = useState("");

	const onSaveForm = (value) => {
		// validate here
		if (true) {
			var jsonData = {
				...value,
			};
			if (itemId !== "new") jsonData._id = itemId;
			setSpinning(true);
			if (questionId !== "edit") jsonData.threadId = questionId;
			api.community
				.saveAnswer(jsonData)
				.then((data) => {
					notificationSuccess(data.message);
					props.history.push(backUrl);
				})
				.catch((error) => {
					if (error.response.data) {
						if (typeof error.response.data.message === "string")
							return notificationError(error.response.data.message);
						let errors = error.response.data;
						if (errors && errors.errors) errors = errors.errors;
						Object.keys(errors).map((key) => notificationError(errors[key]));
					}
				})
				.finally(() => setSpinning(false));
		}
	};

	const fillForm = (data) => {
		// _id: data._id,
		// gps: data.gps,
		// activePhoto: data.activePhoto,

		formRef.current.setFieldsValue({
			threadAnswer: data.threadAnswer,
			activeStatus: data.activeStatus,
			flag: data.flag,
			rank: data.rank,
		});
	};

	useEffect(() => {
		if (itemId && itemId !== "new") {
			api.community
				.read(itemId)
				.then(({ data }) => {
					fillForm(data);
				})
				.catch((err) => {
					console.log("error", err);
					// return console.log("error message", err.response.data);
					// if (err.response.data) message.error(err.response.data.message);
				})
				.finally(() => setSpinning(false));
		}
		if (questionId) {
			setSpinning(true);
			api.community
				.readQuestion(questionId)
				.then(({ data }) => {
					setQuestion(data.threadQuestion);
				})
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
				title={itemId === "new" ? `Add ${pageTitle}` : `Update ${pageTitle}`}
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
						title: itemId === "new" ? "Add" : "Update",
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
						>
							<Row style={rowStyle} gutter={24}>
								<Col xs={24}>
									<Title level={2}>{question}</Title>
								</Col>
							</Row>
							<Row style={rowStyle} gutter={24}>
								<Col xs={24}>
									<Form.Item name="threadAnswer" label="Thread Answer">
										<Input.TextArea autoSize={{ minRows: 5 }} />
									</Form.Item>
								</Col>
							</Row>

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
											{itemId && itemId !== "new"
												? "Update Reply"
												: "Add Reply"}
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
