const subscriptionsRoutes = [
    {
        path: "payments",
        name: "payments",
        component: () => import("./views/payments.vue"),
    }
    ];
export default subscriptionsRoutes;