import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "./Navbar";
import "./MyPartners.css";

function MyPartners() {

    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedPartner, setSelectedPartner] = useState(null);

    const [sport, setSport] = useState("");
    const [location, setLocation] = useState("");
    const [scheduledAt, setScheduledAt] = useState("");

    const [scheduling, setScheduling] = useState(false);


    // =========================================
    // FETCH PARTNERS
    // =========================================

    async function fetchPartners() {

        try {

            setLoading(true);

            const response =
                await api.get("/requests/my-partners");

            setPartners(
                response.data.partners || []
            );

        } catch (error) {

            console.log(
                "Fetch Partners Error:",
                error
            );

        } finally {

            setLoading(false);

        }

    }


    useEffect(() => {

        fetchPartners();

    }, []);


    // =========================================
    // REMOVE PARTNER
    // =========================================

    async function removePartner(id) {

        try {

            await api.delete(
                `/requests/partners/${id}`
            );

            alert(
                "Partner Removed Successfully"
            );

            fetchPartners();

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to remove partner"
            );

        }

    }


    // =========================================
    // OPEN SCHEDULE FORM
    // =========================================

    function openSchedule(partner) {

        setSelectedPartner(partner);

        setSport("");

        setLocation("");

        setScheduledAt("");

    }


    // =========================================
    // CLOSE SCHEDULE FORM
    // =========================================

    function closeSchedule() {

        setSelectedPartner(null);

    }


    // =========================================
    // SCHEDULE GAME
    // =========================================

    async function scheduleGame(e) {

        e.preventDefault();

        if (scheduling) return;


        if (
            !sport ||
            !location ||
            !scheduledAt
        ) {

            alert(
                "Please fill all fields"
            );

            return;

        }


        try {

            setScheduling(true);


            await api.post(

                `/play/schedule/${selectedPartner._id}`,

                {
                    sport,
                    location,
                    scheduledAt
                }

            );


            alert(
                "Game Scheduled Successfully 🎮"
            );


            closeSchedule();


        } catch (error) {

            console.log(
                "Schedule Game Error:",
                error
            );


            alert(
                error.response?.data?.message ||
                "Failed to schedule game"
            );


        } finally {

            setScheduling(false);

        }

    }


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (

            <>

                <Navbar />

                <div className="container">

                    <h2 className="loading">
                        Loading Partners...
                    </h2>

                </div>

            </>

        );

    }


    return (

        <>

            <Navbar />


            <div className="container">

                <div className="heading-section">

                    <span className="page-badge">
                        YOUR GAME CREW
                    </span>

                    <h1 className="heading">
                        My Partners
                    </h1>

                    <p className="page-subtitle">
                        Your accepted sports partners.
                        Choose someone and schedule
                        your next game.
                    </p>

                </div>


                {partners.length === 0 ? (

                    <div className="empty">

                        <div className="empty-icon">
                            🏆
                        </div>

                        <h2>
                            No Partners Yet
                        </h2>

                        <p>
                            Find players and send them
                            a partner request.
                        </p>

                    </div>

                ) : (

                    <div className="partners-grid">

                        {partners.map(
                            (partner) => (

                                <div
                                    className="partner-card"
                                    key={
                                        partner._id
                                    }
                                >

                                    <div className="partner-top">

                                        <div className="avatar">

                                            {
                                                partner.name
                                                    ?.charAt(0)
                                                    ?.toUpperCase()
                                            }

                                        </div>


                                        <div>

                                            <h2>
                                                {
                                                    partner.name
                                                }
                                            </h2>

                                            <span className="partner-status">
                                                ● Connected
                                            </span>

                                        </div>

                                    </div>


                                    <div className="partner-info">

                                        <p>
                                            📍{" "}
                                            <strong>
                                                City
                                            </strong>

                                            <br />

                                            {
                                                partner.city ||
                                                "Not Available"
                                            }

                                        </p>


                                        <p>
                                            🎮{" "}
                                            <strong>
                                                Games
                                            </strong>

                                            <br />

                                            {
                                                partner.sports?.join(
                                                    ", "
                                                ) ||
                                                "Not Available"
                                            }

                                        </p>


                                        <p>
                                            🏅{" "}
                                            <strong>
                                                Skill
                                            </strong>

                                            <br />

                                            {
                                                partner.skillLevel ||
                                                "Not Available"
                                            }

                                        </p>


                                        <p>
                                            🕒{" "}
                                            <strong>
                                                Availability
                                            </strong>

                                            <br />

                                            {
                                                partner.availability?.join(
                                                    ", "
                                                ) ||
                                                "Not Available"
                                            }

                                        </p>

                                    </div>


                                    <div className="partner-actions">

                                        <button
                                            className="schedule-btn"
                                            onClick={() =>
                                                openSchedule(
                                                    partner
                                                )
                                            }
                                        >
                                            🎮 Schedule Game
                                        </button>


                                        <button
                                            className="remove-btn"
                                            onClick={() =>
                                                removePartner(
                                                    partner._id
                                                )
                                            }
                                        >
                                            Remove
                                        </button>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>


            {/* =========================================
                SCHEDULE MODAL
            ========================================= */}

            {selectedPartner && (

                <div
                    className="modal-overlay"
                    onClick={closeSchedule}
                >

                    <div
                        className="schedule-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <button
                            className="modal-close"
                            onClick={closeSchedule}
                        >
                            ×
                        </button>


                        <div className="modal-icon">
                            🎮
                        </div>


                        <h2>
                            Schedule Game
                        </h2>


                        <p>
                            Play with{" "}
                            <strong>
                                {
                                    selectedPartner.name
                                }
                            </strong>
                        </p>


                        <form
                            onSubmit={scheduleGame}
                        >

                            {/* SPORT */}

                            <div className="modal-field">

                                <label>
                                    Game
                                </label>

                                <select
                                    value={sport}
                                    onChange={(e) =>
                                        setSport(
                                            e.target.value
                                        )
                                    }
                                    required
                                >

                                    <option value="">
                                        Select Game
                                    </option>

                                    <option value="Football">
                                        Football
                                    </option>

                                    <option value="Cricket">
                                        Cricket
                                    </option>

                                    <option value="Badminton">
                                        Badminton
                                    </option>

                                    <option value="Basketball">
                                        Basketball
                                    </option>

                                    <option value="Tennis">
                                        Tennis
                                    </option>

                                    <option value="Volleyball">
                                        Volleyball
                                    </option>

                                    <option value="Chess">
                                        Chess
                                    </option>

                                    <option value="Carrom">
                                        Carrom
                                    </option>

                                    <option value="Table Tennis">
                                        Table Tennis
                                    </option>

                                    <option value="Cards">
                                        Cards
                                    </option>

                                </select>

                            </div>


                            {/* LOCATION */}

                            <div className="modal-field">

                                <label>
                                    Playing Location
                                </label>

                                <select
                                    value={location}
                                    onChange={(e) =>
                                        setLocation(
                                            e.target.value
                                        )
                                    }
                                    required
                                >

                                    <option value="">
                                        Select Location
                                    </option>

                                    <option value="Home">
                                        Home
                                    </option>

                                    <option value="Society Clubhouse">
                                        Society Clubhouse
                                    </option>

                                    <option value="Local Ground">
                                        Local Ground
                                    </option>

                                    <option value="Other">
                                        Other
                                    </option>

                                </select>

                            </div>


                            {/* DATE */}

                            <div className="modal-field">

                                <label>
                                    Date & Time
                                </label>

                                <input
                                    type="datetime-local"
                                    value={
                                        scheduledAt
                                    }
                                    onChange={(e) =>
                                        setScheduledAt(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>


                            <button
                                className="schedule-submit"
                                type="submit"
                                disabled={
                                    scheduling
                                }
                            >

                                {scheduling
                                    ? "Scheduling..."
                                    : "Schedule Game"
                                }

                            </button>

                        </form>

                    </div>

                </div>

            )}

        </>

    );

}

export default MyPartners;