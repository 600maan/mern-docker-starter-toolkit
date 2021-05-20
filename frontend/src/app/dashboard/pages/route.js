import homeAppConfig from "./home/route";
import userManagementConfig from "./user_management/route";
import BeautyHealth from "./beautyMedicals/route";
import FoodAndBeverage from "./foodBeverage/route";
import ToursTravel from "./toursTravels/route";
import RetailerWholesale from "./retailerWholesale/route";
import RVSPProduct from "./rvspProduct/route";
import CommunityForum from "./communityForum/route";
import Jobs from "./jobs/route";
import MyAccountPage from "./myAccount/route";
import Log from "./log/route";
import RSVPOrderPage from "./rsvpOrder/route";
import ContactMessagePage from "./contactMessage/route";
import JobsApplicationPage from "./jobApplication/route";
import ClientListPage from "./clientList/route";


export default [
	homeAppConfig,
	userManagementConfig,
	FoodAndBeverage,
	BeautyHealth,
	ToursTravel,
	RetailerWholesale,
	RVSPProduct,
	RSVPOrderPage,
	CommunityForum,
  Jobs,
  JobsApplicationPage,
	MyAccountPage,
	Log,
	ContactMessagePage,
	ClientListPage
];
