export default {
	API_HOST:
		process.env.NODE_ENV === "production"
			? process.env.REACT_APP_API_HOST_PRODUCTION
			: process.env.REACT_APP_API_HOST_DEVELOPMENT,
	getImageHost: (fileName) =>
		process.env.NODE_ENV === "production"
			? process.env.REACT_APP_API_HOST_PRODUCTION +
			  "/api/imageUpload/image/" +
			  fileName
			: process.env.REACT_APP_API_HOST_DEVELOPMENT +
			  "/api/imageUpload/image/" +
			  fileName,
};
