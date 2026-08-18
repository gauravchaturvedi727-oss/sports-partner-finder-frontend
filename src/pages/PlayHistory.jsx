import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "./Navbar";
import "./PlayHistory.css";

function PlayHistory() {

    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    async function fetchHistory() {

        try {

            const response =
                await api.get("/play/history");

            setSessions(
                response.data.sessions || []
            );

        } catch (error) {

            console.log(
                "Play History Error:",
                error
            );

        } finally {

            setLoading(false);

        }

    }


    useEffect(() => {

        fetchHistory();

    }, []);


    async function completeSession(id) {

        try {

            await api.patch(
                `/play/${id}/complete`
            );

            alert(
                "Game marked as completed!"
            );

            fetchHistory();

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to complete game"
            );

        }

    }


    async function cancelSession(id) {

        try {

            await api.patch(
                `/play/${id}/cancel`
            );

            alert(
                "Game cancelled"
            );

            fetchHistory();

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to cancel game"
            );

        }

    }


    if (loading) {

        return (
            <>
                <Navbar />

                <div className="play-page">

                    <h2>
                        Loading Play History...
                    </h2>

                </div>
            </>
        );

    }


    return (

        <>

            <Navbar />

            <div className="play-page">

                <div className="play-header">

                    <span className="play-badge">
                        GAME CENTER
                    </span>

                    <h1>
                        My Play History
                    </h1>

                    <p>
                        Track your upcoming games
                        and previous matches.
                    </p>

                </div>


                {sessions.length === 0 ? (

                    <div className="empty-play">

                        <div className="empty-icon">
                            🏆
                        </div>

                        <h2>
                            No Games Yet
                        </h2>

                        <p>
                            Schedule a game with
                            one of your partners.
                        </p>

                    </div>

                ) : (

                    <div className="play-grid">

                        {sessions.map(
                            (session) => {

                                const currentUser =
                                    localStorage.getItem(
                                        "userId"
                                    );

                                const opponent =
                                    session.player1?._id ===
                                    currentUser
                                        ? session.player2
                                        : session.player1;


                                return (

                                    <div
                                        className="play-card"
                                        key={
                                            session._id
                                        }
                                    >

                                        <div className="play-card-top">

                                            <div className="sport-icon">
                                                🎮
                                            </div>

                                            <span
                                                className={
                                                    `status ${session.status}`
                                                }
                                            >
                                                {
                                                    session.status
                                                }
                                            </span>

                                        </div>


                                        <h2>
                                            {session.sport}
                                        </h2>


                                        <div className="play-info">

                                            <p>
                                                👤{" "}
                                                <strong>
                                                    Opponent
                                                </strong>

                                                <br />

                                                {
                                                    opponent?.name ||
                                                    "Player"
                                                }

                                            </p>


                                            <p>
                                                📍{" "}
                                                <strong>
                                                    Location
                                                </strong>

                                                <br />

                                                {
                                                    session.location
                                                }

                                            </p>


                                            <p>
                                                🗓️{" "}
                                                <strong>
                                                    Date
                                                </strong>

                                                <br />

                                                {new Date(
                                                    session.scheduledAt
                                                ).toLocaleString()}

                                            </p>

                                        </div>


                                        {session.status ===
                                            "scheduled" && (

                                            <div className="play-actions">

                                                <button
                                                    className="complete-btn"
                                                    onClick={() =>
                                                        completeSession(
                                                            session._id
                                                        )
                                                    }
                                                >
                                                    ✓ Completed
                                                </button>


                                                <button
                                                    className="cancel-btn"
                                                    onClick={() =>
                                                        cancelSession(
                                                            session._id
                                                        )
                                                    }
                                                >
                                                    Cancel
                                                </button>

                                            </div>

                                        )}

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

export default PlayHistory;