import { ArrowUpOutlined } from "@ant-design/icons";
import {
	FACEBOOK_LINK,
	INSTA_LINK,
	RSVP_ADDRESS_FOOTER,
	RSVP_ADDRESS_FOOTER_COUNTRY,
	RSVP_CONTACT,
	RSVP_COUNTRY_CODE,
	RSVP_EMAIL,
} from "config";
import routeURL from "config/routeURL";
import React from "react";
import { Link } from "react-router-dom";
import "../../layout/style.css";
import Container from "../Container";

export default function Footer() {
	return (
		<footer
			className="main-footer main-footer-style-02"
			style={{
				fontFamily: "work sans, sans-serif",
				letterSpacing: "-0.015em",
				fontWeight: 400,
				lineHeight: 1.7,
			}}
		>
			<div className="footer-second">
				<Container>
					<div className="row">
						<div className="col-sm-6 col-lg-4 mb-5 mb-lg-0 ">
							<h6 className="text-white">About Us</h6>
							<p
								className=" mb-0"
								style={{
									fontSize: 16,
								}}
							>
								RSVP Hongkong provides service to connect products,services, and
								consumer in one single Platform. Both Products/Services and
								consumers are our members and with RSVP HK membership both are
								facilitated with benefits.
							</p>
						</div>
						<div className="col-sm-6 col-lg-4 mb-5 mb-lg-0 footer-col text-center">
							<h5 className="mb-4 text-white">Company</h5>
							<ul className="list-group list-group-flush list-group-borderless">
								<li
									className="list-group-item px-0 lh-14 bg-transparent py-1"
									style={{
										fontSize: 16,
									}}
								>
									<Link
										className="link-hover-gray-white"
										to={routeURL.web.aboutUs()}
									>
										About Us
									</Link>
								</li>
								<li className="list-group-item px-0 lh-14 bg-transparent py-1">
									<Link
										className="link-hover-gray-white"
										to={routeURL.web.contactUs()}
									>
										Contact Us
									</Link>
								</li>
							</ul>
						</div>
						<div className="col-sm-6 col-lg-4 footer-col">
							<h5 className="mb-4 text-white">Connect</h5>
							<div
								className="text-white"
								style={{
									fontSize: 16,
								}}
							>
								{RSVP_ADDRESS_FOOTER}
								<br />
								{RSVP_ADDRESS_FOOTER_COUNTRY}
								<br />
								{RSVP_EMAIL}
								<br />
								{`(${RSVP_COUNTRY_CODE}) - ${RSVP_CONTACT}`}
							</div>
						</div>
					</div>
				</Container>
			</div>
			<div className="footer-last ">
				<Container>
					<div className="footer-last-container row ">
						<div className="col-lg-8">
							<div
								className="copy-right text-gray"
								style={{
									fontSize: 16,
								}}
							>
								© 2020{" "}
								<Link
									className="text-white font-weight-semibold"
									to={routeURL.web.home()}
								>
									RSVP
								</Link>{" "}
								All Rights Resevered.
							</div>
						</div>
						<div className="col-lg-4">
							<div>
								<span className="d-inline-block mr-4">Follow us on:</span>
								<a href={FACEBOOK_LINK} target="_blank">
									<span role="img" className style={{ fontSize: 18 }}>
										<svg width="1em" height="1em" viewBox="0 0 320 512">
											<path
												fill="currentColor"
												d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"
											/>
										</svg>
									</span>
								</a>
								<a href={INSTA_LINK} target="_blank">
									<span
										role="img"
										className
										style={{ fontSize: 18, marginLeft: 8 }}
									>
										<svg width="1em" height="1em" viewBox="0 0 448 512">
											<path
												fill="currentColor"
												d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"
											/>
										</svg>
									</span>
								</a>
							</div>
						</div>
					</div>
				</Container>
				<div className="back-top text-left text-md-right">
					<a className="gtf-back-to-top" href="#">
						<ArrowUpOutlined />
					</a>
				</div>
			</div>
		</footer>
	);
}
