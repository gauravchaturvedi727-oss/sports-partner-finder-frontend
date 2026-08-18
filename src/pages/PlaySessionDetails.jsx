import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";
import Navbar from "./Navbar";

import "./PlaySessionDetails.css";


function PlaySessionDetails() {

    const { sessionId } = useParams();
    const navigate = useNavigate();

    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);


    // =========================================
    // FETCH SESSION
    // =========================================

    async function fetchSession() {

        try {

            setLoading(true);

            const response =
                await api.get(
                    `/play/${sessionId}`
                );

            setSession(
                response.data.session
            );

        } catch (error) {

            console.log(
                "Session Details Error:",
                error
            );

        } finally {

            setLoading(false);

        }

    }


    useEffect(() => {

        fetchSession();

    }, [sessionId]);


    // =========================================
    // CURRENT USER
    // =========================================

    function getUserId() {

        return localStorage.getItem(
            "userId"
        );

    }


    // =========================================
    // IS ORGANIZER
    // =========================================

    function isOrganizer() {

        if (!session) return false;

        return (
            session.organizer?._id ===
            getUserId()
        );

    }


    // =========================================
    // IS PLAYER
    // =========================================

    function isPlayer() {

        if (!session) return false;

        return session.players?.some(
            (player) =>
                player._id === getUserId()
        );

    }


    // =========================================
    // JOIN
    // =========================================

    async function joinSession() {

        try {

            setActionLoading(true);

            await api.post(
                `/play/${sessionId}/join`
            );

            await fetchSession();

            alert(
                "You joined the game 🤝"
            );

        } catch (error) {

            console.log(
                "Join Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to join game"
            );

        } finally {

            setActionLoading(false);

        }

    }


    // =========================================
    // LEAVE
    // =========================================

    async function leaveSession() {

        const confirmed =
            window.confirm(
                "Are you sure you want to leave this game?"
            );

        if (!confirmed) return;


        try {

            setActionLoading(true);

            await api.delete(
                `/play/${sessionId}/leave`
            );

            await fetchSession();

            alert(
                "You left the game"
            );

        } catch (error) {

            console.log(
                "Leave Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to leave game"
            );

        } finally {

            setActionLoading(false);

        }

    }


    // =========================================
    // CANCEL
    // =========================================

    async function cancelSession() {

        const confirmed =
            window.confirm(
                "Are you sure you want to cancel this game?"
            );

        if (!confirmed) return;


        try {

            setActionLoading(true);

            await api.patch(
                `/play/${sessionId}/cancel`
            );

            await fetchSession();

            alert(
                "Game cancelled successfully"
            );

        } catch (error) {

            console.log(
                "Cancel Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to cancel game"
            );

        } finally {

            setActionLoading(false);

        }

    }


    // =========================================
    // COMPLETE
    // =========================================

    async function completeSession() {

        try {

            setActionLoading(true);

            await api.patch(
                `/play/${sessionId}/complete`
            );

            await fetchSession();

            alert(
                "Game marked as completed 🎉"
            );

        } catch (error) {

            console.log(
                "Complete Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to complete game"
            );

        } finally {

            setActionLoading(false);

        }

    }


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (

            <>
                <Navbar />

                <div className="play-details-page">

                    <div className="play-details-loading">

                        <div>
                            ⚡
                        </div>

                        <h2>
                            Loading Game...
                        </h2>

                    </div>

                </div>
            </>

        );

    }


    // =========================================
    // NOT FOUND
    // =========================================

    if (!session) {

        return (

            <>
                <Navbar />

                <div className="play-details-page">

                    <div className="play-not-found">

                        <div>
                            🎮
                        </div>

                        <h2>
                            Game Not Found
                        </h2>

                        <button
                            onClick={() =>
                                navigate("/play")
                            }
                        >
                            ← Back to Open Games
                        </button>

                    </div>

                </div>
            </>

        );

    }


    const playerCount =
        session.players?.length || 0;

    const isFull =
        playerCount >= session.maxPlayers;


    return (

        <>
            <Navbar />

            <div className="play-details-page">


                {/* =================================
                    BACK
                ================================= */}

                <button
                    className="back-play-btn"
                    onClick={() =>
                        navigate("/play")
                    }
                >
                    ← Back to Open Games
                </button>


                {/* =================================
                    HERO
                ================================= */}

                <div className="play-details-hero">

                    <div className="play-details-icon">
                        🎮
                    </div>


                    <div className="play-details-title">

                        <span className="play-details-badge">
                            OPEN PLAY
                        </span>

                        <h1>
                            {session.title}
                        </h1>

                        <div className="details-game-name">
                            🏆 {session.game}
                        </div>

                    </div>


                    <div
                        className={
                            session.status === "scheduled"
                                ? "details-status scheduled"
                                : "details-status cancelled"
                        }
                    >
                        ● {session.status}
                    </div>

                </div>


                {/* =================================
                    MAIN GRID
                ================================= */}

                <div className="play-details-grid">


                    {/* =================================
                        LEFT
                    ================================= */}

                    <div className="play-details-main">


                        {/* GAME INFO */}

                        <div className="details-section">

                            <h2>
                                Game Information
                            </h2>

                            <p className="details-description">

                                {session.description ||
                                    "No description provided for this game."}

                            </p>


                            <div className="game-info-grid">

                                <div className="game-detail-box">

                                    <span>
                                        📅
                                    </span>

                                    <div>

                                        <small>
                                            DATE & TIME
                                        </small>

                                        <strong>
                                            {
                                                new Date(
                                                    session.date
                                                ).toLocaleString(
                                                    [],
                                                    {
                                                        dateStyle:
                                                            "full",
                                                        timeStyle:
                                                            "short"
                                                    }
                                                )
                                            }
                                        </strong>

                                    </div>

                                </div>


                                <div className="game-detail-box">

                                    <span>
                                        📍
                                    </span>

                                    <div>

                                        <small>
                                            CITY
                                        </small>

                                        <strong>
                                            {session.city}
                                        </strong>

                                    </div>

                                </div>


                                <div className="game-detail-box">

                                    <span>
                                        🏟️
                                    </span>

                                    <div>

                                        <small>
                                            PLAYING LOCATION
                                        </small>

                                        <strong>
                                            {session.location}
                                        </strong>

                                    </div>

                                </div>


                                <div className="game-detail-box">

                                    <span>
                                        👥
                                    </span>

                                    <div>

                                        <small>
                                            PLAYERS
                                        </small>

                                        <strong>
                                            {playerCount}
                                            {" / "}
                                            {session.maxPlayers}
                                        </strong>

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* PLAYERS */}

                        <div className="details-section">

                            <div className="players-section-header">

                                <div>

                                    <h2>
                                        Players
                                    </h2>

                                    <p>
                                        People joining this game
                                    </p>

                                </div>

                                <span>
                                    {playerCount}
                                    /
                                    {session.maxPlayers}
                                </span>

                            </div>


                            <div className="session-players-list">

                                {session.players?.map(
                                    (player) => (

                                        <div
                                            className="session-player"
                                            key={
                                                player._id
                                            }
                                        >

                                            <div className="session-player-avatar">

                                                {
                                                    player.name
                                                        ?.charAt(0)
                                                        ?.toUpperCase()
                                                }

                                            </div>


                                            <div className="session-player-info">

                                                <strong>
                                                    {
                                                        player.name
                                                    }
                                                </strong>

                                                <span>
                                                    {
                                                        player.city ||
                                                        "Location unavailable"
                                                    }
                                                </span>

                                            </div>


                                            {player._id ===
                                                session.organizer?._id && (

                                                <span className="organizer-label">
                                                    Organizer
                                                </span>

                                            )}

                                        </div>

                                    )
                                )}

                            </div>

                        </div>

                    </div>


                    {/* =================================
                        SIDEBAR
                    ================================= */}

                    <div className="play-details-sidebar">


                        {/* ORGANIZER */}

                        <div className="details-side-card">

                            <span className="side-label">
                                ORGANIZED BY
                            </span>


                            <div className="details-organizer">

                                <div className="details-organizer-avatar">

                                    {
                                        session.organizer
                                            ?.name
                                            ?.charAt(0)
                                            ?.toUpperCase()
                                    }

                                </div>


                                <div>

                                    <strong>
                                        {
                                            session.organizer
                                                ?.name ||
                                            "Player"
                                        }
                                    </strong>

                                    <small>
                                        {
                                            session.organizer
                                                ?.city ||
                                            "Local player"
                                        }
                                    </small>

                                </div>

                            </div>

                        </div>


                        {/* COMMUNITY */}

                        {session.community && (

                            <div className="details-side-card">

                                <span className="side-label">
                                    COMMUNITY
                                </span>

                                <div className="community-mini">

                                    <div>
                                        🏟️
                                    </div>

                                    <span>
                                        {
                                            session.community
                                                ?.name
                                        }
                                    </span>

                                </div>

                                <button
                                    className="view-community-btn"
                                    onClick={() =>
                                        navigate(
                                            `/communities/${session.community._id}`
                                        )
                                    }
                                >
                                    View Community →
                                </button>

                            </div>

                        )}


                        {/* ACTION */}

                        <div className="details-side-card">

                            <span className="side-label">
                                GAME ACTION
                            </span>


                            {session.status !==
                                "scheduled" ? (

                                <div className="session-ended-message">

                                    This session is
                                    {session.status ===
                                    "completed"
                                        ? " completed."
                                        : " cancelled."
                                    }

                                </div>

                            ) : isOrganizer() ? (

                                <div className="organizer-actions">

                                    <button
                                        className="complete-session-btn"
                                        onClick={
                                            completeSession
                                        }
                                        disabled={
                                            actionLoading
                                        }
                                    >
                                        ✓ Complete Game
                                    </button>


                                    <button
                                        className="cancel-session-btn"
                                        onClick={
                                            cancelSession
                                        }
                                        disabled={
                                            actionLoading
                                        }
                                    >
                                        Cancel Game
                                    </button>

                                </div>

                            ) : isPlayer() ? (

                                <button
                                    className="leave-session-btn"
                                    onClick={
                                        leaveSession
                                    }
                                    disabled={
                                        actionLoading
                                    }
                                >
                                    {actionLoading
                                        ? "Processing..."
                                        : "Leave Game"
                                    }
                                </button>

                            ) : (

                                <button
                                    className="join-session-details-btn"
                                    onClick={
                                        joinSession
                                    }
                                    disabled={
                                        isFull ||
                                        actionLoading
                                    }
                                >

                                    {isFull
                                        ? "🔒 Game Full"
                                        : actionLoading
                                            ? "Joining..."
                                            : "🤝 Join Game"
                                    }

                                </button>

                            )}

                        </div>

                    </div>

                </div>

            </div>
        </>
    );
}

export default PlaySessionDetails;