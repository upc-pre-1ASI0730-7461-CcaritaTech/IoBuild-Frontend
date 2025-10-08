const projectDetails = () => import("./views/project-details.vue");
const projectForm = () => import("./views/project-form.vue");
const projectGrid = () => import("./views/project-grid.vue");

const projectsRoutes=[
    {
        path: 'projects-management',
        name: 'projects-management',
        component: projectGrid,
        meta: { title: 'Projects' }
    },
    {
        path: 'projects-management/new',
        name: 'projects-management-new',
        component: projectForm,
        meta: { title: 'New Project' }
    },
    {
        path: 'projects-management/:id',
        name: 'projects-management-details',
        component: projectDetails,
        meta: { title: 'Project Details' }
    },
    {
        path: 'projects-management/:id/edit',
        name: 'projects-management-edit',
        component: projectForm,
        meta: { title: 'Edit Project' }
    }
];

export default projectsRoutes;