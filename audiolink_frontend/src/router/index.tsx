import { createBrowserRouter } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

import App from "@/App";
import FinishedProjectsPage from "@/pages/FinishedProjectsPage";
import LandingPage from "@/pages/LandingPage";
import MessagePage from "@/pages/MessagePage";
import ProducerProfilePage from "@/pages/ProducerProfilePage";
import SearchPage from "@/pages/SearchPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <LandingPage /> },
            { path: ROUTES.SEARCH, element: <SearchPage /> },
            { path: ROUTES.FINISHED_PROJECTS, element: <FinishedProjectsPage /> },
            { path: ROUTES.MESSAGES, element: <MessagePage /> },
            { path: ROUTES.PRODUCER_PROFILE, element: <ProducerProfilePage /> },
        ],
    },
]);

