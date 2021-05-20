import React from "react";
import QuestionList from "./questionList";
import AnswerList from "./answerList";
import { Tabs } from "antd";

const { TabPane } = Tabs;

export default function index() {
	return (
		<Tabs defaultActiveKey="1" centered size="large">
			<TabPane tab="Questions" key="1">
				<QuestionList />
			</TabPane>
			<TabPane tab="Comments" key="2">
				<AnswerList />
			</TabPane>
		</Tabs>
	);
}
