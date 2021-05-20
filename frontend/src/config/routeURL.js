export default {
	cms: {
		home: () => "/admin",
		login: () => "/admin/login",
		rsvp_order: () => "/admin/rsvp-order",
		contact_message: () => "/admin/contact-message",
		job_application: () => "/admin/job-application",
		account: () => "/admin/my-account",
		error404: () => "/admin/errors/error-404",
		food_and_beverage: () => "/admin/food-and-beverage",
		food_and_beverage_add: () => `/admin/food-and-beverage/add`,
		food_and_beverage_edit: (itemId) =>
			`/admin/food-and-beverage/edit/${itemId ? itemId : ":itemId"}`,
		beauty_and_medicals: () => "/admin/beauty-and-medicals",
		beauty_and_medicals_add: () => `/admin/beauty-and-medicals/add`,
		beauty_and_medicals_edit: (itemId) =>
			`/admin/beauty-and-medicals/edit/${itemId ? itemId : ":itemId"}`,
		tours_and_travels: () => "/admin/tours-and-travels",
		tours_and_travels_add: () => `/admin/tours-and-travels/add`,
		tours_and_travels_edit: (itemId) =>
			`/admin/tours-and-travels/edit/${itemId ? itemId : ":itemId"}`,
		retailer_and_wholesale: () => "/admin/retailer-and-wholesale",
		retailer_and_wholesale_add: () => `/admin/retailer-and-wholesale/add`,
		retailer_and_wholesale_edit: (itemId) =>
			`/admin/retailer-and-wholesale/edit/${itemId ? itemId : ":itemId"}`,
		rsvp_product: () => "/admin/rsvp-product",
		rsvp_product_add: () => `/admin/rsvp-product/add`,
		rsvp_product_edit: (itemId) =>
			`/admin/rsvp-product/edit/${itemId ? itemId : ":itemId"}`,
		community: () => "/admin/community",
		community_add: () => `/admin/community/add`,
		community_edit: (itemId) =>
			`/admin/community/edit/${itemId ? itemId : ":itemId"}`,
		community_edit_answer: (questionId, threadid, ) =>
			`/admin/community-answer/${questionId ? questionId : ":questionId"}/${
				threadid ? threadid : ":itemId"
			}`,
		jobs: () => "/admin/jobs",
		jobs_add: () => `/admin/jobs/add`,
		jobs_edit: (itemId) => `/admin/jobs/edit/${itemId ? itemId : ":itemId"}`,
		user_management: () => "/admin/user-management",
		user_management_add: () => `/admin/user-management/add`,
		user_management_edit: (userId) =>
			`/admin/user-management/edit/${userId ? userId : ":userId"}`,
		client_list: () => "/admin/client-list",
		log: () => "/admin/log-list",
	},
	web: {
		home: () => "/",
		forget_password: () => "/forget-password",
		forget_username: () => "/forget-username",
		confirm_email: () => "/confirm-email",
		aboutUs: () => "/about-us",
		contactUs: () => "/contact-us",
		error404: () => "/errors/error-404",
		client_login: () => "/login",
		client_register: () => "/register",
		food_and_beverage: () => "/food-and-beverage",
		food_and_beverage_detail: (itemId) =>
			`/food-and-beverage/${itemId || ":itemId"}`,
		health_and_beauty: () => "/health-and-beauty",
		health_and_beauty_detail: (itemId) =>
			`/health-and-beauty/${itemId || ":itemId"}`,
		tours_and_travels: () => "/tours-and-travels",
		tours_and_travels_detail: (itemId) =>
			`/tours-and-travels/${itemId || ":itemId"}`,
		retailer_and_wholesale: () => "/retailer-and-wholesale",
		retailer_and_wholesale_detail: (itemId) =>
			`/retailer-and-wholesale/${itemId || ":itemId"}`,
		rsvp_product: () => "/rsvp-product",
		rsvp_product_detail: (itemId) => `/rsvp-product/${itemId || ":itemId"}`,
		jobs: () => "/jobs",
		jobs_detail: (itemId) => `/jobs/${itemId || ":itemId"}`,
		community: () => "/community",
		community_detail: (itemId) => `/community/${itemId || ":itemId"}`,
		user_agreement: () => "/user-agreement",
		privacy_policy: () => "/privacy-policy",
		user_profile: () => "/user-profile",
	},
};
