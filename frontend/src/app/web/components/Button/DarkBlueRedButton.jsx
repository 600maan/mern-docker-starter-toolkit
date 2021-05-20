import { Button } from "antd";
import React from "react";
import "./index.css";
export default function DarkBlueRedButton({
	onClick,
	shape = "round",
	children,
	style,
	className,
	...props
}) {
	return (
		<Button
			onClick={onClick}
			className={"dark-blue-red-button " + className}
			shape={shape}
			style={{
				background: "#084965",
				color: "#fff",
				paddingLeft: 22,
				paddingRight: 22,
				fontWeight: 600,
				minHeight: 37,
				border: "none",
				...style,
			}}
			{...props}
		>
			{children}
		</Button>
	);
}
