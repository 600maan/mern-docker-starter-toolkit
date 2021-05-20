import React from "react";
import { Link } from "react-router-dom";
import { AvatarIcon } from "app/dashboard/components";
import { Avatar, Row, Col, Tag } from "antd";
export default function SingleComment({
	linkToNavigate,
	userIcon,
	author,
	dateTime,
	comment,
	repliesLength,
	isAdmin,
}) {
	const commentComponent = (
		<div className="c-info">
			{/* {userIcon ? (
				<div className="c-avatar">
				<img src={userIcon} />
				</div>
				) : (
					<Avatar
					size={32}
					icon={<AvatarIcon />}
					style={{ marginRight: "15px" }}
					/>
				)} */}
			<Row align="middle">
				<Col>
					<Avatar
						size={32}
						icon={<AvatarIcon />}
						style={{ marginRight: "15px" }}
					/>
				</Col>
				<Col>
					<div className="avatar-info">
						{author && <strong>{author} </strong>}
						{isAdmin && (
							<Tag
								style={{
									margin: "0px 5px",
								}}
								size="small"
								color="blue"
							>
								Admin
							</Tag>
						)}
						{dateTime !== false && <span>Posted on {dateTime}</span>}
					</div>
				</Col>
			</Row>
			<div
				className="q-details"
				style={{
					marginTop: 8,
				}}
			>
				<h5>{comment}</h5>
				{repliesLength !== false && (
					<div className="post-footer-option">
						<ul className="list-unstyled">
							<li title="comment">
								<i className="fas fa-comment" />
								{repliesLength} {repliesLength > 1 ? "comments" : "comment"}
							</li>
						</ul>
					</div>
				)}
			</div>
		</div>
	);
	if (linkToNavigate)
		return (
			<div className="community-center-panel card">
				<Link to={linkToNavigate}>{commentComponent}</Link>
			</div>
		);
	return commentComponent;
}
