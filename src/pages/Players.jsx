import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import Navbar from "./Navbar";

import "./Players.css";


function Players() {

    const navigate = useNavigate();

    const [players, setPlayers] = useState([]);

    // Filters
    const [city, setCity] = useState("");
    const [sport, setSport] = useState("");
    const [skillLevel, setSkillLevel] = useState("");
    const [availability, setAvailability] = useState("");

    // Nearby
    const [nearbyMode, setNearbyMode] = useState(false);
    const [radius, setRadius] = useState(10);
    const [userLocation, setUserLocation] = useState(null);

    // Loading
    const [loading, setLoading] = useState(true);
    const [locationLoading, setLocationLoading] = useState(false);
    const [requestLoading, setRequestLoading] = useState(null);
    const [reportLoading, setReportLoading] = useState(false);

    // Report
    const [reportUser, setReportUser] = useState(null);
    const [reportReason, setReportReason] = useState("");
    const [reportDescription, setReportDescription] = useState("");


    // =========================================
    // FETCH PLAYERS
    // =========================================

    async function fetchPlayers(filters = {}) {

        try {

            setLoading(true);

            const params = new URLSearchParams();


            if (filters.city?.trim()) {

                params.append(
                    "city",
                    filters.city.trim()
                );

            }


            if (filters.sport?.trim()) {

                params.append(
                    "sport",
                    filters.sport.trim()
                );

            }


            if (filters.skillLevel) {

                params.append(
                    "skillLevel",
                    filters.skillLevel
                );

            }


            if (filters.availability) {

                params.append(
                    "availability",
                    filters.availability
                );

            }


            // Nearby location
            if (
                filters.latitude !== undefined &&
                filters.longitude !== undefined
            ) {

                params.append(
                    "latitude",
                    filters.latitude
                );

                params.append(
                    "longitude",
                    filters.longitude
                );

                params.append(
                    "radius",
                    filters.radius || 10
                );

            }


            const query =
                params.toString()
                    ? `?${params.toString()}`
                    : "";


            const response = await api.get(
                `/profile/search-partners${query}`
            );


            setPlayers(
                response.data.users || []
            );


        } catch (error) {

            console.log(
                "Fetch Players Error:",
                error
            );

        } finally {

            setLoading(false);

        }

    }


    // =========================================
    // INITIAL LOAD
    // =========================================

    useEffect(() => {

        fetchPlayers({
            city: "",
            sport: "",
            skillLevel: "",
            availability: ""
        });

    }, []);


    // =========================================
    // SEARCH
    // =========================================

    function handleSearch(e) {

        e.preventDefault();

        fetchPlayers({

            city,
            sport,
            skillLevel,
            availability,

            ...(nearbyMode && userLocation
                ? {
                    latitude:
                        userLocation.latitude,

                    longitude:
                        userLocation.longitude,

                    radius
                }
                : {}
            )

        });

    }


    // =========================================
    // CLEAR FILTERS
    // =========================================

    function clearFilters() {

        setCity("");
        setSport("");
        setSkillLevel("");
        setAvailability("");

        setNearbyMode(false);
        setUserLocation(null);
        setRadius(10);

        fetchPlayers({

            city: "",
            sport: "",
            skillLevel: "",
            availability: ""

        });

    }


    // =========================================
    // USE MY LOCATION
    // =========================================

    function useMyLocation() {

        if (!navigator.geolocation) {

            alert(
                "Geolocation is not supported by your browser."
            );

            return;

        }


        setLocationLoading(true);


        navigator.geolocation.getCurrentPosition(

            async (position) => {

                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;


                const location = {
                    latitude,
                    longitude
                };


                setUserLocation(location);

                setNearbyMode(true);

                try {

                    await api.patch(
                        "/profile",
                        {
                            latitude,
                            longitude
                        }
                    );

                } catch (saveError) {

                    console.log(
                        "Save Location Error:",
                        saveError
                    );

                }

                setLocationLoading(false);


                fetchPlayers({

                    city: "",
                    sport,
                    skillLevel,
                    availability,

                    latitude,
                    longitude,

                    radius

                });

            },


            (error) => {

                console.log(
                    "Location Error:",
                    error
                );

                setLocationLoading(false);

                alert(
                    "Please allow location access to find nearby players."
                );

            }

        );

    }


    // =========================================
    // CHANGE RADIUS
    // =========================================

    function handleRadiusChange(e) {

        const newRadius =
            Number(e.target.value);

        setRadius(newRadius);


        if (
            nearbyMode &&
            userLocation
        ) {

            fetchPlayers({

                city,
                sport,
                skillLevel,
                availability,

                latitude:
                    userLocation.latitude,

                longitude:
                    userLocation.longitude,

                radius: newRadius

            });

        }

    }


    // =========================================
    // SEND PARTNER REQUEST
    // =========================================

    async function sendRequest(
        e,
        receiverId
    ) {

        e.stopPropagation();


        try {

            setRequestLoading(receiverId);


            await api.post(
                `/requests/send/${receiverId}`
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

            setRequestLoading(null);

        }

    }


    // =========================================
    // OPEN PROFILE
    // =========================================

    function openPlayer(playerId) {

        navigate(
            `/players/${playerId}`
        );

    }


    // =========================================
    // OPEN REPORT MODAL
    // =========================================

    function openReport(e, player) {

        e.stopPropagation();

        setReportUser(player);

        setReportReason("");

        setReportDescription("");

    }


    // =========================================
    // SUBMIT REPORT
    // =========================================

    async function submitReport() {

        if (!reportReason) {

            alert(
                "Please select a reason."
            );

            return;

        }


        try {

            setReportLoading(true);


            await api.post(
                `/reports/${reportUser._id}`,
                {
                    reason: reportReason,
                    description:
                        reportDescription
                }
            );


            alert(
                "Report submitted successfully."
            );


            setReportUser(null);

            setReportReason("");

            setReportDescription("");


        } catch (error) {

            console.log(
                "Report Error:",
                error
            );


            alert(
                error.response?.data?.message ||
                "Failed to submit report"
            );


        } finally {

            setReportLoading(false);

        }

    }


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (

            <>
                <Navbar />

                <div className="players-page">

                    <div className="players-loading">

                        <div className="loading-icon">
                            ⚡
                        </div>

                        <h2>
                            Finding Players...
                        </h2>

                        <p>
                            Looking for players
                            matching your preferences.
                        </p>

                    </div>

                </div>
            </>

        );

    }


    return (

        <>
            <Navbar />

            <div className="players-page">


                {/* =================================
                    HEADER
                ================================= */}

                <div className="players-header">

                    <div>

                        <span className="players-badge">
                            FIND YOUR PARTNER
                        </span>

                        <h1>
                            Discover Players
                        </h1>

                        <p>
                            Find people nearby who
                            love the same games.
                        </p>

                    </div>

                </div>


                {/* =================================
                    FILTERS
                ================================= */}

                <form
                    className="players-filters"
                    onSubmit={handleSearch}
                >

                    <input
                        type="text"
                        placeholder="📍 City"
                        value={city}
                        onChange={(e) =>
                            setCity(e.target.value)
                        }
                    />


                    <input
                        type="text"
                        placeholder="🏆 Game"
                        value={sport}
                        onChange={(e) =>
                            setSport(e.target.value)
                        }
                    />


                    <select
                        value={skillLevel}
                        onChange={(e) =>
                            setSkillLevel(
                                e.target.value
                            )
                        }
                    >

                        <option value="">
                            All Skill Levels
                        </option>

                        <option value="Beginner">
                            Beginner
                        </option>

                        <option value="Intermediate">
                            Intermediate
                        </option>

                        <option value="Advanced">
                            Advanced
                        </option>

                    </select>


                    <select
                        value={availability}
                        onChange={(e) =>
                            setAvailability(
                                e.target.value
                            )
                        }
                    >

                        <option value="">
                            Any Availability
                        </option>

                        <option value="Morning">
                            Morning
                        </option>

                        <option value="Afternoon">
                            Afternoon
                        </option>

                        <option value="Evening">
                            Evening
                        </option>

                        <option value="Weekend">
                            Weekend
                        </option>

                    </select>


                    <button
                        type="submit"
                        className="players-search-btn"
                    >
                        🔍 Search
                    </button>


                    <button
                        type="button"
                        className="clear-filter-btn"
                        onClick={
                            clearFilters
                        }
                    >
                        Clear
                    </button>


                    {/* NEARBY */}

                    <button
                        type="button"
                        className={
                            nearbyMode
                                ? "nearby-btn active"
                                : "nearby-btn"
                        }
                        onClick={
                            useMyLocation
                        }
                        disabled={
                            locationLoading
                        }
                    >

                        {locationLoading
                            ? "Locating..."
                            : "📍 Nearby Me"
                        }

                    </button>


                    {/* RADIUS */}

                    <select
                        value={radius}
                        onChange={
                            handleRadiusChange
                        }
                        disabled={
                            !nearbyMode
                        }
                    >

                        <option value={5}>
                            Within 5 km
                        </option>

                        <option value={10}>
                            Within 10 km
                        </option>

                        <option value={25}>
                            Within 25 km
                        </option>

                        <option value={50}>
                            Within 50 km
                        </option>

                    </select>

                </form>


                {/* =================================
                    RESULT INFO
                ================================= */}

                <div className="players-result-header">

                    <div>

                        <span>
                            {players.length}
                        </span>

                        players found

                    </div>


                    <div className="result-right">

                        {nearbyMode && (

                            <div className="nearby-active">
                                📍 Within {radius} km
                            </div>

                        )}


                        {(city ||
                            sport ||
                            skillLevel ||
                            availability) && (

                            <div className="active-filters">
                                Filters applied
                            </div>

                        )}

                    </div>

                </div>


                {/* =================================
                    EMPTY
                ================================= */}

                {players.length === 0 ? (

                    <div className="players-empty">

                        <div>
                            🔎
                        </div>

                        <h2>
                            No Players Found
                        </h2>

                        <p>
                            Try changing your
                            search filters or
                            increasing the radius.
                        </p>

                        <button
                            onClick={
                                clearFilters
                            }
                        >
                            Clear Filters
                        </button>

                    </div>

                ) : (

                    <div className="players-grid">

                        {players.map(
                            (player) => (

                                <div
                                    className="player-card"
                                    key={
                                        player._id
                                    }
                                    onClick={() =>
                                        openPlayer(
                                            player._id
                                        )
                                    }
                                >

                                    {/* TOP */}

                                    <div className="player-card-top">

                                        <div className="player-avatar">

                                            {
                                                player.name
                                                    ?.charAt(0)
                                                    ?.toUpperCase()
                                            }

                                        </div>


                                        <span className="player-online">

                                            ●{" "}

                                            {
                                                Array.isArray(player.availability)
                                                ? player.availability.join(", ")
                                                : player.availability ||
                                                  "Available"
                                            }

                                        </span>

                                    </div>


                                    {/* NAME */}

                                    <h2>
                                        {player.name}
                                    </h2>


                                    {/* LOCATION */}

                                    <div className="player-location">

                                        📍{" "}

                                        {
                                            player.city ||
                                            "Location unavailable"
                                        }

                                    </div>


                                    {/* SPORT */}

                                    <div className="player-sport">

                                        🏆{" "}

                                        {
                                            Array.isArray(
                                                player.sports
                                            )
                                                ? player.sports.join(
                                                    ", "
                                                )
                                                : player.sports ||
                                                  "Game not specified"
                                        }

                                    </div>


                                    {/* DETAILS */}

                                    <div className="player-details">

                                        <div>

                                            <span>
                                                SKILL
                                            </span>

                                            <strong>
                                                {
                                                    player.skillLevel ||
                                                    "Not specified"
                                                }
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                AVAILABLE
                                            </span>

                                            <strong>
                                                {
                                                    Array.isArray(player.availability)
                                                    ? player.availability.join(", ")
                                                    : player.availability ||
                                                      "Not specified"
                                                }
                                            </strong>

                                        </div>

                                    </div>


                                    {/* REQUEST */}

                                    <button
                                        type="button"
                                        className="send-request-btn"
                                        onClick={(e) =>
                                            sendRequest(
                                                e,
                                                player._id
                                            )
                                        }
                                        disabled={
                                            requestLoading ===
                                            player._id
                                        }
                                    >

                                        {requestLoading ===
                                        player._id
                                            ? "Sending..."
                                            : "🤝 Send Play Request"
                                        }

                                    </button>


                                    {/* REPORT */}

                                    <button
                                        type="button"
                                        className="report-user-btn"
                                        onClick={(e) =>
                                            openReport(
                                                e,
                                                player
                                            )
                                        }
                                    >
                                        🚩 Report User
                                    </button>


                                    <div className="view-player">
                                        View Profile →
                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}


                {/* =================================
                    REPORT MODAL
                ================================= */}

                {reportUser && (

                    <div
                        className="report-overlay"
                        onClick={() =>
                            setReportUser(null)
                        }
                    >

                        <div
                            className="report-modal"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >

                            <div className="report-modal-header">

                                <div>

                                    <span>
                                        SAFETY
                                    </span>

                                    <h2>
                                        Report User
                                    </h2>

                                </div>


                                <button
                                    type="button"
                                    className="close-report-btn"
                                    onClick={() =>
                                        setReportUser(null)
                                    }
                                >
                                    ×
                                </button>

                            </div>


                            <p className="report-user-name">

                                Reporting{" "}

                                <strong>
                                    {reportUser.name}
                                </strong>

                            </p>


                            <label>
                                Reason
                            </label>

                            <select
                                value={reportReason}
                                onChange={(e) =>
                                    setReportReason(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="">
                                    Select a reason
                                </option>

                                <option value="spam">
                                    Spam
                                </option>

                                <option value="harassment">
                                    Harassment
                                </option>

                                <option value="inappropriate_behavior">
                                    Inappropriate behavior
                                </option>

                                <option value="fake_profile">
                                    Fake profile
                                </option>

                                <option value="other">
                                    Other
                                </option>

                            </select>


                            <label>
                                Description
                            </label>

                            <textarea
                                value={
                                    reportDescription
                                }
                                onChange={(e) =>
                                    setReportDescription(
                                        e.target.value
                                    )
                                }
                                placeholder="Tell us what happened..."
                                maxLength={500}
                            />


                            <div className="report-actions">

                                <button
                                    type="button"
                                    className="cancel-report-btn"
                                    onClick={() =>
                                        setReportUser(
                                            null
                                        )
                                    }
                                >
                                    Cancel
                                </button>


                                <button
                                    type="button"
                                    className="submit-report-btn"
                                    onClick={
                                        submitReport
                                    }
                                    disabled={
                                        reportLoading
                                    }
                                >

                                    {reportLoading
                                        ? "Submitting..."
                                        : "🚩 Submit Report"
                                    }

                                </button>

                            </div>

                        </div>

                    </div>

                )}

            </div>
        </>
    );
}


export default Players;