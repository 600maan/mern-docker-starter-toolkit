import appsConfigs from "app/dashboard/pages/route";
import { generateRoutesFromConfigs } from "services/route";

export default [...generateRoutesFromConfigs(appsConfigs)];
