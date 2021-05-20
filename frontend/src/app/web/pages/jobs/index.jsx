import api from "app/web/api";
import CategoryPageLayout from "app/web/components/CategoryPageLayout";
import routeURL from "config/routeURL";
import JobCard from "../common/JobCard";
import config, { JOBS_PAGE_TITLE } from "config";
import React, { useContext, useEffect } from "react";
import { UserContext, UserLoginContext } from "context/";
import UnAuthorized from "../../components/Error/UnAuthorized";
import EmailConfirmation from "app/web/components/EmailConfirmation";

export default function JobsPage() {
	const [isVisible, setVisible, tab, setTab] = useContext(UserLoginContext);
	const { clientStore, clientDispatch } = useContext(UserContext);
	const isAuth = clientStore.isAuthenticated;

	useEffect(() => {
		if (!isAuth) {
			setTab("1");
			setVisible(true);
		}
	}, [isAuth]);

	return isAuth === undefined ? null : isAuth ? (
		<EmailConfirmation>
			<CategoryPageLayout
				title={JOBS_PAGE_TITLE}
				apiURL={{
					get: api.jobs.readAll,
				}}
			>
				{(item) => (
					<JobCard
						title={item.title}
						detailLink={routeURL.web.jobs_detail(item._id)}
						media={config.getImageHost(item.logoImage)}
						workTime={item.workTime}
						companyName={item.companyName}
						workingLocation={item.workingLocation}
						salary={item.salary}
					/>
				)}
			</CategoryPageLayout>
		</EmailConfirmation>
	) : (
		<UnAuthorized />
	);
}
