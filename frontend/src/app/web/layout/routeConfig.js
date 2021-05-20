import appsConfigs from "app/web/pages/route";
import { generateRoutesFromConfigs } from "services/route";

export default [...generateRoutesFromConfigs(appsConfigs)];
