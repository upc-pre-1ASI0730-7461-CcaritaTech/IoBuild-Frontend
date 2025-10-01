

const profilesRoutes= [
    {
        path: 'profile',
        name: 'Profile',
        component: () => import('./views/profile.vue'),
        meta: { title: 'Dashboard' }
    }
]

export default profilesRoutes;