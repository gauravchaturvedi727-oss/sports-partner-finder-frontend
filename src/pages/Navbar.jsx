import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    const navigate = useNavigate();

    const role = localStorage.getItem("role");

    // =========================================
    // ACTIVE NAV LINK
    // =========================================

    function getNavClass({ isActive }) {
        return isActive
            ? "nav-link active"
            : "nav-link";
    }


    // =========================================
    // LOGOUT
    // =========================================

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");

        navigate("/login", {
            replace: true
        });
    }


    return (
        <nav className="navbar">


            {/* =================================
                LOGO
            ================================= */}

            <NavLink
                to="/players"
                className="navbar-logo"
            >

                <span className="logo-icon">
                    🏆
                </span>

                <div className="logo-text">

                    <strong>
                        Sports Partner
                    </strong>

                    <small>
                        PLAY • CONNECT • WIN
                    </small>

                </div>

            </NavLink>


            {/* =================================
                NAVIGATION
            ================================= */}

            <div className="nav-links">


                {/* PLAYERS */}

                <NavLink
                    to="/players"
                    className={getNavClass}
                >
                    <span>🎮</span>
                    <span>Players</span>
                </NavLink>


                {/* OPEN GAMES */}

                <NavLink
                    to="/play"
                    className={getNavClass}
                >
                    <span>🏸</span>
                    <span>Open Games</span>
                </NavLink>


                {/* MY GAMES */}

                <NavLink
                    to="/my-play"
                    className={getNavClass}
                >
                    <span>🎯</span>
                    <span>My Games</span>
                </NavLink>


                {/* COMMUNITIES */}

                <NavLink
                    to="/communities"
                    className={getNavClass}
                >
                    <span>🏟️</span>
                    <span>Communities</span>
                </NavLink>


                {/* INCOMING REQUESTS */}

                <NavLink
                    to="/incoming-request"
                    className={getNavClass}
                >
                    <span>📨</span>
                    <span>Incoming</span>
                </NavLink>


                {/* SENT REQUESTS */}

                <NavLink
                    to="/send-request"
                    className={getNavClass}
                >
                    <span>📤</span>
                    <span>Sent</span>
                </NavLink>


                {/* MY PARTNERS */}

                <NavLink
                    to="/my-partners"
                    className={getNavClass}
                >
                    <span>🤝</span>
                    <span>Partners</span>
                </NavLink>


                {/* ADMIN */}

                {role === "admin" && (

                    <NavLink
                        to="/admin"
                        className={getNavClass}
                    >
                        <span>⚙️</span>
                        <span>Admin</span>
                    </NavLink>

                )}

            </div>


            {/* =================================
                RIGHT SIDE
            ================================= */}

            <div className="navbar-right">


                <div className="online-status">

                    <span className="online-dot"></span>

                    Online

                </div>


                <button
                    className="logout-btn"
                    onClick={logout}
                >

                    <span>
                        ⇥
                    </span>

                    Logout

                </button>

            </div>

        </nav>
    );
}

export default Navbar;