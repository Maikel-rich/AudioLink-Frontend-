export const ROUTES = {
    LANDING: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    PRODUCER_PROFILE: '/producer/:id',
    MY_STUDIO: '/my-studio',
    SEARCH: "/home",
    FINISHED_PROJECTS: "/finishedProjects",
    MESSAGES: "/messages",
    PROJECTS: "/projects",
    SENT_PROPOSALS: "/proposals",
    PRODUCER_PROPOSALS: "/producer/proposals",
    SETTINGS: "/settings"
};

export const ARTIST_ONLY_ROUTES = [
    ROUTES.SEARCH,
    ROUTES.FINISHED_PROJECTS,
    ROUTES.SENT_PROPOSALS,
    ROUTES.PRODUCER_PROFILE
];

export const PRODUCER_ONLY_ROUTES = [
    ROUTES.PRODUCER_PROPOSALS,
    ROUTES.MY_STUDIO
];