// Lazy-loaded components
const Dashboard = () => import('./views/dashboard.vue');

const monitoringRoutes = [
    {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { 
            title: 'Dashboard IoBuilt',
            requiresAuth: true
        }
    }
]

export default monitoringRoutes;