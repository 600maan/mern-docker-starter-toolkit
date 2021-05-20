import React, { useEffect } from "react";

export default function AboutUs() {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	return (
		<div id="wrapper-content" className="page-about wrapper-content pt-0 pb-0">
			<div className="banner">
				<div className="container">
					<div className="banner-content text-center">
						<div className="heading" data-animate="fadeInDown">
							<h1 className="mb-0 text-white">
								Community is not readymade,
								<br />
								It's built through Friendship,love and loyality
							</h1>
						</div>
					</div>
				</div>
			</div>
			<div className="about-intro text-center ">
				<div className="container">
					<div className="jumbotron mb-9 bg-transparent p-0 text-dark">
						<h3>ABOUT US</h3>
						<p className="lead mb-0 font-size-lg font-weight-normal lh-18">
							{" "}
							RSVP Hongkong provides service to connect products,services, and
							consumer in one single Platform. Both Products/Services and
							consumers are our members and with RSVP HK membership both are
							facilitated with benefits.Consumers to choose from our wide range
							of products and professional services at their finger tips with
							privileged discounts and other facilities.Like wise products and
							services are introduced and advertised to consumers unlimited.
						</p>
					</div>
				</div>
			</div>
			<section className="vission-video  bg-white">
				<div className="container">
					<div className="row">
						<div className="col-md-12 video-wrapper text-white  text-center">
							<h3>Special Feature</h3>
							<p>
								Ask us an exclusive channel wherer we try to answer your queries
								or community answers on behalf of RSVP HK.
							</p>
							<p>
								Dedicated staff to answer your job vacancy related queries and
								trainings(Only for HongKong locals)
							</p>
						</div>
						<div className="col-md-3  mission-grid"></div>
						<div className="col-md-6 history-bg  mission-grid">
							<h3 className="text-lg-heading  text-white text-center">
								Our Mission
							</h3>
							<p className="text-justify">
								Our mission target is to develop a platform and keep upgrading
								for a community integration.
							</p>
							<p className="text-justify">
								A community which is self sufficient, which can offers one
								another with products, housemade product,
								services,marketing,advertisements,jobs etc within the community
								itself.
							</p>
							<p className="text-justify">
								And even a platform to barter goods and services among the
								community
							</p>
							<p className="text-justify">
								A realisation of friendship and unity as a humankind where
								caste, creed and colour would not matter nor influence.
							</p>
						</div>
						<div className="col-md-3  mission-grid"></div>
					</div>
				</div>
			</section>
			<div id="facts-box" className="pt-5 facts-box">
				<div className="container">
					<h3 className="mb-7 text-center">OUR SERVICES</h3>
					<div className="row pb-5 our-services">
						{[
							{
								image: "https://img.icons8.com/metro/70/084965/discount.png",
								title: "Membership",
								description:
									"Discount and priviliged service for membership card holders",
							},
							{
								image:
									"https://img.icons8.com/ios-filled/70/084965/calendar.png",
								title: "Event Organise",
								description:
									"RSVP HK will organise Major Events with local and international start cast, educational and recreational fun fair to food fest etc.",
							},
							{
								image:
									"https://img.icons8.com/wired/70/084965/event-accepted.png",
								title: "Event Management",
								description:
									"Event management to the creation and development of small and / or a large -scale personal and corporate events.",
							},
							{
								image: "https://img.icons8.com/ios/70/084965/online-order.png",
								title: "Online shopping",
								description: "Online shopping products range",
							},
						].map((service) => (
							<div className="col-sm-6 col-md-3 mb-5 mb-lg-0 ">
								<div
									style={{
										height: "100%",
									}}
									className="icon-box text-center card shadow  equal-height"
								>
									<div className="icon-box-icon text-primary mb-8 ">
										<img src={service.image} />
									</div>
									<h6>{service.title}</h6>
									<p>{service.description}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
