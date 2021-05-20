import {
	Button,
	Col,
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
import { QuestionCircleFilled } from "@ant-design/icons";

import api from "app/dashboard/api";
import GalleryUpload from "app/dashboard/components/GalleryUpload";
import AddPageLayout from "app/dashboard/components/ListTable/AddPageLayout";
import routeURL from "config/routeURL";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { isProductIdValid } from "services/util";
import { GALLERY_IMAGE_SIZE, mapCenterDefault } from "config";

const rowStyle = {
	width: "100%",
};

const imageTitle = "rsvp_product";
const backUrl = routeURL.cms.rsvp_product();
const pageTitle = "RSVP Product";
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
	const [fileNames, setFileNames] = useState([]);
	// const [activeImage, setActiveImage] = useState(-1);
	const [productId, setProductId] = useState("");
	const [isRankUnique, setIsRankUnique] = useState(null);
	const [isProductIdUnique, setIsProductIdUnique] = useState(null);
	const [idValidating, setIdValidating] = useState(false);
	const [rankValidating, setRankValidating] = useState(false);

	const validateUniueId = (value) => {
		if (!value) return setIsProductIdUnique(null);
		setProductId(value);
		setIdValidating(true);
		api.rsvp_product
			.isUnique("productId", value, itemId)
			.then(({ unique }) => setIsProductIdUnique(unique))
			.finally(() => setIdValidating(false));
	};

	const validateUniqueRank = (value) => {
		if (!value) return setIsRankUnique(null);
		setRankValidating(true);
		api.rsvp_product
			.isUnique("rank", value, itemId)
			.then(({ unique }) => setIsRankUnique(unique))
			.finally(() => setRankValidating(false));
	};

	const onSaveForm = (value) => {
		// validate here
		if (true) {
			var jsonData = {
				...value,
				photos: fileNames,
				activePhoto: fileNames.length >= 0 ? fileNames[0] : -1,
			};
			if (itemId) jsonData._id = itemId;
			setSpinning(true);
			api.rsvp_product
				.save(jsonData)
				.then((data) => {
					message.info(data.message);
					props.history.push(backUrl);
				})
				.catch((err) => {
					console.log("error", err);
					// return console.log("error message", err.response.data);
					if (err.response.data) message.error(err.response.data.message);
				})
				.finally(() => setSpinning(false));
		}
	};

	const fillForm = (data) => {
		// _id: data._id,
		// gps: data.gps,
		// activePhoto: data.activePhoto,
		if (data.productId) setProductId(data.productId);
		validateUniqueRank(data.rank);
		formRef.current.setFieldsValue({
			shortDescription: data.shortDescription, //
			productId: data.productId,
			activeStatus: data.activeStatus,
			price: data.price,
			category: data.category,
			description: data.description,
			discountPercent: data.discountPercent,
			flag: data.flag,
			keywords: data.keywords,
			name: data.name,
			photos: data.photos,
			rank: data.rank,
		});
		setFileNames(data.photos);
	};

	useEffect(() => {
		if (itemId) {
			setSpinning(true);
			api.rsvp_product
				.read(itemId)
				.then(({ data }) => fillForm(data))
				.catch((err) => {
					if (err.response.data) message.error(err.response.data.message);
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
							ref={formRef}
							layout="vertical"
							name="control-ref"
							onFinish={onSaveForm}
							requiredMark={true}
							scrollToFirstError
							autoComplete="off"
						>
							<Row style={rowStyle} gutter={24}>
								<Col xs={24} lg={12}>
									<Form.Item
										name="productId"
										label="Product Id"
										rules={[
											{
												required: true,
												message: "Please input the Product Id!",
											},
										]}
										hasFeedback
										validateStatus={
											idValidating
												? "validating"
												: itemId || isProductIdUnique == true
												? "success"
												: "error"
										}
										help={
											!itemId &&
											!isProductIdUnique &&
											"Product Id must be unique"
										}
									>
										<Input
											disabled={!!itemId}
											value={productId}
											onChange={({ target: { value } }) =>
												validateUniueId(value)
											}
											required
										/>
									</Form.Item>
								</Col>
								<Col xs={24} lg={12}>
									<Form.Item
										name="name"
										label="Product Name"
										rules={[
											{
												required: true,
												message: "Please input the vendor name!",
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
										name="price"
										label="Price"
										rules={[
											{
												required: true,
												message: "Please input Price of the product!",
											},
										]}
									>
										<InputNumber
											style={{
												width: "100%",
											}}
											min={0}
											max={10000}
										/>
									</Form.Item>
								</Col>
							</Row>

							<Row style={rowStyle} gutter={24}>
								<Col xs={24} lg={12}>
									<Form.Item
										name="discountPercent"
										label="Discount Offer (in %)"
									>
										<InputNumber
											style={{
												width: "100%",
											}}
											min={0}
											max={100}
										/>
									</Form.Item>
								</Col>

								<Col xs={24} lg={6}>
									<Form.Item name="activeStatus" label="Active Status">
										<Switch defaultChecked />
									</Form.Item>
								</Col>
							</Row>
							<Row style={rowStyle} gutter={24}>
								<Col xs={24}>
									<Form.Item
										name="shortDescription"
										label="Short Description"
										rules={[
											{
												min: 10,
												message: "too short...!",
											},
											{
												required: true,
												message: "Please input the short description!",
											},
										]}
									>
										<Input.TextArea
											minLength={10}
											autoSize={{ maxRows: 2 }}
											placeholder="maximum length: 200 "
										/>
									</Form.Item>
								</Col>
							</Row>

							<Row style={rowStyle} gutter={24}>
								<Col xs={24}>
									<Form.Item
										name="description"
										label="Description"
										rules={[
											{
												required: true,
												message: "Please input the description!",
											},
										]}
									>
										<Input.TextArea autoSize={{ minRows: 4 }} />
									</Form.Item>
								</Col>
							</Row>
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
							</Row> */}

							<Divider orientation="left">
								<span
									style={{
										display: "flex",
										fexDirection: "row",
										alignItems: "center",
									}}
								>
									Pictures Wall
									<Tooltip title={`Required Image size: ${GALLERY_IMAGE_SIZE}`}>
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
									fileNames={fileNames}
									imageTitle={`${imageTitle}_${productId}`}
									setFileNames={setFileNames}
									disabled={!isProductIdValid(productId)}
									helperText={
										!isProductIdValid(productId) && (
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
