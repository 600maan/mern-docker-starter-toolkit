import Icon from "@ant-design/icons";
import { Col, Divider, Row } from "antd";
import {
	RSVP_CONTACT,
	RSVP_ADDRESS,
	RSVP_FAX,
	RSVP_EMAIL,
	FACEBOOK_LINK,
	INSTA_LINK,
} from "config";
import {
	EmailOpenIcon,
	FacebookIcon,
	FAXIcon,
	InstaIcon,
	MarkerAlt,
	PhoneIcon,
} from "image/icon-svg";
import React from "react";
import Container from "../Container";
import "./index.css";
export default function TopHeader() {
	return (
		<Container
			outerStyle={{
				backgroundColor: "#084965",
				minHeight: 50,
				color: "white",
			}}
			className="header__top"
		>
			<Row
				style={{
					width: "100%",
					height: "100%",
					color: "white",
				}}
				justify="space-between"
				align="middle"
			>
				<Col>
					<Row gutter={8} align="middle">
						{[
							{
								icon: MarkerAlt,
								title: RSVP_ADDRESS,
							},
							{
								icon: EmailOpenIcon,
								title: RSVP_EMAIL,
								type: "mail",
							},
							{
								icon: PhoneIcon,
								title: RSVP_CONTACT,
								type: "phone",
							},
							{
								icon: FAXIcon,
								title: RSVP_FAX,
								noBorder: true,
							},
						].map((each) => {
							const menuComp = (
								<Col
									className="top-header-info"
									style={{
										display: "flex",
										flexDirection: "row",
										// justifyItems:"center",
										alignItems: "center",
										borderRight: each.noBorder ? "unset" : "1px solid #dee2e6",
										color: "#fff",
										fontSize: 12,
										cursor: "pointer",
										marginRight: 5,
										paddingRight: 5,
										paddingLeft: 5,
									}}
								>
									<Icon component={each.icon} />
									<span
										className={"top-header-option"}
										style={{
											marginLeft: 8,
										}}
									>
										{each.title}
									</span>
									<Divider type="vertical" />
								</Col>
							);
							if (each.type === "mail") {
								return <a href={`mailto:${each.title}`}>{menuComp}</a>;
							} else if (each.type === "phone") {
								return <a href={`tel://${each.title}`}>{menuComp}</a>;
							}
							return menuComp;
						})}
					</Row>
				</Col>
				<Col className="top-header-social-icon">
					<Row gutter={8}>
						{[
							{
								icon: FacebookIcon,
								url: FACEBOOK_LINK,
								className: "facebook",
							},
							{
								icon: InstaIcon,
								url: INSTA_LINK,
								className: "insta",
							},
						].map((each) => (
							<Col>
								<a href={each.url} target="_blank">
									<span
										className={`social-icon ${each.className}`}
										style={{
											borderRadius: 28,
											border: "1px solid #999",
											cursor: "pointer",
											display: "inline-block",
											height: 28,
											textAlign: "center",
											width: 28,
										}}
									>
										<Icon
											style={{
												color: "#cac6c6",
												fontSize: 12,
												textAlign: "center",
												verticalAlign: "middle",
												width: 28,
											}}
											component={each.icon}
										/>
									</span>
								</a>
							</Col>
						))}
					</Row>
				</Col>
			</Row>
		</Container>
	);
}
