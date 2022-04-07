import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/home",
    component: () => import('@/components/Layout/ToolBar/index.vue'),
    children: [
      {
        path: "home",
        name: "Home",
        component: () => import("@/views/home.vue"),
      },
      {
        path: "earth",
        name: "Earth",
        component: () => import("@/views/earth.vue"),
      },
      {
        path: "room",
        name: "Room",
        component: () => import("@/views/room.vue"),
      },
      {
        path: "city",
        name: "City",
        component: () => import("@/views/city.vue"),
      },
      {
        path: "building",
        name: "Building",
        component: () => import("@/views/building.vue"),
      },
      {
        path: "gongfang",
        name: "Gongfang",
        component: () => import ("@/views/gongfang.vue")
      }
    ]
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
