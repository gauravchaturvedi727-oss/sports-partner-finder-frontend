import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import api from "../services/api";
import "./Login.css";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);


    async function handleLogin(e) {

        e.preventDefault();

        if (loading) return;

        try {

            setLoading(true);

            const response = await api.post(
                "/auth/login",
                {
                    email,
                    password
                }
            );


            // Save authentication data
            localStorage.setItem(
                "token",
                response.data.token
            );


            // Save user information
            localStorage.setItem(
                "userId",
                response.data.user.id
            );


            localStorage.setItem(
                "role",
                response.data.user.role
            );


            toast.success("Login Successfull");


            // Admin → Admin Dashboard
            if (
                response.data.user.role === "admin"
            ) {

                navigate(
                    "/admin",
                    { replace: true }
                );

            }

            // Normal user → Players
            else {

                navigate(
                    "/players",
                    { replace: true }
                );

            }


        } catch (error) {

            console.log(
                "Login Error:",
                error
            );


            toast.error(
                error.response?.data?.message ||
                "Login Failed"
            );


        } finally {

            setLoading(false);

        }

    }


    return (

        <div className="auth-container">

            <form onSubmit={handleLogin}>

                <h1>
                    Login
                </h1>


                <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    required
                />


                <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    required
                />


                <button
                    type="submit"
                    disabled={loading}
                >

                    {loading
                        ? "Logging in..."
                        : "Login"
                    }

                </button>


                <p>

                    Don't have an account?

                    <Link to="/register">
                        Register
                    </Link>

                </p>

            </form>

        </div>

    );

}

export default Login;