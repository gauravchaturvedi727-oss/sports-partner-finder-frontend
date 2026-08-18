import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import Navbar from "./Navbar";

import "./PlaySessions.css";


function PlaySessions() {

    const navigate = useNavigate();

    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [city, setCity] = useState("");
    const [game, setGame] = useState("");

    const [showCreate, setShowCreate] = useState(false);
    const [creating, setCreating] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [sessionGame, setSessionGame] = useState("");
    const [sessionCity, setSessionCity] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [maxPlayers, setMaxPlayers] = useState(2);


    // =========================================
    // FETCH SESSIONS
    // =========================================

    async function fetchSessions(
        selectedCity = "",
        selectedGame = ""
    ) {

        try {

            setLoading(true);

            const params = new URLSearchParams();

            if (selectedCity) {
                params.append("city", selectedCity);
            }

            if (selectedGame) {
                params.append("game", selectedGame);
            }

            const query =
                params.toString()
                    ? `?${params.toString()}`
                    : "";

            const response =
                await api.get(
                    `/play${query}`
                );

            setSessions(
                response.data.sessions || []
            );

        } catch (error) {

            console.log(
                "Fetch Play Sessions Error:",
                error
            );

        } finally {

            setLoading(false);

        }

    }


    useEffect(() => {

        fetchSessions();

    }, []);


    // =========================================
    // SEARCH
    // =========================================

    function handleSearch(e) {

        e.preventDefault();

        fetchSessions(
            city,
            game
        );

    }


    function clearFilters() {

        setCity("");
        setGame("");

        fetchSessions();

    }


    // =========================================
    // CREATE SESSION
    // =========================================

    async function createSession(e) {

        e.preventDefault();

        if (creating) return;


        try {

            setCreating(true);


            await api.post(
                "/play",
                {
                    title,
                    description,
                    game: sessionGame,
                    city: sessionCity,
                    location,
                    date,
                    maxPlayers: Number(maxPlayers)
                }
            );


            alert(
                "Play session created successfully 🎮"
            );


            setTitle("");
            setDescription("");
            setSessionGame("");
            setSessionCity("");
            setLocation("");
            setDate("");
            setMaxPlayers(2);

            setShowCreate(false);

            fetchSessions(city, game);

        } catch (error) {

            console.log(
                "Create Session Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to create play session"
            );

        } finally {

            setCreating(false);

        }

    }


    // =========================================
    // JOIN SESSION
    // =========================================

    async function joinSession(
        e,
        sessionId
    ) {

        e.stopPropagation();


        try {

            await api.post(
                `/play/${sessionId}/join`
            );


            alert(
                "Joined play session successfully 🤝"
            );


            navigate(
                `/play/${sessionId}`
            );

        } catch (error) {

            console.log(
                "Join Session Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to join session"
            );

        }

    }


    // =========================================
    // OPEN DETAILS
    // =========================================

    function openSession(sessionId) {

        navigate(
            `/play/${sessionId}`
        );

    }


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (

            <>
                <Navbar />

                <div className="play-page">

                    <div className="play-loading">

                        <div>
                            ⚡
                        </div>

                        <h2>
                            Finding Open Games...
                        </h2>

                        <p>
                            Looking for players
                            around you.
                        </p>

                    </div>

                </div>
            </>

        );

    }


    return (

        <>

            <Navbar />

            <div className="play-page">


                {/* =================================
                    HEADER
                ================================= */}

                <div className="play-header">

                    <div>

                        <span className="play-badge">
                            OPEN PLAY
                        </span>

                        <h1>
                            Find a Game. Find Your Team.
                        </h1>

                        <p>
                            Join nearby game sessions
                            or create your own match.
                        </p>

                    </div>


                    <button
                        className="create-play-btn"
                        onClick={() =>
                            setShowCreate(true)
                        }
                    >
                        + Create Play
                    </button>

                </div>


                {/* =================================
                    SEARCH
                ================================= */}

                <form
                    className="play-search"
                    onSubmit={handleSearch}
                >

                    <input
                        type="text"
                        placeholder="Search by city..."
                        value={city}
                        onChange={(e) =>
                            setCity(e.target.value)
                        }
                    />


                    <input
                        type="text"
                        placeholder="Search by game..."
                        value={game}
                        onChange={(e) =>
                            setGame(e.target.value)
                        }
                    />


                    <button type="submit">
                        🔍 Search
                    </button>


                    {(city || game) && (

                        <button
                            type="button"
                            className="clear-play-btn"
                            onClick={clearFilters}
                        >
                            Clear
                        </button>

                    )}

                </form>


                {/* =================================
                    COUNT
                ================================= */}

                <div className="play-count">

                    <span>
                        {sessions.length}
                    </span>

                    open sessions

                </div>


                {/* =================================
                    SESSIONS
                ================================= */}

                {sessions.length === 0 ? (

                    <div className="empty-play">

                        <div>
                            🎮
                        </div>

                        <h2>
                            No Open Sessions
                        </h2>

                        <p>
                            Create a game and invite
                            nearby players.
                        </p>

                        <button
                            onClick={() =>
                                setShowCreate(true)
                            }
                        >
                            Create Play Session
                        </button>

                    </div>

                ) : (

                    <div className="play-grid">

                        {sessions.map(
                            (session) => {

                                const playerCount =
                                    session.players?.length ||
                                    0;

                                const isFull =
                                    playerCount >=
                                    session.maxPlayers;


                                return (

                                    <div
                                        className="play-card"
                                        key={session._id}
                                        onClick={() =>
                                            openSession(
                                                session._id
                                            )
                                        }
                                    >


                                        {/* TOP */}

                                        <div className="play-card-top">

                                            <div className="game-icon">
                                                🎮
                                            </div>


                                            <span className="scheduled-badge">
                                                ● Scheduled
                                            </span>

                                        </div>


                                        {/* TITLE */}

                                        <h2>
                                            {session.title}
                                        </h2>


                                        <div className="game-name">

                                            🏆 {session.game}

                                        </div>


                                        <p className="play-description">

                                            {
                                                session.description ||
                                                "Looking for players to join this game."
                                            }

                                        </p>


                                        {/* INFO */}

                                        <div className="play-info">

                                            <div>

                                                📍

                                                <span>
                                                    Location
                                                </span>

                                                <strong>
                                                    {session.city}
                                                </strong>

                                            </div>


                                            <div>

                                                🏟️

                                                <span>
                                                    Venue
                                                </span>

                                                <strong>
                                                    {
                                                        session.location
                                                    }
                                                </strong>

                                            </div>


                                            <div>

                                                👥

                                                <span>
                                                    Players
                                                </span>

                                                <strong>
                                                    {
                                                        playerCount
                                                    }
                                                    /
                                                    {
                                                        session.maxPlayers
                                                    }
                                                </strong>

                                            </div>

                                        </div>


                                        {/* DATE */}

                                        <div className="play-date">

                                            📅

                                            <strong>
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
                                            </strong>

                                        </div>


                                        {/* ORGANIZER */}

                                        <div className="play-organizer">

                                            <div className="play-avatar">

                                                {
                                                    session
                                                        .organizer
                                                        ?.name
                                                        ?.charAt(0)
                                                        ?.toUpperCase()
                                                }

                                            </div>


                                            <div>

                                                <span>
                                                    Organized by
                                                </span>

                                                <strong>
                                                    {
                                                        session
                                                            .organizer
                                                            ?.name ||
                                                        "Player"
                                                    }
                                                </strong>

                                            </div>

                                        </div>


                                        {/* BUTTON */}

                                        <button
                                            className={
                                                isFull
                                                    ? "session-full-btn"
                                                    : "join-play-btn"
                                            }

                                            disabled={
                                                isFull
                                            }

                                            onClick={(e) =>
                                                joinSession(
                                                    e,
                                                    session._id
                                                )
                                            }
                                        >

                                            {isFull
                                                ? "🔒 Session Full"
                                                : "🤝 Join Game"
                                            }

                                        </button>


                                        <div className="view-session">
                                            View Details →
                                        </div>

                                    </div>

                                );

                            }
                        )}

                    </div>

                )}

            </div>


            {/* =================================
                CREATE SESSION MODAL
            ================================= */}

            {showCreate && (

                <div
                    className="play-modal-overlay"
                    onClick={() =>
                        setShowCreate(false)
                    }
                >

                    <div
                        className="play-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <button
                            className="play-modal-close"
                            onClick={() =>
                                setShowCreate(false)
                            }
                        >
                            ×
                        </button>


                        <div className="modal-game-icon">
                            🎮
                        </div>


                        <h2>
                            Create Play Session
                        </h2>

                        <p>
                            Create an open game and
                            find players nearby.
                        </p>


                        <form
                            onSubmit={createSession}
                        >


                            <div className="play-field">

                                <label>
                                    Session Title
                                </label>

                                <input
                                    type="text"
                                    placeholder="Sunday Badminton Meetup"
                                    value={title}
                                    onChange={(e) =>
                                        setTitle(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>


                            <div className="play-field">

                                <label>
                                    Game
                                </label>

                                <input
                                    type="text"
                                    placeholder="Badminton"
                                    value={sessionGame}
                                    onChange={(e) =>
                                        setSessionGame(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>


                            <div className="play-field">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    rows="3"
                                    placeholder="Tell players about the game..."
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>


                            <div className="play-form-row">

                                <div className="play-field">

                                    <label>
                                        City
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Bhubaneswar"
                                        value={sessionCity}
                                        onChange={(e) =>
                                            setSessionCity(
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                </div>


                                <div className="play-field">

                                    <label>
                                        Max Players
                                    </label>

                                    <input
                                        type="number"
                                        min="2"
                                        value={maxPlayers}
                                        onChange={(e) =>
                                            setMaxPlayers(
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                </div>

                            </div>


                            <div className="play-field">

                                <label>
                                    Playing Location
                                </label>

                                <input
                                    type="text"
                                    placeholder="Society Clubhouse"
                                    value={location}
                                    onChange={(e) =>
                                        setLocation(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>


                            <div className="play-field">

                                <label>
                                    Date & Time
                                </label>

                                <input
                                    type="datetime-local"
                                    value={date}
                                    onChange={(e) =>
                                        setDate(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>


                            <button
                                type="submit"
                                className="create-session-submit"
                                disabled={creating}
                            >

                                {creating
                                    ? "Creating..."
                                    : "Create Play Session"
                                }

                            </button>

                        </form>

                    </div>

                </div>

            )}

        </>

    );

}


export default PlaySessions;