const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
	app.use(
		createProxyMiddleware("/api/imageUpload", {
			target: "http://167.114.4.225:5000/",
			changeOrigin: true,
		})
	);
	app.use(
		createProxyMiddleware("/api", {
			target: "http://localhost:5000/",
			changeOrigin: true,
		})
	);
};
