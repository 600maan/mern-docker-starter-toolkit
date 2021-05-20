import React from "react";
import Container from "app/web/components/Container";
import { Link } from "react-router-dom";
import routeURL from "config/routeURL";
export default function Product404() {
	return (
		<div
			id="wrapper-content"
			style={{
				padding: "100px 0px",
			}}
			className="content-wrap wrapper-content bg-gray-04 pb-0"
		>
			<Container>
				<div className="text-center">
					<div className="mb-7">
						<h1
							className="text-blue"
							style={{ fontSize: 105, color: "#084965" }}
						>
							404
						</h1>
					</div>
					<div className="mb-7">
						<h3 className="mb-7">Item Not Found</h3>
						<div className="text-gray">
							It seems we can’t find what you’re looking for. Go back to{" "}
							<Link
								to={routeURL.web.home()}
								className="text-primary text-decoration-underline"
							>
								Homepage
							</Link>
							.
						</div>
					</div>
				</div>
			</Container>
		</div>
	);
}
