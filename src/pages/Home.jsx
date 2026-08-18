import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./Home.css";

function Home() {
    const navigate = useNavigate();

    return (
        <>
            <Navbar />

            <div className="home-page">

                {/* HERO */}

                <section className="hero-section">

                    <div className="hero-content">

                        <span className="hero-badge">
                            🏆 SPORTS PARTNER FINDER
                        </span>

                        <h1>
                            Find Your
                            <span> Perfect Sports Partner</span>
                        </h1>

                        <p>
                            Don't play alone. Discover players who share
                            your passion, sport and availability.
                            Connect, compete and enjoy the game together.
                        </p>

                        <button
                            className="find-btn"
                            onClick={() => navigate("/players")}
                        >
                            Find Players →
                        </button>

                    </div>

                    <div className="hero-ball">
                        ⚽
                    </div>

                </section>


                {/* SPORTS */}

                <section className="sports-section">

                    <h2>Choose Your Game</h2>

                    <p className="section-subtitle">
                        Find people who love the same sport as you.
                    </p>

                    <div className="sports-grid">

                        <div className="sport-card">
                            <span>🏏</span>
                            <h3>Cricket</h3>
                            <p>Find cricket players near you.</p>
                        </div>

                        <div className="sport-card">
                            <span>⚽</span>
                            <h3>Football</h3>
                            <p>Build your football team.</p>
                        </div>

                        <div className="sport-card">
                            <span>🏸</span>
                            <h3>Badminton</h3>
                            <p>Find a badminton partner.</p>
                        </div>

                        <div className="sport-card">
                            <span>🏀</span>
                            <h3>Basketball</h3>
                            <p>Meet basketball players.</p>
                        </div>

                        <div className="sport-card">
                            <span>🎾</span>
                            <h3>Tennis</h3>
                            <p>Find your tennis partner.</p>
                        </div>

                        <div className="sport-card">
                            <span>🏐</span>
                            <h3>Volleyball</h3>
                            <p>Build your volleyball team.</p>
                        </div>

                    </div>

                </section>


                {/* HOW IT WORKS */}

                <section className="how-section">

                    <h2>How It Works</h2>

                    <div className="steps">

                        <div className="step">
                            <div>01</div>
                            <h3>Discover</h3>
                            <p>
                                Explore players based on sport
                                and location.
                            </p>
                        </div>

                        <div className="step">
                            <div>02</div>
                            <h3>Connect</h3>
                            <p>
                                Send a partner request to players
                                you want to play with.
                            </p>
                        </div>

                        <div className="step">
                            <div>03</div>
                            <h3>Play</h3>
                            <p>
                                Accept requests and start playing
                                together.
                            </p>
                        </div>

                    </div>

                </section>


                {/* CTA */}

                <section className="bottom-cta">

                    <h2>
                        Ready to find your next teammate?
                    </h2>

                    <button
                        onClick={() => navigate("/players")}
                    >
                        Explore Players
                    </button>

                </section>

            </div>
        </>
    );
}

export default Home;