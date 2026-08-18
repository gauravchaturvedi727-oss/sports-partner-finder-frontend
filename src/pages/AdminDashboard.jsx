import { useEffect, useState } from "react";
import api from "../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {

    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [games, setGames] = useState([]);

    const [gameName, setGameName] = useState("");
    const [gameCategory, setGameCategory] =
        useState("Indoor");

    const [loading, setLoading] = useState(true);
    const [addingGame, setAddingGame] = useState(false);


    // =========================================
    // FETCH ALL ADMIN DATA
    // =========================================

    async function fetchAdminData() {

        try {

            setLoading(true);

            const [
                statsResponse,
                usersResponse,
                gamesResponse
            ] = await Promise.all([

                api.get("/admin/dashboard"),

                api.get("/admin/users"),

                api.get("/admin/games")

            ]);


            setStats(
                statsResponse.data.stats
            );


            setUsers(
                usersResponse.data.users || []
            );


            setGames(
                gamesResponse.data.games || []
            );


        } catch (error) {

            console.log(
                "Admin Dashboard Error:",
                error
            );

        } finally {

            setLoading(false);

        }

    }


    useEffect(() => {

        fetchAdminData();

    }, []);


    // =========================================
    // TOGGLE USER STATUS
    // =========================================

    async function toggleUser(userId) {

        try {

            await api.patch(
                `/admin/users/${userId}/status`
            );

            await fetchAdminData();

        } catch (error) {

            console.log(
                "Toggle User Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to update user"
            );

        }

    }


    // =========================================
    // ADD GAME
    // =========================================

    async function addGame(e) {

        e.preventDefault();

        if (!gameName.trim()) {

            alert(
                "Please enter game name"
            );

            return;

        }


        try {

            setAddingGame(true);


            await api.post(
                "/admin/games",
                {
                    name: gameName.trim(),
                    category: gameCategory
                }
            );


            alert(
                "Game added successfully 🎮"
            );


            setGameName("");

            setGameCategory("Indoor");


            await fetchAdminData();


        } catch (error) {

            console.log(
                "Add Game Error:",
                error
            );


            alert(
                error.response?.data?.message ||
                "Failed to add game"
            );


        } finally {

            setAddingGame(false);

        }

    }


    // =========================================
    // TOGGLE GAME STATUS
    // =========================================

    async function toggleGame(gameId) {

        try {

            await api.patch(
                `/admin/games/${gameId}/status`
            );


            await fetchAdminData();


        } catch (error) {

            console.log(
                "Toggle Game Error:",
                error
            );


            alert(
                error.response?.data?.message ||
                "Failed to update game"
            );

        }

    }


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (

            <div className="admin-page">

                <div className="admin-loading">

                    <div className="loading-spinner">
                        ⚡
                    </div>

                    <h2>
                        Loading Admin Dashboard...
                    </h2>

                </div>

            </div>

        );

    }


    // =========================================
    // ERROR
    // =========================================

    if (!stats) {

        return (

            <div className="admin-page">

                <div className="admin-error">

                    <h2>
                        Unable to load dashboard
                    </h2>

                    <button
                        onClick={fetchAdminData}
                    >
                        Try Again
                    </button>

                </div>

            </div>

        );

    }


    return (

        <div className="admin-page">


            {/* =================================
                HEADER
            ================================= */}

            <div className="admin-header">

                <div>

                    <span className="admin-badge">
                        ADMIN CONTROL CENTER
                    </span>

                    <h1>
                        Sports Partner Dashboard
                    </h1>

                    <p>
                        Monitor users, requests,
                        games and community activity.
                    </p>

                </div>

            </div>


            {/* =================================
                USERS
            ================================= */}

            <section>

                <h2 className="section-title">
                    Users
                </h2>


                <div className="stats-grid">

                    <div className="stat-card">

                        <span>👥</span>

                        <div>

                            <p>
                                Total Users
                            </p>

                            <h2>
                                {stats.users.total}
                            </h2>

                        </div>

                    </div>


                    <div className="stat-card">

                        <span>🟢</span>

                        <div>

                            <p>
                                Active Users
                            </p>

                            <h2>
                                {stats.users.active}
                            </h2>

                        </div>

                    </div>


                    <div className="stat-card">

                        <span>🔴</span>

                        <div>

                            <p>
                                Inactive Users
                            </p>

                            <h2>
                                {stats.users.inactive}
                            </h2>

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================
                REQUESTS
            ================================= */}

            <section>

                <h2 className="section-title">
                    Partner Requests
                </h2>


                <div className="stats-grid">

                    <div className="stat-card">

                        <span>📨</span>

                        <div>

                            <p>
                                Total
                            </p>

                            <h2>
                                {stats.requests.total}
                            </h2>

                        </div>

                    </div>


                    <div className="stat-card">

                        <span>⏳</span>

                        <div>

                            <p>
                                Pending
                            </p>

                            <h2>
                                {stats.requests.pending}
                            </h2>

                        </div>

                    </div>


                    <div className="stat-card">

                        <span>🤝</span>

                        <div>

                            <p>
                                Accepted
                            </p>

                            <h2>
                                {stats.requests.accepted}
                            </h2>

                        </div>

                    </div>


                    <div className="stat-card">

                        <span>❌</span>

                        <div>

                            <p>
                                Rejected
                            </p>

                            <h2>
                                {stats.requests.rejected}
                            </h2>

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================
                PLAY SESSIONS
            ================================= */}

            <section>

                <h2 className="section-title">
                    Games
                </h2>


                <div className="stats-grid">

                    <div className="stat-card">

                        <span>🎮</span>

                        <div>

                            <p>
                                Total Games
                            </p>

                            <h2>
                                {stats.games.total}
                            </h2>

                        </div>

                    </div>


                    <div className="stat-card">

                        <span>📅</span>

                        <div>

                            <p>
                                Scheduled
                            </p>

                            <h2>
                                {stats.games.scheduled}
                            </h2>

                        </div>

                    </div>


                    <div className="stat-card">

                        <span>🏆</span>

                        <div>

                            <p>
                                Completed
                            </p>

                            <h2>
                                {stats.games.completed}
                            </h2>

                        </div>

                    </div>


                    <div className="stat-card">

                        <span>🚫</span>

                        <div>

                            <p>
                                Cancelled
                            </p>

                            <h2>
                                {stats.games.cancelled}
                            </h2>

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================
                USER MANAGEMENT
            ================================= */}

            <section className="users-section">

                <div className="section-heading">

                    <div>

                        <h2 className="section-title">
                            Registered Players
                        </h2>

                        <p>
                            Manage platform users
                        </p>

                    </div>


                    <span className="user-count">
                        {users.length} Users
                    </span>

                </div>


                <div className="users-table-wrapper">

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    Player
                                </th>

                                <th>
                                    Location
                                </th>

                                <th>
                                    Games
                                </th>

                                <th>
                                    Skill
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {users.map(
                                (user) => (

                                    <tr
                                        key={
                                            user._id
                                        }
                                    >

                                        <td>

                                            <div className="user-cell">

                                                <div className="user-avatar">

                                                    {
                                                        user.name
                                                            ?.charAt(0)
                                                            ?.toUpperCase()
                                                    }

                                                </div>


                                                <div>

                                                    <strong>
                                                        {
                                                            user.name
                                                        }
                                                    </strong>

                                                    <small>
                                                        {
                                                            user.email
                                                        }
                                                    </small>

                                                </div>

                                            </div>

                                        </td>


                                        <td>

                                            {user.city ||
                                                "-"}

                                        </td>


                                        <td>

                                            {user.sports?.length
                                                ? user.sports.join(
                                                    ", "
                                                )
                                                : "-"}

                                        </td>


                                        <td>

                                            {
                                                user.skillLevel ||
                                                "-"
                                            }

                                        </td>


                                        <td>

                                            <span
                                                className={
                                                    user.isActive
                                                        ? "active-status"
                                                        : "inactive-status"
                                                }
                                            >

                                                {
                                                    user.isActive
                                                        ? "Active"
                                                        : "Inactive"
                                                }

                                            </span>

                                        </td>


                                        <td>

                                            <button
                                                className={
                                                    user.isActive
                                                        ? "deactivate-btn"
                                                        : "activate-btn"
                                                }
                                                onClick={() =>
                                                    toggleUser(
                                                        user._id
                                                    )
                                                }
                                            >

                                                {
                                                    user.isActive
                                                        ? "Deactivate"
                                                        : "Activate"
                                                }

                                            </button>

                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                </div>

            </section>


            {/* =================================
                GAME MANAGEMENT
            ================================= */}

            <section className="game-management">

                <div className="section-heading">

                    <div>

                        <h2 className="section-title">
                            Game Categories
                        </h2>

                        <p>
                            Manage available sports
                            and recreational games
                        </p>

                    </div>


                    <span className="user-count">
                        {games.length} Games
                    </span>

                </div>


                {/* ADD GAME */}

                <form
                    className="add-game-form"
                    onSubmit={addGame}
                >

                    <input
                        type="text"
                        placeholder="Enter game name"
                        value={gameName}
                        onChange={(e) =>
                            setGameName(
                                e.target.value
                            )
                        }
                    />


                    <select
                        value={gameCategory}
                        onChange={(e) =>
                            setGameCategory(
                                e.target.value
                            )
                        }
                    >

                        <option value="Indoor">
                            Indoor
                        </option>

                        <option value="Outdoor">
                            Outdoor
                        </option>

                    </select>


                    <button
                        type="submit"
                        disabled={addingGame}
                    >

                        {addingGame
                            ? "Adding..."
                            : "+ Add Game"
                        }

                    </button>

                </form>


                {/* GAME LIST */}

                {games.length === 0 ? (

                    <div className="no-games">

                        <div>
                            🎮
                        </div>

                        <h3>
                            No Games Added
                        </h3>

                        <p>
                            Add the first game
                            category above.
                        </p>

                    </div>

                ) : (

                    <div className="games-grid">

                        {games.map(
                            (game) => (

                                <div
                                    className="game-admin-card"
                                    key={
                                        game._id
                                    }
                                >

                                    <div className="game-admin-icon">

                                        {
                                            game.category ===
                                            "Indoor"
                                                ? "♟️"
                                                : "🏃"
                                        }

                                    </div>


                                    <div className="game-admin-info">

                                        <h3>
                                            {
                                                game.name
                                            }
                                        </h3>

                                        <span>
                                            {
                                                game.category
                                            }
                                        </span>

                                    </div>


                                    <div className="game-admin-right">

                                        <span
                                            className={
                                                game.isActive
                                                    ? "active-status"
                                                    : "inactive-status"
                                            }
                                        >

                                            {
                                                game.isActive
                                                    ? "Active"
                                                    : "Inactive"
                                            }

                                        </span>


                                        <button
                                            className={
                                                game.isActive
                                                    ? "deactivate-btn"
                                                    : "activate-btn"
                                            }
                                            onClick={() =>
                                                toggleGame(
                                                    game._id
                                                )
                                            }
                                        >

                                            {
                                                game.isActive
                                                    ? "Disable"
                                                    : "Enable"
                                            }

                                        </button>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </section>

        </div>

    );

}

export default AdminDashboard;