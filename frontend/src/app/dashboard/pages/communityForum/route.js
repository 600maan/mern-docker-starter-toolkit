// import React from "react";
// import {Redirect} from 'react-router-dom';
import routeURL from "config/routeURL";
import CommunityForum from "./index";
import ItemAdd from "./ItemAdd";
import AnswerItem from "./answerItem";
export default {
  routes: [
    {
      auth: true,
      path: routeURL.cms.community(),
      component: CommunityForum,
    },
    {
      auth: true,
      path: routeURL.cms.community_add(),
      component: ItemAdd,
    },
    {
      auth: true,
      path: routeURL.cms.community_edit(),
      component: ItemAdd,
    },
    {
      auth: true,
      path: routeURL.cms.community_edit_answer(),
      component: AnswerItem,
    },
  ],
};
