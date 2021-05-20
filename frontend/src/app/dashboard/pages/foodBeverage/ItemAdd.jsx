import {
	AutoComplete,
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
import MapViewer from "app/dashboard/components/MapViewer";
import routeURL from "config/routeURL";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { isVendorIdValid } from "services/util";
import {
	GALLERY_IMAGE_SIZE,
	FOOD_BEVERAGE_MENU_IMAGE_SIZE,
	mapCenterDefault,
} from "config";
const rowStyle = {
	width: "100%",
};

const layout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 15, offset: 1 },
};
const tailLayout = {
	wrapperCol: { offset: 8, span: 16 },
};
const imageTitle = "food_beverage";
const backUrl = routeURL.cms.food_and_beverage();
const pageTitle = "Food and Beverage";
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
	const [autoCompleteResult, setAutoCompleteResult] = useState([]);
	const [location, setLocation] = useState(mapCenterDefault);
	const [fileNames, setFileNames] = useState([]);
	const [menuImage, setMenuImage] = useState([]);
	const [activeImage, setActiveImage] = useState(-1);
	const [vendorId, setVendorId] = useState("");
	const [isRankUnique, setIsRankUnique] = useState(null);
	const [isVendorIdUnique, setIsVendorIdUnique] = useState(null);

	const onLocChange = (latitude, longitude) => {
		setLocation({
			latitude,
			longitude,
		});
	};
	const onWebsiteChange = (value) => {
		if (!value || value.indexOf(".") >= 0) {
			setAutoCompleteResult([]);
		} else {
			setAutoCompleteResult(
				[".hk", ".com", ".org", ".net"].map((domain) => `${value}${domain}`)
			);
		}
	};
	const websiteOptions = autoCompleteResult.map((website) => ({
		label: website,
		value: website,
	}));

	const onSaveForm = (value) => {
		// validate here
		if (true) {
			var jsonData = {
				...value,
				photos: fileNames,
				activePhoto: fileNames.length > 0 ? fileNames[0] : -1,
				menuImage: menuImage,
				...location,
			};
			if (itemId) jsonData._id = itemId;
			setSpinning(true);
			api.food_and_beverage
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
		if (data.vendorId) setVendorId(data.vendorId);
		validateUniqueRank(data.rank);
		formRef.current.setFieldsValue({
			shortDescription: data.shortDescription, //
			vendorId: data.vendorId,
			activeStatus: data.activeStatus,
			address: data.address,
			category: data.category,
			description: data.description,
			email: data.email,
			flag: data.flag,
			keywords: data.keywords,
			name: data.name,
			phoneNumber: data.phoneNumber,
			photos: data.photos,
			rank: data.rank,
			website: data.website,
		});
		setFileNames(data.photos);
		setMenuImage(data.menuImage || []);
		if (data.gps) setLocation(data.gps);
	};

	useEffect(() => {
		if (itemId) {
			setSpinning(true);
			api.food_and_beverage
				.read(itemId)
				.then(({ data }) => fillForm(data))
				.catch((err) => {
					if (err.response.data) message.error(err.response.data.message);
				})
				.finally(() => setSpinning(false));
		}
	}, [itemId]);

	const [idValidating, setIdValidating] = useState(false);
	const [rankValidating, setRankValidating] = useState(false);
	const validateUniueId = (value) => {
		if (!value) return setIsVendorIdUnique(null);
		setIdValidating(true);
		setVendorId(value);
		api.food_and_beverage
			.isUnique("vendorId", value, itemId)
			.then(({ unique }) => setIsVendorIdUnique(unique))
			.finally(() => setIdValidating(false));
	};

	const validateUniqueRank = (value) => {
		if (!value) return setIsRankUnique(null);
		setRankValidating(true);
		api.food_and_beverage
			.isUnique("rank", value, itemId)
			.then(({ unique }) => setIsRankUnique(unique))
			.finally(() => setRankValidating(false));
	};

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
										name="vendorId"
										label="Vendor Id"
										rules={[
											{
												required: true,
												message: "Please input the Vendor Id!",
											},
										]}
										hasFeedback
										validateStatus={
											idValidating
												? "validating"
												: itemId || isVendorIdUnique === true
												? "success"
												: "error"
										}
										help={
											!itemId && !isVendorIdUnique && "Vendor Id must be unique"
										}
									>
										<Input
											disabled={!!itemId}
											value={vendorId}
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
										label="Vendor Name"
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
										name="phoneNumber"
										label="Phone Number"
										rules={[
											{
												required: false,
											},
											{
												validator: (rule, telNo) => {
													if (!telNo) return Promise.resolve();
													else if (telNo.length < 5 || telNo.length > 12)
														return Promise.reject("Invalid Phone number");
													const re = /^[+]?[\s./0-9]*[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/g;
													if (re.test(telNo)) {
														return Promise.resolve();
													}
													return Promise.reject("Invalid Phone number");
												},
											},
										]}
									>
										<Input addonBefore={"+852"} type="tel" />
									</Form.Item>
								</Col>
							</Row>

							<Row style={rowStyle} gutter={24}>
								<Col xs={24} lg={12}>
									<Form.Item
										name="email"
										label="Email"
										rules={[
											{
												type: "email",
												message: "Please input valid email",
											},
										]}
									>
										<Input />
									</Form.Item>
								</Col>
								<Col xs={24} lg={12}>
									<Form.Item name="website" label="Website">
										<AutoComplete
											options={websiteOptions}
											onChange={onWebsiteChange}
											placeholder="website"
										>
											<Input />
										</AutoComplete>
									</Form.Item>
								</Col>
							</Row>

							<Row style={rowStyle} gutter={24}>
								<Col xs={24}>
									<Form.Item name="address" label="Address">
										<Input.TextArea autoSize={{ minRows: 2 }} />
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
											maxLength={200}
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

								<Col xs={24} lg={6}>
									<Form.Item name="activeStatus" label="Active Status">
										<Switch defaultChecked />
									</Form.Item>
								</Col>
							</Row> */}
							<Divider>Location</Divider>
							<Row style={{ ...rowStyle, marginTop: 20, height: 300 }}>
								<MapViewer
									activeMarker={{
										...location,
										name:
											formRef.current && formRef.current.getFieldValue("name"),
									}}
									markerAppendable
									height={400}
									onMapClick={onLocChange}
									options={{
										zoom: 7,
										disableDefaultUI: true,
									}}
								/>
							</Row>

							<Divider orientation="left">
								<span
									style={{
										display: "flex",
										fexDirection: "row",
										alignItems: "center",
									}}
								>
									Menu
									<Tooltip
										title={`Required Image size: ${FOOD_BEVERAGE_MENU_IMAGE_SIZE}`}
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
									// maxFile={5}
									fileNames={menuImage}
									imageTitle={`menu-${imageTitle}-${vendorId}`}
									setFileNames={setMenuImage}
									disabled={!isVendorIdValid(vendorId)}
									helperText={
										!isVendorIdValid(vendorId) && (
											<span>Please input the correct vendor id</span>
										)
									}
								/>
							</Row>

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
							{"vendorID " + vendorId}
							<Row style={{ ...rowStyle, marginTop: 20 }}>
								<GalleryUpload
									fileNames={fileNames}
									imageTitle={`${imageTitle}_${vendorId}`}
									imageTitle={imageTitle}
									setFileNames={setFileNames}
									disabled={!isVendorIdValid(vendorId)}
									helperText={
										!isVendorIdValid(vendorId) && (
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
