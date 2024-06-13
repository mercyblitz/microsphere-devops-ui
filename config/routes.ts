import component from "@/locales/en-US/component";

export default [
  {
    path: "/user",
    layout: false,
    routes: [
      {
        path: "/user",
        routes: [
          {
            name: "login",
            path: "/user/login",
            component: "./user/Login",
          },
          {
            component: "./404",
          },
        ],
      },
    ],
  },
  {
    name: "app",
    path: "/app",
    icon: "home",
    routes: [
      {
        path: "/app/clusters",
        name: "clusters",
        component: "./app/clusters",
      },
      {
        path: "/app/cluster/:id",
        name: "cluster-details",
        component: "./app/cluster-details",
      },
      {
        path: "/app/application/:id",
        name: "application-details",
        component: "./app/application-details",
      },
      {
        component: "./404",
      },
    ],
  },
  {
    name: "i18n",
    path: "/i18n",
    icon: "home",
    routes: [
      {
        path: "/i18n/sources",
        name: "sources",
        component: "./i18n/sources",
      },
      {
        component: "./404",
      },
    ],
  },
  {
    path: "/",
    redirect: "/app/clusters",
  },
  {
    component: "./404",
  },
];
