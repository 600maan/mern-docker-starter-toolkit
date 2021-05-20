import { notification } from "antd";

export function notificationError(description,message="Failed") {
	return notification.error({
		message,
		description,
		style: {
			zIndex: 10000,
			backgroundColor: "#ffcdd2",
		},
	});
}

export function notificationSuccess(description, message = "Success") {
	return notification.success({
		duration: 6,
		message,
		description,
		style: {
			zIndex: 10000,
			backgroundColor: "#c8e6c9",
		},
	});
}
