import React, { useEffect, useState } from "react";
import { Upload, Modal, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import api from "app/dashboard/api";
import config, { MAX_GALLERY_IMAGE_SIZE, IMAGE_FORMAT_GALLERY } from "config";

const uploadButton = (
	<div>
		<PlusOutlined />
		<div style={{ marginTop: 8 }}>Upload</div>
	</div>
);

function GalleryUpload({
	fileNames,
	setFileNames,
	imageTitle,
	disabled,
	helperText,
	maxFile,
	...props
}) {
	const [previewImage, setPreviewImage] = useState(null);
	const [previewVisible, setPreviewVisible] = useState(false);
	const [previewTitle, setPreviewTitle] = useState("");
	const [fileList, setFileList] = useState([]);
	const [nameMapping, setNameMapping] = useState([]);
	const [hasImageFetched, setHasImageFetched] = useState(false);
	console.log(config.getImageHost(fileNames[0]), "fileNames", fileList);
	useEffect(() => {
		if (!hasImageFetched && fileNames && fileNames.length > 0) {
			console.log("imageURL");
			let files = fileNames.map((fileName, idx) => ({
				uid: `-${idx + 1}`,
				name: fileName,
				status: "done",
				url: config.getImageHost(fileName),
			}));
			setFileList(files);
			setNameMapping(files.map((each) => ({ name: each.name, uid: each.uid })));
			setHasImageFetched(true);
		}
	}, [fileNames]);

	const getBase64 = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});
	};

	const handlePreview = async (file) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj);
		}
		setPreviewImage(file.url || file.preview);
		setPreviewTitle(
			file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
		);
		setPreviewVisible(true);
	};

	const handleChange = ({ fileList }) => setFileList(fileList);

	// const upload = async function (image, fileName) {};

	const customRequest = ({ file, onSuccess, onError }) => {
		let data = new FormData();
		data.append("file", file, file.name);
		data.append("imageTitle", imageTitle);
		api.image.upload(data).then(({ success, name }) => {
			if (success) {
				setNameMapping([
					...nameMapping,
					{
						name,
						uid: file.uid,
					},
				]);
				if (setFileNames && typeof setFileNames === "function")
					setFileNames([...fileNames, name]);
				return onSuccess("ok");
			}
			onError("Not Okay");
		});
	};
	function deleteImageByName(uid) {
		console.log("deletee uid ", uid);
		const onDeleteSuccess = () => {
			let tempNames = nameMapping.filter((each) => each.uid != uid);
			console.log("deletee tempNames ", tempNames);

			setNameMapping([...tempNames]);
			if (setFileNames && typeof setFileNames === "function")
				setFileNames(tempNames.map((each) => each.name));
			// }
			message.success("Image removed Successfully");
		};
		const ImageIndexTobeDeleted = nameMapping.findIndex(
			(each) => each.uid.toString() + "" === uid.toString()
		);

		if (ImageIndexTobeDeleted >= 0) {
			const nameToBeDeleted = nameMapping[ImageIndexTobeDeleted].name;
			api.image
				.delete(nameToBeDeleted)
				.then(onDeleteSuccess)
				.catch((error) => {
					if (error.response.status === 404) {
						onDeleteSuccess();
					}
				});
		}
	}
	const beforeUpload = (file) => {
		const isJpgOrPng = IMAGE_FORMAT_GALLERY.includes(file.type);
		if (!isJpgOrPng) {
			message.error("Please upload valid image!");
			return false;
		}
		const isImageWithinLimitSize =
			file.size / 1024 / 1024 < MAX_GALLERY_IMAGE_SIZE;
		if (!isImageWithinLimitSize) {
			message.error(
				"Image must smaller than " + MAX_GALLERY_IMAGE_SIZE + "MB!"
			);
		}
		return isJpgOrPng && isImageWithinLimitSize;
	};
	return (
		<>
			<Upload
				{...props}
				customRequest={customRequest}
				onRemove={(file) => {
					deleteImageByName(file.uid);
				}}
				action={false}
				fileList={fileList}
				onPreview={handlePreview}
				onChange={handleChange}
				disabled={disabled}
				beforeUpload={beforeUpload}
			>
				{fileList.length >= maxFile ? null : uploadButton}
			</Upload>
			{helperText}
			<Modal
				visible={previewVisible}
				title={previewTitle}
				footer={null}
				onCancel={() => setPreviewVisible(false)}
			>
				<img alt="example" style={{ width: "100%" }} src={previewImage} />
			</Modal>
		</>
	);
}

GalleryUpload.defaultProps = {
	name: "file",
	maxFile: 30,
	// beforeUpload: () => {},
	// action: () => {},
	accept: "image/*",
	multiple: true,
	listType: "picture-card",
};
export default GalleryUpload;
