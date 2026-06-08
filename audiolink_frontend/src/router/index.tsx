import { createBrowserRouter } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

import App from "@/App";
import ProtectedRoute from "@/components/security/ProtectedRoute";
import FinishedProjectsPage from "@/pages/users/artist/FinishedProjectsPage";
import LandingPage from "@/pages/users/LandingPage";
import MessagePage from "@/pages/users/MessagePage";
import ProducerProfilePage from "@/pages/users/artist/ProducerProfilePage";
import SearchPage from "@/pages/users/artist/SearchPage";
import ManageProjectsPage from "@/pages/users/ManageProjectsPage";
import LoginPage from "@/pages/users/LoginPage";
import RegisterPage from "@/pages/users/RegisterPage";
import SentProposalsPage from "@/pages/users/artist/SentProposalsPage";
import MyStudioPage from "@/pages/users/producer/MyStudioPage";
import ProducerProposalsPage from "@/pages/users/producer/ProducerProposalsPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <LandingPage /> },

            { path: ROUTES.LOGIN, element: <LoginPage /> },
            { path: ROUTES.REGISTER, element: <RegisterPage /> },

            {
                element: <ProtectedRoute />,
                children: [
                    // RUTAS COMUNES
                    { path: ROUTES.PROJECTS, element: <ManageProjectsPage /> },
                    { path: ROUTES.MESSAGES, element: <MessagePage /> },

                    // RUTA EXCLUSIVAS ARTISTA
                    { path: ROUTES.SEARCH, element: <SearchPage /> },
                    { path: ROUTES.FINISHED_PROJECTS, element: <FinishedProjectsPage /> },
                    { path: ROUTES.SENT_PROPOSALS, element: <SentProposalsPage /> },
                    { path: ROUTES.PRODUCER_PROFILE, element: <ProducerProfilePage /> },

                    // RUTAS EXCLUSIVAS PRODUCTOR
                    { path: ROUTES.PRODUCER_PROPOSALS, element: <ProducerProposalsPage /> },
                    { path: ROUTES.MY_STUDIO, element: <MyStudioPage /> },
                ],
            },
        ],
    }
]);