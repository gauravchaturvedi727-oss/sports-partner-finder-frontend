import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";
import Navbar from "./Navbar";

import "./PlayerDetails.css";


function PlayerDetails() {

    const { playerId } = useParams();

    const navigate = useNavigate();

    const [player, setPlayer] = useState(null);

    const [loading, setLoading] = useState(true);

    const [requestLoading, setRequestLoading] =
        useState(false);


    // =========================================
    // FETCH PLAYER DETAILS
    // =========================================

    useEffect(() => {

        async function fetchPlayer() {

            try {

                setLoading(true);


                const response =
                    await api.get(
                        `/profile/${playerId}`
                    );


                setPlayer(
                    response.data.user
                );


            } catch (error) {

                console.log(
                    "Player Details Error:",
                    error
                );

                setPlayer(null);

            } finally {

                setLoading(false);

            }

        }


        if (playerId) {

            fetchPlayer();

        }

    }, [playerId]);


    // =========================================
    // SEND PARTNER REQUEST
    // =========================================

    async function sendRequest() {

        try {

            setRequestLoading(true);


            await api.post(
                `/requests/send/${playerId}`
            );


            alert(
                "Partner request sent successfully 🤝"
            );


        } catch (error) {

            console.log(
                "Send Request Error:",
                error
            );


            alert(
                error.response?.data?.message ||
                "Failed to send request"
            );


        } finally {

            setRequestLoading(false);

        }

    }


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (
            <>
                <Navbar />

                <div className="player-details-loading">

                    <div>

                        <div className="loading-spinner">
                            ⚡
                        </div>

                        <h2>
                            Loading Player...
                        </h2>

                        <p>
                            Getting player details.
                        </p>

                    </div>

                </div>
            </>
        );

    }


    // =========================================
    // PLAYER NOT FOUND
    // =========================================

    if (!player) {

        return (
            <>
                <Navbar />

                <div className="player-details-empty">

                    <div className="empty-icon">
                        🔎
                    </div>

                    <h2>
                        Player Not Found
                    </h2>

                    <p>
                        This player may no longer
                        be available.
                    </p>


                    <button
                        onClick={() =>
                            navigate("/players")
                        }
                    >
                        ← Back to Players
                    </button>

                </div>
            </>
        );

    }


    // =========================================
    // SPORTS
    // =========================================

    const sports =
        Array.isArray(player.sports)
            ? player.sports
            : player.sport
                ? [player.sport]
                : [];


    // =========================================
    // AVAILABILITY
    // =========================================

    const availability =
        Array.isArray(player.availability)
            ? player.availability
            : player.availability
                ? [player.availability]
                : [];


    // =========================================
    // PLAYER DETAILS
    // =========================================

    return (
        <>
            <Navbar />


            <main className="player-details-page">


                {/* =================================
                    BACK BUTTON
                ================================= */}

                <button
                    className="back-btn"
                    onClick={() =>
                        navigate("/players")
                    }
                >
                    ← Back to Players
                </button>


                {/* =================================
                    PLAYER CARD
                ================================= */}

                <section className="player-details-card">


                    {/* AVATAR */}

                    <div className="player-details-avatar">

                        {player.name
                            ?.charAt(0)
                            ?.toUpperCase()}

                    </div>


                    {/* NAME */}

                    <h1>
                        {player.name}
                    </h1>


                    {/* LOCATION */}

                    <p className="details-location">

                        📍{" "}

                        {player.city ||
                            "Location unavailable"}

                        {player.state &&
                            `, ${player.state}`}

                    </p>


                    {/* =================================
                        DETAILS
                    ================================= */}

                    <div className="details-grid">


                        {/* SPORTS */}

                        <div className="detail-box">

                            <span>
                                🏆 SPORTS
                            </span>

                            <strong>

                                {sports.length > 0
                                    ? sports.join(", ")
                                    : "Not specified"}

                            </strong>

                        </div>


                        {/* SKILL */}

                        <div className="detail-box">

                            <span>
                                ⭐ SKILL LEVEL
                            </span>

                            <strong>

                                {player.skillLevel ||
                                    "Not specified"}

                            </strong>

                        </div>


                        {/* AVAILABILITY */}

                        <div className="detail-box">

                            <span>
                                🕐 AVAILABILITY
                            </span>

                            <strong>

                                {availability.length > 0
                                    ? availability.join(", ")
                                    : "Not specified"}

                            </strong>

                        </div>


                        {/* PLAYING LOCATION */}

                        <div className="detail-box">

                            <span>
                                📍 PLAYING LOCATION
                            </span>

                            <strong>

                                {player.playingLocation ||
                                    "Not specified"}

                            </strong>

                        </div>


                    </div>


                    {/* =================================
                        SEND REQUEST
                    ================================= */}

                    <button
                        className="details-request-btn"
                        onClick={sendRequest}
                        disabled={requestLoading}
                    >

                        {requestLoading
                            ? "Sending Request..."
                            : "🤝 Send Play Request"}

                    </button>


                </section>

            </main>

        </>
    );

}


export default PlayerDetails;