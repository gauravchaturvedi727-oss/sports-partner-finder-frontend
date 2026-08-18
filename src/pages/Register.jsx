import { useState } from "react";
import { State, City } from "country-state-city";
import { Link, useNavigate } from "react-router-dom";

import {
    FaUser,
    FaEnvelope,
    FaLock,
    FaFutbol,
    FaMapMarkerAlt,
    FaClock,
    FaMedal,
} from "react-icons/fa";

import api from "../services/api";
import "./Register.css";


function Register() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [sports, setSports] = useState([]);

    const [state, setState] = useState("");
    const [city, setCity] = useState("");

    const [skillLevel, setSkillLevel] = useState("");

    const [availability, setAvailability] = useState([]);

    const [playingLocation, setPlayingLocation] = useState("");

    const [loading, setLoading] = useState(false);


    const states = State.getStatesOfCountry("IN");

    const cities = state
        ? City.getCitiesOfState("IN", state)
        : [];


    const sportOptions = [
        "Football",
        "Cricket",
        "Badminton",
        "Basketball",
        "Tennis",
        "Volleyball",
        "Chess",
        "Carrom",
        "Table Tennis",
        "Cards"
    ];


    const availabilityOptions = [
        "Morning",
        "Afternoon",
        "Evening",
        "Night",
        "Weekend"
    ];


    /* =========================
       SPORT SELECTION
    ========================= */

    function handleSportChange(sport) {

        setSports((previous) => {

            if (previous.includes(sport)) {

                return previous.filter(
                    (item) => item !== sport
                );

            }

            return [...previous, sport];

        });

    }


    /* =========================
       AVAILABILITY SELECTION
    ========================= */

    function handleAvailabilityChange(time) {

        setAvailability((previous) => {

            if (previous.includes(time)) {

                return previous.filter(
                    (item) => item !== time
                );

            }

            return [...previous, time];

        });

    }


    /* =========================
       REGISTER
    ========================= */

    async function RegisterHandler(e) {

        e.preventDefault();

        if (loading) return;


        if (
            !name ||
            !email ||
            !password ||
            sports.length === 0 ||
            !state ||
            !city ||
            !skillLevel ||
            availability.length === 0 ||
            !playingLocation
        ) {

            alert(
                "Please complete all required fields"
            );

            return;
        }


        if (password.length < 8) {

            alert(
                "Password must be at least 8 characters"
            );

            return;
        }


        setLoading(true);


        try {

            await api.post("/auth/signup", {

                name,

                email,

                password,

                city,

                state,

                sports,

                skillLevel,

                availability,

                playingLocation

            });


            alert(
                "Account Created Successfully"
            );


            navigate(
                "/login",
                { replace: true }
            );


        } catch (error) {

            console.log(
                "Registration Error:",
                error
            );


            alert(
                error.response?.data?.message ||
                "Registration Failed. Please try again."
            );


        } finally {

            setLoading(false);

        }

    }


    return (

        <div className="register-page">


            {/* =========================
                LEFT SECTION
            ========================= */}

            <div className="left-side">

                <div className="content">

                    <div className="logo">
                        SP
                    </div>


                    <h1>

                        Find Your <br />

                        Perfect{" "}

                        <span>
                            Sports Partner
                        </span>

                    </h1>


                    <p>

                        Connect with nearby players,
                        discover your favourite games,
                        build your community and
                        enjoy playing together.

                    </p>


                    <div className="sports-list">

                        <span>🏏 Cricket</span>

                        <span>⚽ Football</span>

                        <span>🏸 Badminton</span>

                        <span>🏀 Basketball</span>

                        <span>🎾 Tennis</span>

                        <span>🏐 Volleyball</span>

                        <span>♟️ Chess</span>

                        <span>🏓 Table Tennis</span>

                    </div>

                </div>

            </div>


            {/* =========================
                RIGHT SECTION
            ========================= */}

            <div className="right-side">

                <div className="form-container">


                    <h2>
                        Create Account
                    </h2>


                    <p>
                        Build your profile and
                        find your perfect playing partner.
                    </p>


                    <form
                        onSubmit={RegisterHandler}
                    >


                        {/* NAME */}

                        <div className="input-box">

                            <label>
                                Full Name
                            </label>


                            <div className="input-field">

                                <FaUser />

                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) =>
                                        setName(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>

                        </div>


                        {/* EMAIL */}

                        <div className="input-box">

                            <label>
                                Email
                            </label>


                            <div className="input-field">

                                <FaEnvelope />

                                <input
                                    type="email"
                                    placeholder="john@gmail.com"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>

                        </div>


                        {/* PASSWORD */}

                        <div className="input-box">

                            <label>
                                Password
                            </label>


                            <div className="input-field">

                                <FaLock />

                                <input
                                    type="password"
                                    placeholder="Minimum 8 characters"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(
                                            e.target.value
                                        )
                                    }
                                    minLength={8}
                                    required
                                />

                            </div>

                        </div>


                        {/* SKILL LEVEL */}

                        <div className="input-box">

                            <label>
                                Skill Level
                            </label>


                            <div className="input-field">

                                <FaMedal />

                                <select
                                    value={skillLevel}
                                    onChange={(e) =>
                                        setSkillLevel(
                                            e.target.value
                                        )
                                    }
                                    required
                                >

                                    <option value="">
                                        Select Skill Level
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

                            </div>

                        </div>


                        {/* SPORTS */}

                        <div className="input-box full">

                            <label>
                                Preferred Games
                            </label>


                            <div className="sport-selection">

                                {sportOptions.map(
                                    (sport) => (

                                        <label
                                            className={
                                                sports.includes(sport)
                                                    ? "sport-option selected"
                                                    : "sport-option"
                                            }
                                            key={sport}
                                        >

                                            <input
                                                type="checkbox"
                                                checked={sports.includes(
                                                    sport
                                                )}
                                                onChange={() =>
                                                    handleSportChange(
                                                        sport
                                                    )
                                                }
                                            />

                                            <span>
                                                {sport}
                                            </span>

                                        </label>

                                    )
                                )}

                            </div>

                        </div>


                        {/* STATE */}

                        <div className="input-box">

                            <label>
                                State
                            </label>


                            <div className="input-field">

                                <FaMapMarkerAlt />

                                <select
                                    value={state}
                                    onChange={(e) => {

                                        setState(
                                            e.target.value
                                        );

                                        setCity("");

                                    }}
                                    required
                                >

                                    <option value="">
                                        Select State
                                    </option>


                                    {states.map(
                                        (item) => (

                                            <option
                                                key={
                                                    item.isoCode
                                                }
                                                value={
                                                    item.isoCode
                                                }
                                            >

                                                {item.name}

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                        </div>


                        {/* CITY */}

                        <div className="input-box">

                            <label>
                                City
                            </label>


                            <div className="input-field">

                                <FaMapMarkerAlt />

                                <select
                                    value={city}
                                    onChange={(e) =>
                                        setCity(
                                            e.target.value
                                        )
                                    }
                                    disabled={!state}
                                    required
                                >

                                    <option value="">
                                        Select City
                                    </option>


                                    {cities.map(
                                        (item) => (

                                            <option
                                                key={
                                                    item.name
                                                }
                                                value={
                                                    item.name
                                                }
                                            >

                                                {item.name}

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                        </div>


                        {/* AVAILABILITY */}

                        <div className="input-box full">

                            <label>
                                Availability
                            </label>


                            <div className="availability-selection">

                                {availabilityOptions.map(
                                    (time) => (

                                        <label
                                            className={
                                                availability.includes(time)
                                                    ? "availability-option selected"
                                                    : "availability-option"
                                            }
                                            key={time}
                                        >

                                            <input
                                                type="checkbox"
                                                checked={availability.includes(
                                                    time
                                                )}
                                                onChange={() =>
                                                    handleAvailabilityChange(
                                                        time
                                                    )
                                                }
                                            />

                                            <span>
                                                {time}
                                            </span>

                                        </label>

                                    )
                                )}

                            </div>

                        </div>


                        {/* PLAYING LOCATION */}

                        <div className="input-box full">

                            <label>
                                Preferred Playing Location
                            </label>


                            <div className="input-field">

                                <FaMapMarkerAlt />

                                <select
                                    value={playingLocation}
                                    onChange={(e) =>
                                        setPlayingLocation(
                                            e.target.value
                                        )
                                    }
                                    required
                                >

                                    <option value="">
                                        Select Playing Location
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

                        </div>


                        {/* BUTTON */}

                        <button
                            type="submit"
                            disabled={loading}
                        >

                            {loading
                                ? "Creating Account..."
                                : "Create Account"
                            }

                        </button>


                    </form>


                    <div className="login-text">

                        Already have an account?{" "}

                        <Link to="/login">
                            Login
                        </Link>

                    </div>


                </div>

            </div>

        </div>

    );

}


export default Register;