import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";
import Navbar from "./Navbar";

import "./CommunityDetails.css";


function CommunityDetails() {

    const { communityId } = useParams();

    const navigate = useNavigate();

    const [community, setCommunity] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [actionLoading, setActionLoading] =
        useState(false);


    // =========================================
    // FETCH COMMUNITY
    // =========================================

    async function fetchCommunity() {

        try {

            setLoading(true);

            const response =
                await api.get(
                    `/communities/${communityId}`
                );

            setCommunity(
                response.data.community
            );

        } catch (error) {

            console.log(
                "Community Details Error:",
                error
            );

        } finally {

            setLoading(false);

        }

    }


    useEffect(() => {

        fetchCommunity();

    }, [communityId]);


    // =========================================
    // CHECK MEMBERSHIP
    // =========================================

    function isMember() {

        const userId =
            localStorage.getItem("userId");

        if (!community || !userId) {
            return false;
        }

        return community.members?.some(
            (member) =>
                member._id === userId
        );

    }


    // =========================================
    // CHECK ORGANIZER
    // =========================================

    function isOrganizer() {

        const userId =
            localStorage.getItem("userId");

        return (
            community?.organizer?._id ===
            userId
        );

    }


    // =========================================
    // JOIN
    // =========================================

    async function joinCommunity() {

        try {

            setActionLoading(true);

            await api.post(
                `/communities/${communityId}/join`
            );

            await fetchCommunity();

            alert(
                "Joined community successfully 🤝"
            );

        } catch (error) {

            console.log(
                "Join Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to join community"
            );

        } finally {

            setActionLoading(false);

        }

    }


    // =========================================
    // LEAVE
    // =========================================

    async function leaveCommunity() {

        const confirmLeave =
            window.confirm(
                "Are you sure you want to leave this community?"
            );

        if (!confirmLeave) return;


        try {

            setActionLoading(true);

            await api.delete(
                `/communities/${communityId}/leave`
            );

            await fetchCommunity();

            alert(
                "You left the community"
            );

        } catch (error) {

            console.log(
                "Leave Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to leave community"
            );

        } finally {

            setActionLoading(false);

        }

    }


    // =========================================
    // DEACTIVATE
    // =========================================

    async function deactivateCommunity() {

        const confirmDeactivate =
            window.confirm(
                "Are you sure you want to deactivate this community?"
            );

        if (!confirmDeactivate) return;


        try {

            setActionLoading(true);

            await api.patch(
                `/communities/${communityId}/deactivate`
            );

            alert(
                "Community deactivated"
            );

            navigate(
                "/communities",
                { replace: true }
            );

        } catch (error) {

            console.log(
                "Deactivate Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to deactivate community"
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

                <div className="community-details-page">

                    <div className="details-loading">

                        <div>
                            ⚡
                        </div>

                        <h2>
                            Loading Community...
                        </h2>

                    </div>

                </div>

            </>

        );

    }


    // =========================================
    // NOT FOUND
    // =========================================

    if (!community) {

        return (

            <>

                <Navbar />

                <div className="community-details-page">

                    <div className="community-not-found">

                        <div>
                            🏟️
                        </div>

                        <h2>
                            Community Not Found
                        </h2>

                        <button
                            onClick={() =>
                                navigate(
                                    "/communities"
                                )
                            }
                        >
                            Back to Communities
                        </button>

                    </div>

                </div>

            </>

        );

    }


    return (

        <>

            <Navbar />


            <div className="community-details-page">


                {/* =================================
                    BACK BUTTON
                ================================= */}

                <button
                    className="back-community-btn"
                    onClick={() =>
                        navigate(
                            "/communities"
                        )
                    }
                >
                    ← Back to Communities
                </button>


                {/* =================================
                    HERO
                ================================= */}

                <div className="community-details-hero">

                    <div className="details-hero-icon">
                        🏆
                    </div>


                    <div className="details-hero-content">

                        <span className="community-badge">
                            COMMUNITY
                        </span>

                        <h1>
                            {community.name}
                        </h1>

                        <p>
                            {community.description ||
                                "Local sports and recreational community"}
                        </p>

                    </div>


                    <div className="details-status">
                        ● Active
                    </div>

                </div>


                {/* =================================
                    COMMUNITY INFO
                ================================= */}

                <div className="details-info-grid">

                    <div className="details-info-card">

                        <span>
                            📍
                        </span>

                        <div>

                            <small>
                                City
                            </small>

                            <strong>
                                {community.city}
                            </strong>

                        </div>

                    </div>


                    <div className="details-info-card">

                        <span>
                            🏟️
                        </span>

                        <div>

                            <small>
                                Playing Location
                            </small>

                            <strong>
                                {community.location ||
                                    "Not specified"}
                            </strong>

                        </div>

                    </div>


                    <div className="details-info-card">

                        <span>
                            👥
                        </span>

                        <div>

                            <small>
                                Members
                            </small>

                            <strong>
                                {community.members?.length ||
                                    0}
                            </strong>

                        </div>

                    </div>


                    <div className="details-info-card">

                        <span>
                            🎮
                        </span>

                        <div>

                            <small>
                                Community Type
                            </small>

                            <strong>
                                Sports & Games
                            </strong>

                        </div>

                    </div>

                </div>


                {/* =================================
                    MAIN CONTENT
                ================================= */}

                <div className="community-details-layout">


                    {/* MEMBERS */}

                    <div className="members-panel">

                        <div className="panel-header">

                            <div>

                                <h2>
                                    Community Members
                                </h2>

                                <p>
                                    Players in this community
                                </p>

                            </div>

                            <span>
                                {
                                    community.members?.length ||
                                    0
                                }
                            </span>

                        </div>


                        <div className="members-list">

                            {community.members?.map(
                                (member) => (

                                    <div
                                        className="member-card"
                                        key={
                                            member._id
                                        }
                                    >

                                        <div className="member-avatar">

                                            {
                                                member.name
                                                    ?.charAt(0)
                                                    ?.toUpperCase()
                                            }

                                        </div>


                                        <div className="member-info">

                                            <strong>
                                                {
                                                    member.name
                                                }
                                            </strong>

                                            <span>
                                                {
                                                    member.city ||
                                                    "Location not available"
                                                }
                                            </span>

                                        </div>


                                        {
                                            member._id ===
                                            community.organizer?._id
                                                ? (
                                                    <span className="organizer-tag">
                                                        Organizer
                                                    </span>
                                                )
                                                : (
                                                    <span className="member-tag">
                                                        Member
                                                    </span>
                                                )
                                        }

                                    </div>

                                )
                            )}

                        </div>

                    </div>


                    {/* SIDEBAR */}

                    <div className="community-action-panel">


                        {/* ORGANIZER */}

                        <div className="organizer-box">

                            <span>
                                ORGANIZED BY
                            </span>


                            <div className="organizer-large">

                                <div className="organizer-large-avatar">

                                    {
                                        community.organizer
                                            ?.name
                                            ?.charAt(0)
                                            ?.toUpperCase()
                                    }

                                </div>


                                <div>

                                    <strong>
                                        {
                                            community.organizer
                                                ?.name ||
                                            "Organizer"
                                        }
                                    </strong>

                                    <small>
                                        {
                                            community.organizer
                                                ?.city ||
                                            "Local Organizer"
                                        }
                                    </small>

                                </div>

                            </div>

                        </div>


                        {/* ACTION */}

                        {!isOrganizer() && (

                            isMember() ? (

                                <button
                                    className="leave-community-btn"
                                    onClick={
                                        leaveCommunity
                                    }
                                    disabled={
                                        actionLoading
                                    }
                                >

                                    {actionLoading
                                        ? "Processing..."
                                        : "Leave Community"
                                    }

                                </button>

                            ) : (

                                <button
                                    className="join-details-btn"
                                    onClick={
                                        joinCommunity
                                    }
                                    disabled={
                                        actionLoading
                                    }
                                >

                                    {actionLoading
                                        ? "Joining..."
                                        : "🤝 Join Community"
                                    }

                                </button>

                            )

                        )}


                        {/* ORGANIZER ACTION */}

                        {isOrganizer() && (

                            <button
                                className="deactivate-community-btn"
                                onClick={
                                    deactivateCommunity
                                }
                                disabled={
                                    actionLoading
                                }
                            >

                                Deactivate Community

                            </button>

                        )}

                    </div>

                </div>

            </div>

        </>

    );

}

export default CommunityDetails;