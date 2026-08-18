import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import Navbar from "./Navbar";

import "./MyPlaySessions.css";


function MyPlaySessions() {

    const navigate = useNavigate();

    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);


    // =========================================
    // FETCH MY SESSIONS
    // =========================================

    async function fetchMySessions() {

        try {

            setLoading(true);

            const response =
                await api.get("/play/my");

            setSessions(
                response.data.sessions || []
            );

        } catch (error) {

            console.log(
                "My Sessions Error:",
                error
            );

        } finally {

            setLoading(false);

        }

    }


    useEffect(() => {

        fetchMySessions();

    }, []);


    // =========================================
    // SESSION STATUS
    // =========================================

    function getStatusClass(status) {

        if (status === "completed") {
            return "my-session-completed";
        }

        if (status === "cancelled") {
            return "my-session-cancelled";
        }

        return "my-session-scheduled";

    }


    // =========================================
    // OPEN DETAILS
    // =========================================

    function openSession(id) {

        navigate(
            `/play/${id}`
        );

    }


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (

            <>
                <Navbar />

                <div className="my-play-page">

                    <div className="my-play-loading">

                        <div>
                            🎮
                        </div>

                        <h2>
                            Loading Your Games...
                        </h2>

                        <p>
                            Fetching your play activity.
                        </p>

                    </div>

                </div>
            </>

        );

    }


    return (

        <>
            <Navbar />

            <div className="my-play-page">


                {/* =================================
                    HEADER
                ================================= */}

                <div className="my-play-header">

                    <div>

                        <span className="my-play-badge">
                            MY PLAY
                        </span>

                        <h1>
                            Your Games
                        </h1>

                        <p>
                            Manage the games you created
                            and joined.
                        </p>

                    </div>


                    <button
                        className="browse-games-btn"
                        onClick={() =>
                            navigate("/play")
                        }
                    >
                        🎮 Find Open Games
                    </button>

                </div>


                {/* =================================
                    STATS
                ================================= */}

                <div className="my-play-stats">

                    <div className="my-play-stat">

                        <span>
                            🎮
                        </span>

                        <div>

                            <small>
                                TOTAL
                            </small>

                            <strong>
                                {sessions.length}
                            </strong>

                        </div>

                    </div>


                    <div className="my-play-stat">

                        <span>
                            ⚡
                        </span>

                        <div>

                            <small>
                                UPCOMING
                            </small>

                            <strong>
                                {
                                    sessions.filter(
                                        (session) =>
                                            session.status ===
                                            "scheduled"
                                    ).length
                                }
                            </strong>

                        </div>

                    </div>


                    <div className="my-play-stat">

                        <span>
                            🏆
                        </span>

                        <div>

                            <small>
                                COMPLETED
                            </small>

                            <strong>
                                {
                                    sessions.filter(
                                        (session) =>
                                            session.status ===
                                            "completed"
                                    ).length
                                }
                            </strong>

                        </div>

                    </div>


                    <div className="my-play-stat">

                        <span>
                            ❌
                        </span>

                        <div>

                            <small>
                                CANCELLED
                            </small>

                            <strong>
                                {
                                    sessions.filter(
                                        (session) =>
                                            session.status ===
                                            "cancelled"
                                    ).length
                                }
                            </strong>

                        </div>

                    </div>

                </div>


                {/* =================================
                    EMPTY
                ================================= */}

                {sessions.length === 0 ? (

                    <div className="my-play-empty">

                        <div>
                            🏸
                        </div>

                        <h2>
                            No Games Yet
                        </h2>

                        <p>
                            You haven't joined or created
                            any play session yet.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/play")
                            }
                        >
                            Find a Game
                        </button>

                    </div>

                ) : (

                    <div className="my-play-list">

                        {sessions.map(
                            (session) => {

                                const playerCount =
                                    session.players?.length ||
                                    0;


                                const currentUserId =
                                    localStorage.getItem(
                                        "userId"
                                    );


                                const isOrganizer =
                                    session.organizer?._id ===
                                    currentUserId;


                                return (

                                    <div
                                        className="my-session-card"
                                        key={
                                            session._id
                                        }
                                        onClick={() =>
                                            openSession(
                                                session._id
                                            )
                                        }
                                    >


                                        {/* ICON */}

                                        <div className="my-session-icon">
                                            🎮
                                        </div>


                                        {/* MAIN */}

                                        <div className="my-session-main">

                                            <div className="my-session-title-row">

                                                <h2>
                                                    {
                                                        session.title
                                                    }
                                                </h2>

                                                <span
                                                    className={
                                                        getStatusClass(
                                                            session.status
                                                        )
                                                    }
                                                >
                                                    ●{" "}
                                                    {
                                                        session.status
                                                    }
                                                </span>

                                            </div>


                                            <div className="my-session-game">

                                                🏆{" "}
                                                {
                                                    session.game
                                                }

                                            </div>


                                            <div className="my-session-meta">

                                                <span>
                                                    📅{" "}
                                                    {
                                                        new Date(
                                                            session.date
                                                        ).toLocaleString(
                                                            [],
                                                            {
                                                                dateStyle:
                                                                    "medium",
                                                                timeStyle:
                                                                    "short"
                                                            }
                                                        )
                                                    }
                                                </span>


                                                <span>
                                                    📍{" "}
                                                    {
                                                        session.city
                                                    }
                                                </span>


                                                <span>
                                                    👥{" "}
                                                    {
                                                        playerCount
                                                    }
                                                    /
                                                    {
                                                        session.maxPlayers
                                                    }
                                                </span>

                                            </div>

                                        </div>


                                        {/* ROLE */}

                                        <div className="my-session-role">

                                            {isOrganizer ? (

                                                <span className="organizer-role">
                                                    👑 Organizer
                                                </span>

                                            ) : (

                                                <span className="player-role">
                                                    🤝 Player
                                                </span>

                                            )}

                                        </div>


                                        {/* ARROW */}

                                        <div className="my-session-arrow">
                                            →
                                        </div>

                                    </div>

                                );

                            }
                        )}

                    </div>

                )}

            </div>

        </>
    );

}

export default MyPlaySessions;