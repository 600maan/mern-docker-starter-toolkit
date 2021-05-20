import { Col, Row } from "antd";
import React from "react";

export default function Container({
	className,
	outerStyle,
	innerStyle,
	children,
	reference,
	justify = "center",
	...props
}) {
	return (
		<Row
			className={className}
			style={{
				width: "100%",
				// backgroundColor: "white",
				paddingLeft: 10,
				paddingRight: 10,
				...outerStyle,
			}}
			justify={justify}
			ref={reference}
			{...props}
		>
			<Col
				xs={24}
				md={22}
				lg={21}
				xl={20}
				style={{
					maxWidth: 1200,
					...innerStyle,
				}}
			>
				{children}
			</Col>
		</Row>
	);
}
