import {createRouter, createWebHistory} from "vue-router";
import monitoringRoutes from "./monitoring/presentation/monitoring-routes.js";
import automationRoutes from "./automation/presentation/automation-routes.js";
import subscriptionsRoutes from "./suscriptions/presentation/subscriptions-routes.js";
import profilesRoutes from "./profiles/presentation/profiles-routes.js";
import projectsRoutes from "./projects/presentation/projects-routes.js";

const routes = [
    {
        path:'/monitoring',
        name:'monitoring',
        children: monitoringRoutes
    },
    {
        path: '/automation',
        name: 'automation',
        children: automationRoutes
    },
    {
        path: '/profiles',
        name: 'profiles',
        children: profilesRoutes
    },
    {
        path: '/projects',
        name: 'projects',
        children:  projectsRoutes
    },
    {
        path: '/subscriptions',
        name: 'subscriptions',
        children:  subscriptionsRoutes
    },
    {
        path: '/configuration',
        name: 'configuration',
        component: () => import('./shared/presentation/views/configuration.vue'),
    },
    {
        path: '/',
        redirect: '/monitoring/dashboard'
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('./shared/presentation/views/page-not-found.vue'),
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes
});

router.beforeEach((to, from, next) => {
    console.log(`Navigating from ${from.name} to ${to.name}`);
    let baseTitle = 'IoBuild';
    document.title = `${baseTitle} - ${to.meta['title'] || ''}`;
    next();
});

export default router;