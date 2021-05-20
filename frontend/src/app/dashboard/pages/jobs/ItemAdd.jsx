import {
	MinusCircleOutlined,
	PlusOutlined,
	QuestionCircleFilled,
} from "@ant-design/icons";
import {
	Button,
	Col,
	DatePicker,
	Divider,
	Form,
	Input,
	InputNumber,
	message,
	Row,
	Select,
	Switch,
	Tooltip,
} from "antd";
import api from "app/dashboard/api";
import GalleryUpload from "app/dashboard/components/GalleryUpload";
import AddPageLayout from "app/dashboard/components/ListTable/AddPageLayout";
import { TOUR_TRAVEL_LOGO_IMAGE_SIZE, mapCenterDefault } from "config";
import routeURL from "config/routeURL";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { isVendorIdValid } from "services/util";

const { Option } = Select;

const rowStyle = {
	width: "100%",
};

const imageTitle = "jobs";
const backUrl = routeURL.cms.jobs();
const pageTitle = "RSVP Jobs";
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
	const [logoImage, setLogoImage] = useState([]);
	const [jobId, setJobId] = useState("");

	const [isRankUnique, setIsRankUnique] = useState(null);
	const [isJobIdUnique, setIsJobIdUnique] = useState(null);
	const [idValidating, setIdValidating] = useState(false);
	const [rankValidating, setRankValidating] = useState(false);

	const validateUniueId = (value) => {
		if (!value) return setIsJobIdUnique(null);
		setJobId(value);
		setIdValidating(true);
		api.jobs
			.isUnique("jobId", value, itemId)
			.then(({ unique }) => setIsJobIdUnique(unique))
			.finally(() => setIdValidating(false));
	};

	const validateUniqueRank = (value) => {
		if (!value) return setIsRankUnique(null);
		setRankValidating(true);
		api.jobs
			.isUnique("rank", value, itemId)
			.then(({ unique }) => setIsRankUnique(unique))
			.finally(() => setRankValidating(false));
	};

	const onSaveForm = (value) => {
		// validate here
		if (true) {
			var jsonData = {
				...value,
				logoImage: logoImage.length > 0 ? logoImage[0] : "",
			};
			if (itemId) jsonData._id = itemId;
			if (value.jobDescriptions)
				jsonData.jobDescriptions = value.jobDescriptions.map(
					(each) => each.option
				);
			setSpinning(true);
			api.jobs
				.save(jsonData)
				.then((data) => {
					message.info(data.message);
					props.history.push(backUrl);
				})
				.catch((err) => {
					if (err.response.data) message.error(err.response.data.message);
				})
				.finally(() => setSpinning(false));
		}
	};

	const fillForm = (data) => {
		// _id: data._id,
		// gps: data.gps,
		// activePhoto: data.activePhoto,
		setJobId(data.jobId);
		validateUniqueRank(data.rank);
		var formFields = {
			jobId: data.jobId,
			activeStatus: data.activeStatus,
			companyName: data.companyName,
			category: data.category,
			salary: data.salary,
			applicationDeadline: moment(data.applicationDeadline),
			expiryDate: moment(data.expiryDate),
			advertiserEmail: data.advertiserEmail,
			flag: data.flag,
			keywords: data.keywords,
			title: data.title,
			workTime: data.workTime,
			rank: data.rank,
			workingLocation: data.workingLocation,
			experienceYears: data.experienceYears,
			benefits: data.benefits,
		};
		if (
			data.jobDescriptions &&
			Array.isArray(data.jobDescriptions) &&
			data.jobDescriptions.length > 0
		) {
			formFields.jobDescriptions = data.jobDescriptions.map((each) => ({
				option: each,
			}));
		}
		formRef.current.setFieldsValue(formFields);
		setLogoImage([data.logoImage] || []);
	};

	useEffect(() => {
		if (itemId) {
			setSpinning(true);
			api.jobs
				.read(itemId)
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
				title={
					itemId ? `Update ${pageTitle} Vendor` : `Add ${pageTitle} Vendor`
				}
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
						title: itemId ? "Update Vendor" : "Add Vendor",
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
								<Col xs={24} lg={12}>
									<Form.Item
										name="jobId"
										label="Job Id"
										rules={[
											{
												required: true,
												message: "Please input the Job Id!",
											},
										]}
										hasFeedback
										validateStatus={
											idValidating
												? "validating"
												: itemId || isJobIdUnique === true
												? "success"
												: "error"
										}
										help={!itemId && !isJobIdUnique && "Job Id must be unique"}
									>
										<Input
											disabled={!!itemId}
											value={jobId}
											onChange={({ target: { value } }) =>
												validateUniueId(value)
											}
											required
										/>
									</Form.Item>
								</Col>
								<Col xs={24} lg={12}>
									<Form.Item
										name="title"
										label="Job Title"
										rules={[
											{
												required: true,
												message: "Please input the Job Title!",
											},
										]}
									>
										<Input />
									</Form.Item>
								</Col>
							</Row>
							<Row style={rowStyle} gutter={24}>
								<Col xs={24} lg={12}>
									<Form.Item name="category" label="Category">
										<Input />
									</Form.Item>
								</Col>
								<Col xs={24} lg={12}>
									<Form.Item
										name="companyName"
										label="Company Name"
										rules={[
											{
												required: true,
												message: "Please input the company name!",
											},
										]}
									>
										<Input />
									</Form.Item>
								</Col>
							</Row>

							<Row style={rowStyle} gutter={24}>
								<Col xs={24} lg={12}>
									<Form.Item name="advertiserEmail" label="Advertiser Email">
										<Input />
									</Form.Item>
								</Col>
								<Col xs={24} lg={12}>
									<Form.Item name="workTime" label="Employment Type">
										<Select defaultValue="full_time" style={{ width: "100%" }}>
											<Option value="full_time">Full Time</Option>
											<Option value="part_time">Part Time</Option>
										</Select>
									</Form.Item>
								</Col>
							</Row>

							<Row style={rowStyle} gutter={24}>
								<Col xs={24} lg={12}>
									<Form.Item name="salary" label="Salary (HK$)">
										<InputNumber
											style={{
												width: "100%",
											}}
											min={1}
										/>
									</Form.Item>
								</Col>
								<Col xs={24} lg={12}>
									<Form.Item
										name="experienceYears"
										label="Minimum Experience (in year)"
									>
										<InputNumber
											style={{
												width: "100%",
											}}
											min={1}
											max={40}
										/>
									</Form.Item>
								</Col>
							</Row>

							<Row style={rowStyle} gutter={24}>
								<Col xs={24} lg={12}>
									<Form.Item
										name="applicationDeadline"
										label="Application Deadline"
									>
										<DatePicker style={{ width: "100%" }} />
									</Form.Item>
								</Col>
								<Col xs={24} lg={12}>
									<Form.Item name="expiryDate" label="Post Expiry Date">
										<DatePicker style={{ width: "100%" }} />
									</Form.Item>
								</Col>
							</Row>
							<Row style={rowStyle} gutter={24}>
								<Col xs={24}>
									<Form.Item name="workingLocation" label="Work Location">
										<Input.TextArea autoSize={{ minRows: 2 }} />
									</Form.Item>
								</Col>
							</Row>
							<Row style={rowStyle} gutter={24}>
								<Col xs={24}>
									<Form.Item
										name="benefits"
										label="Benefits"
										help="eg: medical allowance, 13 months pay "
									>
										<Input.TextArea autoSize={{ minRows: 2 }} />
									</Form.Item>
								</Col>
							</Row>

							<Divider>Job Description</Divider>
							<Form.List name="jobDescriptions">
								{(fields, { add, remove }) => {
									return (
										<div>
											{fields.map((field, idx) => (
												<div
													key={field.key}
													style={{
														width: "100%",
														display: "flex",
														alignItems: "center",
														marginBottom: 8,
													}}
													align="start"
												>
													<Form.Item
														{...field}
														style={{
															width: "100%",
														}}
														name={[field.name, "option"]}
														fieldKey={[field.fieldKey, "option"]}
													>
														<Input
															width="100%"
															placeholder={
																idx % 2 == 0
																	? "Design campaign and events material."
																	: "Ad-hoc duties as assigned from time to time."
															}
														/>
													</Form.Item>

													<Form.Item>
														<MinusCircleOutlined
															style={{
																marginLeft: 16,
																color: "red",
															}}
															onClick={() => {
																remove(field.name);
															}}
														/>
													</Form.Item>
												</div>
											))}

											<Form.Item>
												<Button
													type="dashed"
													onClick={() => {
														add();
													}}
													block
												>
													<PlusOutlined /> Add field
												</Button>
											</Form.Item>
										</div>
									);
								}}
							</Form.List>
							<Divider></Divider>

							<Row style={rowStyle} gutter={24}>
								<Col xs={24} md={20}>
									<Form.Item name="keywords" label="Keywords">
										<Select
											dropdownRender={false}
											mode="tags"
											style={{ width: "100%" }}
										></Select>
									</Form.Item>
								</Col>
								<Col xs={24} md={4}>
									<Form.Item name="activeStatus" label="Active Status">
										<Switch defaultChecked />
									</Form.Item>
								</Col>
							</Row>
							{/* <Row style={rowStyle} gutter={24}>
								<Col xs={24} lg={18}>
									<Form.Item
										name="rank"
										label="Rank"
										rules={[
											{
												required: true,
												message: "Please input the rank!",
											},
										]}
										hasFeedback
										validateStatus={
											rankValidating
												? "validating"
												: isRankUnique
												? "success"
												: "error"
										}
										help={!isRankUnique && "Rank must be unique"}
									>
										<InputNumber
											style={{
												width: "100%",
											}}
											onChange={validateUniqueRank}
											min={1}
											max={10000}
										/>
									</Form.Item>
								</Col>

								<Col xs={24} lg={6}>
									<Form.Item name="activeStatus" label="Active Status">
										<Switch defaultChecked />
									</Form.Item>
								</Col>
							</Row> */}

							<Divider orientation="left">
								<span
									style={{
										display: "flex",
										fexDirection: "row",
										alignItems: "center",
									}}
								>
									Logo
									<Tooltip
										title={`Required Image size: ${TOUR_TRAVEL_LOGO_IMAGE_SIZE}`}
									>
										<QuestionCircleFilled
											style={{
												marginLeft: 8,
											}}
										/>
									</Tooltip>{" "}
								</span>
							</Divider>
							<Row style={{ ...rowStyle, marginTop: 20 }}>
								<GalleryUpload
									maxFile={1}
									fileNames={logoImage}
									imageTitle={`logo_${imageTitle}_${jobId}`}
									setFileNames={setLogoImage}
									disabled={!isVendorIdValid(jobId)}
									helperText={
										!isVendorIdValid(jobId) && (
											<span>Please input the correct vendor id</span>
										)
									}
								/>
							</Row>
							<Divider></Divider>
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
											{itemId ? "Update" : "Create"}
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
