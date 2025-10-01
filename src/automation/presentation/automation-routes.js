const automationRoutes = [
    {
        path: "device-management",
        name: "DeviceManagement",
        component: () => import("./views/device-management.vue"),
    }
]

export default automationRoutes;