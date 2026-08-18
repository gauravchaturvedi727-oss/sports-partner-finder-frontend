import { useState, useEffect } from "react";
import api from "../services/api";
import Navbar from "../pages/Navbar";
import "./SendRequest.css";

function SendRequest() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cancellingId, setCancellingId] = useState(null);

    async function fetchSendRequest() {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/requests/sent");

            console.log("Sent Requests:", response.data);

            setRequests(response.data.requests || []);

        } catch (error) {
            console.log("Fetch Sent Requests Error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load sent requests"
            );

        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchSendRequest();
    }, []);

    async function cancelRequest(requestId) {
        if (cancellingId) return;

        try {
            setCancellingId(requestId);

            const response = await api.delete(
                `/requests/${requestId}/cancel`
            );

            console.log("Cancel Response:", response.data);

            alert("Request Cancelled Successfully");

            await fetchSendRequest();

        } catch (error) {
            console.log("Cancel Request Error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to Cancel Request"
            );

        } finally {
            setCancellingId(null);
        }
    }

    return (
        <>
            <Navbar />

            <div className="container">

                <h1 className="heading">
                    Sent Requests
                </h1>

                {loading && (
                    <h2>Loading sent requests...</h2>
                )}

                {!loading && error && (
                    <div>
                        <h2>{error}</h2>

                        <button
                            className="btn primary"
                            onClick={fetchSendRequest}
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {!loading &&
                    !error &&
                    requests.length === 0 && (
                        <h2>No Sent Requests</h2>
                    )}

                {!loading &&
                    !error &&
                    requests.length > 0 && (

                        <div className="requests-list">

                            {requests.map((request) => (

                                <div
                                    className="sent-card"
                                    key={request._id}
                                >

                                    <h2>
                                        {request.receiver?.name ||
                                            "Unknown Player"}
                                    </h2>

                                    <p>
                                        City :{" "}
                                        {request.receiver?.city ||
                                            "Not Available"}
                                    </p>

                                    <p>
                                        Sport :{" "}
                                        {request.receiver?.sport ||
                                            "Not Available"}
                                    </p>

                                    <p>
                                        Status :{" "}
                                        {request.status}
                                    </p>

                                    {request.status === "pending" && (
                                        <button
                                            className="btn danger"
                                            onClick={() =>
                                                cancelRequest(
                                                    request._id
                                                )
                                            }
                                            disabled={
                                                cancellingId ===
                                                request._id
                                            }
                                        >
                                            {cancellingId ===
                                            request._id
                                                ? "Cancelling..."
                                                : "Cancel Request"}
                                        </button>
                                    )}

                                </div>

                            ))}

                        </div>
                    )}
            </div>
        </>
    );
}

export default SendRequest;