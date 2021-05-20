import axios from "axios";
import config from "config";

let api = axios.create({
	baseURL: config.API_HOST,
});

const url = {
	auth_admin: "/api/admin",
	food_and_beverage: "/api/foodAndBeverage",
	beauty_and_medicals: "/api/beautyAndHealth",
	tours_and_travels: "/api/travelAndTour",
	retailer_and_wholesale: "/api/retailAndWholesale",
	rsvp_product: "/api/rsvpProduct",
	rsvp_order: "/api/rsvpOrder",
	community: "/api/communityForum",
	jobs: "/api/jobsPortal",
	jobs_application: "/api/jobsApplication",
	image: "/api/imageUpload",
	log: "/api/log",
	contact_message: "/api/contactMessage",
	dashbaord: "/api/dashboard",
	client: "/api/client",
	send_email: "/api/email",
	client_logging: "/api/clientLogging",
};

const parse_res = (api) =>
	new Promise((resolve, reject) => {
		api.then((res) => resolve(res.data)).catch((err) => reject(err));
	});

const generateParams = (params) => {
	let query = "";
	if (params) {
	}
	return query;
};

export default {
	baseAxios: api,
	clientLoggingURL: {
		send: (errorMessage) =>
			parse_res(
				api.post(`${url.client_logging}/log-client-errors`, {
					errorMessage,
				})
			),
	},
	dashbaord: {
		countService: () => parse_res(api.get(`${url.dashbaord}/count`)),
	},
	email: {
		send: (emailData) =>
			parse_res(api.post(`${url.send_email}/send`, emailData)),
	},
	image: {
		upload: (image) => parse_res(api.post(`${url.image}/upload`, image)),
		delete: (fileName) => parse_res(api.delete(`${url.image}/${fileName}`)),
	},
	auth: {
		admin: {
			authenticate: (emailOrUsername, password) =>
				api.post(`${url.auth_admin}/login`, { emailOrUsername, password }),
			register: (user) =>
				parse_res(api.post(`${url.auth_admin}/register`, user)),
			editUser: (user) =>
				parse_res(api.post(`${url.auth_admin}/editUser`, user)),
			changePassword: (user) =>
				parse_res(api.post(`${url.auth_admin}/changePassword`, user)),
			read: (userId) => parse_res(api.get(`${url.auth_admin}/id/${userId}`)),
			currentUser: () => parse_res(api.get(`${url.auth_admin}/current`)),
			readAll: () => parse_res(api.get(`${url.auth_admin}/list`)),
			delete: (adminId) =>
				parse_res(api.delete(`${url.auth_admin}/${adminId}`)),
			deleteMany: (ids) =>
				parse_res(api.post(`${url.auth_admin}/many`, { ids })),
		},
	},
	food_and_beverage: {
		save: (data) => parse_res(api.post(`${url.food_and_beverage}/`, data)),
		read: (itemId) =>
			parse_res(api.get(`${url.food_and_beverage}/id/${itemId}`)),
		readAll: () => parse_res(api.get(`${url.food_and_beverage}/`)),
		delete: (itemId) =>
			parse_res(api.delete(`${url.food_and_beverage}/${itemId}`)),
		deleteMany: (ids) =>
			parse_res(api.post(`${url.food_and_beverage}/many`, { ids })),
		toggle: (itemId, toggleStatus) =>
			parse_res(
				api.put(`${url.food_and_beverage}/toggle/${itemId}/${toggleStatus}`)
			),
		isUnique: (uniqueKey, value, itemId) =>
			parse_res(
				api.get(
					`${url.food_and_beverage}/is-unique/${uniqueKey}/${value}/${itemId}`
				)
			),
	},
	beauty_and_medicals: {
		save: (data) => parse_res(api.post(`${url.beauty_and_medicals}/`, data)),
		read: (itemId) =>
			parse_res(api.get(`${url.beauty_and_medicals}/id/${itemId}`)),
		readAll: () => parse_res(api.get(`${url.beauty_and_medicals}/`)),
		delete: (itemId) =>
			parse_res(api.delete(`${url.beauty_and_medicals}/${itemId}`)),
		deleteMany: (ids) =>
			parse_res(api.post(`${url.beauty_and_medicals}/many`, { ids })),
		toggle: (itemId, toggleStatus) =>
			parse_res(
				api.put(`${url.beauty_and_medicals}/toggle/${itemId}/${toggleStatus}`)
			),
		isUnique: (uniqueKey, value, itemId) =>
			parse_res(
				api.get(
					`${url.beauty_and_medicals}/is-unique/${uniqueKey}/${value}/${itemId}`
				)
			),
	},
	tours_and_travels: {
		save: (data) => parse_res(api.post(`${url.tours_and_travels}/`, data)),
		read: (itemId) =>
			parse_res(api.get(`${url.tours_and_travels}/id/${itemId}`)),
		readAll: () => parse_res(api.get(`${url.tours_and_travels}/`)),
		delete: (itemId) =>
			parse_res(api.delete(`${url.tours_and_travels}/${itemId}`)),
		deleteMany: (ids) =>
			parse_res(api.post(`${url.tours_and_travels}/many`, { ids })),
		toggle: (itemId, toggleStatus) =>
			parse_res(
				api.put(`${url.tours_and_travels}/toggle/${itemId}/${toggleStatus}`)
			),
		isUnique: (uniqueKey, value, itemId) =>
			parse_res(
				api.get(
					`${url.tours_and_travels}/is-unique/${uniqueKey}/${value}/${itemId}`
				)
			),
	},
	rsvp_product: {
		save: (data) => parse_res(api.post(`${url.rsvp_product}/`, data)),
		read: (itemId) => parse_res(api.get(`${url.rsvp_product}/id/${itemId}`)),
		readAll: () => parse_res(api.get(`${url.rsvp_product}/`)),
		delete: (itemId) => parse_res(api.delete(`${url.rsvp_product}/${itemId}`)),
		deleteMany: (ids) =>
			parse_res(api.post(`${url.rsvp_product}/many`, { ids })),
		toggle: (itemId, toggleStatus) =>
			parse_res(
				api.put(`${url.rsvp_product}/toggle/${itemId}/${toggleStatus}`)
			),
		isUnique: (uniqueKey, value, itemId) =>
			parse_res(
				api.get(`${url.rsvp_product}/is-unique/${uniqueKey}/${value}/${itemId}`)
			),
	},
	rsvp_order: {
		read: (itemId) => parse_res(api.get(`${url.rsvp_order}/id/${itemId}`)),
		readAll: () => parse_res(api.get(`${url.rsvp_order}/`)),
		delete: (itemId) => parse_res(api.delete(`${url.rsvp_order}/${itemId}`)),
		deleteMany: (ids) => parse_res(api.post(`${url.rsvp_order}/many`, { ids })),
		toggle: (itemId, toggleStatus) =>
			parse_res(api.put(`${url.rsvp_order}/toggle/${itemId}/${toggleStatus}`)),
	},
	community: {
		save: (data) => parse_res(api.post(`${url.community}/`, data)),
		saveAnswer: (data) =>
			parse_res(api.post(`${url.community}/threadAnswer`, data)),
		read: (itemId) => parse_res(api.get(`${url.community}/threadId/${itemId}`)),
		readQuestion: (itemId) =>
			parse_res(api.get(`${url.community}/thread-question/${itemId}`)),
		readAll: () => parse_res(api.get(`${url.community}/`)),
		readAllQuestions: () => parse_res(api.get(`${url.community}/questionList`)),
		delete: (itemId) => parse_res(api.delete(`${url.community}/${itemId}`)),
		deleteMany: (ids) => parse_res(api.post(`${url.community}/many`, { ids })),
		deleteReply: (itemId) =>
			parse_res(api.delete(`${url.community}/thread-reply/${itemId}`)),
		deleteManyReply: (ids) =>
			parse_res(api.post(`${url.community}/thread-reply/many`, { ids })),
		toggle: (itemId, toggleStatus) =>
			parse_res(api.put(`${url.community}/toggle/${itemId}/${toggleStatus}`)),
		toggleAnswer: (itemId, toggleStatus) =>
			parse_res(
				api.put(`${url.community}/toggle-answer/${itemId}/${toggleStatus}`)
			),
	},
	jobs: {
		save: (data) => parse_res(api.post(`${url.jobs}/`, data)),
		read: (itemId) => parse_res(api.get(`${url.jobs}/id/${itemId}`)),
		readAll: () => parse_res(api.get(`${url.jobs}/`)),
		delete: (itemId) => parse_res(api.delete(`${url.jobs}/${itemId}`)),
		deleteMany: (ids) => parse_res(api.post(`${url.jobs}/many`, { ids })),
		toggle: (itemId, toggleStatus) =>
			parse_res(api.put(`${url.jobs}/toggle/${itemId}/${toggleStatus}`)),
		isUnique: (uniqueKey, value, itemId) =>
			parse_res(
				api.get(`${url.jobs}/is-unique/${uniqueKey}/${value}/${itemId}`)
			),
	},
	jobs_application: {
		read: (itemId) =>
			parse_res(api.get(`${url.jobs_application}/id/${itemId}`)),
		readAll: () => parse_res(api.get(`${url.jobs_application}/`)),
		delete: (itemId) =>
			parse_res(api.delete(`${url.jobs_application}/${itemId}`)),
		deleteMany: (ids) =>
			parse_res(api.post(`${url.jobs_application}/many`, { ids })),
		toggle: (itemId, toggleStatus) =>
			parse_res(
				api.put(`${url.jobs_application}/toggle/${itemId}/${toggleStatus}`)
			),
	},
	retailer_and_wholesale: {
		save: (data) => parse_res(api.post(`${url.retailer_and_wholesale}/`, data)),
		read: (itemId) =>
			parse_res(api.get(`${url.retailer_and_wholesale}/id/${itemId}`)),
		readAll: () => parse_res(api.get(`${url.retailer_and_wholesale}/`)),
		delete: (itemId) =>
			parse_res(api.delete(`${url.retailer_and_wholesale}/${itemId}`)),
		deleteMany: (ids) =>
			parse_res(api.post(`${url.retailer_and_wholesale}/many`, { ids })),
		toggle: (itemId, toggleStatus) =>
			parse_res(
				api.put(
					`${url.retailer_and_wholesale}/toggle/${itemId}/${toggleStatus}`
				)
			),
		isUnique: (uniqueKey, value, itemId) =>
			parse_res(
				api.get(
					`${url.retailer_and_wholesale}/is-unique/${uniqueKey}/${value}/${itemId}`
				)
			),
	},
	log: {
		readAll: () => parse_res(api.get(`${url.log}/all`)),
	},
	contact_message: {
		read: (itemId) => parse_res(api.get(`${url.contact_message}/id/${itemId}`)),
		readAll: () => parse_res(api.get(`${url.contact_message}/`)),
		delete: (itemId) =>
			parse_res(api.delete(`${url.contact_message}/${itemId}`)),
		deleteMany: (ids) =>
			parse_res(api.post(`${url.contact_message}/many`, { ids })),
		toggle: (itemId, toggleStatus) =>
			parse_res(
				api.put(`${url.contact_message}/toggle/${itemId}/${toggleStatus}`)
			),
	},
	client: {
		read: (itemId) => parse_res(api.get(`${url.client}/id/${itemId}`)),
		readAll: () => parse_res(api.get(`${url.client}/list`)),
		delete: (itemId) => parse_res(api.delete(`${url.client}/${itemId}`)),
		deleteMany: (ids) => parse_res(api.post(`${url.client}/many`, { ids })),
		toggle: (itemId, toggleStatus) =>
			parse_res(api.put(`${url.client}/toggle/${itemId}/${toggleStatus}`)),
	},
};
