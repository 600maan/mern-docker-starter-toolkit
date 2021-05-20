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
	Tooltip,
	Switch,
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
	TOUR_TRAVEL_LOGO_IMAGE_SIZE,
	mapCenterDefault,
} from "config";

const rowStyle = {
	width: "100%",
};

const imageTitle = "tours_travels";
const backUrl = routeURL.cms.tours_and_travels();
const pageTitle = "Tours and Travels";
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
	const [logoImage, setLogoImage] = useState([]);
	// const [activeImage, setActiveImage] = useState(-1);
	const [vendorId, setVendorId] = useState("");
	const [isRankUnique, setIsRankUnique] = useState(null);
	const [isVendorIdUnique, setIsVendorIdUnique] = useState(null);
	const [idValidating, setIdValidating] = useState(false);
	const [rankValidating, setRankValidating] = useState(false);

	const validateUniueId = (value) => {
		if (!value) return setIsVendorIdUnique(null);
		setVendorId(value);
		setIdValidating(true);
		api.tours_and_travels
			.isUnique("vendorId", value, itemId)
			.then(({ unique }) => setIsVendorIdUnique(unique))
			.finally(() => setIdValidating(false));
	};

	const validateUniqueRank = (value) => {
		if (!value) return setIsRankUnique(null);
		setRankValidating(true);
		api.tours_and_travels
			.isUnique("rank", value, itemId)
			.then(({ unique }) => setIsRankUnique(unique))
			.finally(() => setRankValidating(false));
	};
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
		console.log("saveForm", value);
		// validate here
		if (true) {
			var jsonData = {
				...value,
				photos: fileNames,
				activePhoto: fileNames.length > 0 ? fileNames[0] : -1,
				logoImage: logoImage.length > 0 ? logoImage[0] : "",
				...location,
			};
			if (itemId) jsonData._id = itemId;
			setSpinning(true);
			api.tours_and_travels
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
		setVendorId(data.vendorId);
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
			logoImage: data.logoImage,
			rank: data.rank,
			website: data.website,
		});
		setFileNames(data.photos);
		setLogoImage([data.logoImage] || []);

		if (data.gps) setLocation(data.gps);
	};

	useEffect(() => {
		if (itemId) {
			setSpinning(true);
			api.tours_and_travels
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
												message: "please Input the valid email!",
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
									CompanyLogo
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
									imageTitle={`logo_${imageTitle}_${vendorId}`}
									setFileNames={setLogoImage}
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
							<Row style={{ ...rowStyle, marginTop: 20 }}>
								<GalleryUpload
									fileNames={fileNames}
									imageTitle={`${imageTitle}_${vendorId}`}
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
