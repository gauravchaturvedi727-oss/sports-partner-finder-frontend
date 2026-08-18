import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import Navbar from "./Navbar";

import "./Communities.css";


function Communities() {

    const navigate = useNavigate();


    const [communities, setCommunities] =
        useState([]);

    const [loading, setLoading] =
        useState(true);


    const [city, setCity] =
        useState("");

    const [searchCity, setSearchCity] =
        useState("");


    const [showCreate, setShowCreate] =
        useState(false);


    const [name, setName] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [communityCity, setCommunityCity] =
        useState("");

    const [location, setLocation] =
        useState("");


    const [creating, setCreating] =
        useState(false);


    // =========================================
    // FETCH COMMUNITIES
    // =========================================

    async function fetchCommunities(
        selectedCity = ""
    ) {

        try {

            setLoading(true);


            const url = selectedCity
                ? `/communities?city=${encodeURIComponent(
                    selectedCity
                )}`
                : "/communities";


            const response =
                await api.get(url);


            setCommunities(
                response.data.communities || []
            );


        } catch (error) {

            console.log(
                "Fetch Communities Error:",
                error
            );


        } finally {

            setLoading(false);

        }

    }


    useEffect(() => {

        fetchCommunities();

    }, []);


    // =========================================
    // SEARCH
    // =========================================

    function handleSearch(e) {

        e.preventDefault();

        setCity(searchCity);

        fetchCommunities(searchCity);

    }


    // =========================================
    // CLEAR SEARCH
    // =========================================

    function clearSearch() {

        setSearchCity("");

        setCity("");

        fetchCommunities("");

    }


    // =========================================
    // CREATE COMMUNITY
    // =========================================

    async function createCommunity(e) {

        e.preventDefault();


        if (creating) return;


        try {

            setCreating(true);


            await api.post(
                "/communities",
                {
                    name,
                    description,
                    city: communityCity,
                    location
                }
            );


            alert(
                "Community created successfully 🎉"
            );


            setName("");

            setDescription("");

            setCommunityCity("");

            setLocation("");

            setShowCreate(false);


            fetchCommunities(city);


        } catch (error) {

            console.log(
                "Create Community Error:",
                error
            );


            alert(
                error.response?.data?.message ||
                "Failed to create community"
            );


        } finally {

            setCreating(false);

        }

    }


    // =========================================
    // JOIN COMMUNITY
    // =========================================

    async function joinCommunity(
        e,
        communityId
    ) {

        // Prevent card click
        e.stopPropagation();


        try {

            await api.post(
                `/communities/${communityId}/join`
            );


            alert(
                "Joined community successfully 🤝"
            );


            // Open details page
            navigate(
                `/communities/${communityId}`
            );


        } catch (error) {

            console.log(
                "Join Community Error:",
                error
            );


            alert(
                error.response?.data?.message ||
                "Failed to join community"
            );

        }

    }


    // =========================================
    // OPEN COMMUNITY
    // =========================================

    function openCommunity(
        communityId
    ) {

        navigate(
            `/communities/${communityId}`
        );

    }


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (

            <>

                <Navbar />


                <div className="community-page">

                    <div className="community-loading">

                        <div className="loading-icon">
                            ⚡
                        </div>

                        <h2>
                            Finding Communities...
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


            <div className="community-page">


                {/* =================================
                    HEADER
                ================================= */}

                <div className="community-header">

                    <div>

                        <span className="community-badge">
                            COMMUNITY HUB
                        </span>


                        <h1>
                            Find Your Game Community
                        </h1>


                        <p>
                            Join local sports and
                            recreational communities,
                            meet players and play together.
                        </p>

                    </div>


                    <button
                        className="create-community-btn"
                        onClick={() =>
                            setShowCreate(true)
                        }
                    >

                        + Create Community

                    </button>

                </div>


                {/* =================================
                    SEARCH
                ================================= */}

                <form
                    className="community-search"
                    onSubmit={handleSearch}
                >

                    <input
                        type="text"
                        placeholder="Search communities by city..."
                        value={searchCity}
                        onChange={(e) =>
                            setSearchCity(
                                e.target.value
                            )
                        }
                    />


                    <button type="submit">
                        🔍 Search
                    </button>


                    {city && (

                        <button
                            type="button"
                            className="clear-search"
                            onClick={clearSearch}
                        >
                            Clear
                        </button>

                    )}

                </form>


                {/* =================================
                    COUNT
                ================================= */}

                <div className="community-count">

                    <span>
                        {communities.length}
                    </span>

                    communities found

                    {city && (

                        <>
                            {" "}in{" "}

                            <strong>
                                {city}
                            </strong>
                        </>

                    )}

                </div>


                {/* =================================
                    COMMUNITY LIST
                ================================= */}

                {communities.length === 0 ? (

                    <div className="empty-community">

                        <div className="empty-community-icon">
                            🏟️
                        </div>


                        <h2>
                            No Communities Found
                        </h2>


                        <p>
                            Be the first to create
                            a community in your area.
                        </p>


                        <button
                            onClick={() =>
                                setShowCreate(true)
                            }
                        >
                            Create Community
                        </button>

                    </div>

                ) : (

                    <div className="community-grid">

                        {communities.map(
                            (community) => (

                                <div
                                    className="community-card"
                                    key={
                                        community._id
                                    }

                                    onClick={() =>
                                        openCommunity(
                                            community._id
                                        )
                                    }
                                >


                                    {/* =====================
                                        CARD TOP
                                    ===================== */}

                                    <div className="community-card-top">

                                        <div className="community-icon">
                                            🏆
                                        </div>


                                        <span className="active-community">
                                            ● Active
                                        </span>

                                    </div>


                                    {/* =====================
                                        NAME
                                    ===================== */}

                                    <h2>
                                        {community.name}
                                    </h2>


                                    <p className="community-description">

                                        {
                                            community.description ||
                                            "Local sports and gaming community"
                                        }

                                    </p>


                                    {/* =====================
                                        INFO
                                    ===================== */}

                                    <div className="community-info">

                                        <div>

                                            📍

                                            <strong>
                                                City
                                            </strong>

                                            <br />

                                            {
                                                community.city
                                            }

                                        </div>


                                        <div>

                                            🏟️

                                            <strong>
                                                Location
                                            </strong>

                                            <br />

                                            {
                                                community.location ||
                                                "Not specified"
                                            }

                                        </div>


                                        <div>

                                            👥

                                            <strong>
                                                Members
                                            </strong>

                                            <br />

                                            {
                                                community.members
                                                    ?.length ||
                                                0
                                            }

                                        </div>

                                    </div>


                                    {/* =====================
                                        ORGANIZER
                                    ===================== */}

                                    <div className="organizer">

                                        <div className="organizer-avatar">

                                            {
                                                community
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
                                                    community
                                                        .organizer
                                                        ?.name ||
                                                    "Organizer"
                                                }

                                            </strong>

                                        </div>

                                    </div>


                                    {/* =====================
                                        JOIN
                                    ===================== */}

                                    <button
                                        className="join-community-btn"

                                        onClick={(e) =>
                                            joinCommunity(
                                                e,
                                                community._id
                                            )
                                        }
                                    >

                                        🤝 Join Community

                                    </button>


                                    <div className="view-community">

                                        View Community →

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}


            </div>


            {/* =================================
                CREATE COMMUNITY MODAL
            ================================= */}

            {showCreate && (

                <div
                    className="community-modal-overlay"

                    onClick={() =>
                        setShowCreate(false)
                    }
                >

                    <div
                        className="community-modal"

                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >


                        <button
                            className="community-modal-close"

                            onClick={() =>
                                setShowCreate(false)
                            }
                        >
                            ×
                        </button>


                        <div className="modal-community-icon">
                            🏟️
                        </div>


                        <h2>
                            Create Community
                        </h2>


                        <p>
                            Build a local space for
                            players to connect and play.
                        </p>


                        <form
                            onSubmit={
                                createCommunity
                            }
                        >


                            {/* NAME */}

                            <div className="community-field">

                                <label>
                                    Community Name
                                </label>


                                <input
                                    type="text"

                                    placeholder="e.g. Bhubaneswar Sports Club"

                                    value={name}

                                    onChange={(e) =>
                                        setName(
                                            e.target.value
                                        )
                                    }

                                    required
                                />

                            </div>


                            {/* DESCRIPTION */}

                            <div className="community-field">

                                <label>
                                    Description
                                </label>


                                <textarea
                                    placeholder="Tell players about your community..."

                                    value={description}

                                    onChange={(e) =>
                                        setDescription(
                                            e.target.value
                                        )
                                    }

                                    rows="3"
                                />

                            </div>


                            {/* CITY */}

                            <div className="community-field">

                                <label>
                                    City
                                </label>


                                <input
                                    type="text"

                                    placeholder="e.g. Bhubaneswar"

                                    value={
                                        communityCity
                                    }

                                    onChange={(e) =>
                                        setCommunityCity(
                                            e.target.value
                                        )
                                    }

                                    required
                                />

                            </div>


                            {/* LOCATION */}

                            <div className="community-field">

                                <label>
                                    Playing Location
                                </label>


                                <input
                                    type="text"

                                    placeholder="e.g. Society Clubhouse"

                                    value={location}

                                    onChange={(e) =>
                                        setLocation(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>


                            {/* SUBMIT */}

                            <button
                                className="create-submit-btn"

                                type="submit"

                                disabled={
                                    creating
                                }
                            >

                                {creating
                                    ? "Creating..."
                                    : "Create Community"
                                }

                            </button>


                        </form>


                    </div>

                </div>

            )}

        </>

    );

}


export default Communities;