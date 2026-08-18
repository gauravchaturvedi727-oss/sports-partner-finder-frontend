import "./index.css";

import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


// =========================================
// PAGES
// =========================================

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Players from "./pages/Players";
import PlayerDetails from "./pages/PlayerDetails";

import IncomingRequest from "./pages/IncomingRequest";
import MyPartners from "./pages/MyPartners";
import SendRequest from "./pages/SendRequest";

import PlayHistory from "./pages/PlayHistory";

import AdminDashboard from "./pages/AdminDashboard";

import Communities from "./pages/Communities";
import CommunityDetails from "./pages/CommunityDetails";

import PlaySessions from "./pages/PlaySessions";
import MyPlaySessions from "./pages/MyPlaySessions";


// =========================================
// PROTECTION
// =========================================

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";


function App() {

    return (

        <BrowserRouter>

            <Routes>


                {/* =================================
                    HOME
                ================================= */}

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />


                {/* =================================
                    AUTH
                ================================= */}

                <Route
                    path="/login"
                    element={
                        <Login />
                    }
                />


                <Route
                    path="/register"
                    element={
                        <Register />
                    }
                />


                {/* =================================
                    PLAYERS
                ================================= */}

                <Route
                    path="/players"
                    element={
                        <ProtectedRoute>
                            <Players />
                        </ProtectedRoute>
                    }
                />


                {/* =================================
                    PLAYER DETAILS
                ================================= */}

                <Route
                    path="/players/:playerId"
                    element={
                        <ProtectedRoute>
                            <PlayerDetails />
                        </ProtectedRoute>
                    }
                />


                {/* =================================
                    REQUESTS
                ================================= */}

                <Route
                    path="/incoming-request"
                    element={
                        <ProtectedRoute>
                            <IncomingRequest />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/send-request"
                    element={
                        <ProtectedRoute>
                            <SendRequest />
                        </ProtectedRoute>
                    }
                />


                {/* =================================
                    PARTNERS
                ================================= */}

                <Route
                    path="/my-partners"
                    element={
                        <ProtectedRoute>
                            <MyPartners />
                        </ProtectedRoute>
                    }
                />


                {/* =================================
                    PLAY HISTORY
                ================================= */}

                <Route
                    path="/play-history"
                    element={
                        <ProtectedRoute>
                            <PlayHistory />
                        </ProtectedRoute>
                    }
                />


                {/* =================================
                    COMMUNITIES
                ================================= */}

                <Route
                    path="/communities"
                    element={
                        <ProtectedRoute>
                            <Communities />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/communities/:communityId"
                    element={
                        <ProtectedRoute>
                            <CommunityDetails />
                        </ProtectedRoute>
                    }
                />


                {/* =================================
                    PLAY SESSIONS
                ================================= */}

                <Route
                    path="/play/:sessionId"
                    element={
                        <ProtectedRoute>
                            <PlaySessions />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/my-play"
                    element={
                        <ProtectedRoute>
                            <MyPlaySessions />
                        </ProtectedRoute>
                    }
                />


                {/* =================================
                    ADMIN
                ================================= */}

                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <AdminDashboard />
                        </AdminRoute>
                    }
                />


                {/* =================================
                    UNKNOWN ROUTE
                ================================= */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />

            </Routes>

            <ToastContainer
                position="top-right"
                autoClose={2500}
                closeButton={false}
                newestOnTop
                pauseOnHover
                theme="dark"
            />

        </BrowserRouter>

    );

}


export default App;