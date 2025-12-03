import ProfileRouterView from './views/profile-router.vue';

/**
 * Profile routes.
 * Defines the routes for the profile section of the application.
 */

/**
 * Array of profile route records.
 * @type {Array<Object>}
 * @property {string} path - Relative path for the route.
 * @property {string} name - Route name.
 * @property {Component} component - Vue component to render.
 * @property {Object} meta - Route metadata (title, requiresAuth).
 */
const profileRoutes = [
    {
        path: 'profile',
        name: 'profile',
        component: ProfileRouterView,
        meta: {
            title: 'My Profile',
            requiresAuth: true
        }
    }
];

export default profileRoutes;