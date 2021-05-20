// import React from "react";
// import {Redirect} from 'react-router-dom';
import routeURL from "config/routeURL";
import Logs from "./index";
export default {
  routes: [
    {
      auth: true,
      path: routeURL.cms.log(),
      component: Logs,
    },
  ],
};
