import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../pages/Navbar";
import "../index.css";
import "./IncomingRequest.css";

function IncomingRequest() {
    const [incomingReq, setIncomingReq] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [processingId, setProcessingId] = useState(null);

    async function fetchIncomingRequest() {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                "/requests/incoming"
            );

            console.log(
                "Incoming Requests:",
                response.data
            );

            setIncomingReq(
                response.data.requests || []
            );

        } catch (error) {
            console.log(
                "Fetch Incoming Requests Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load incoming requests"
            );

        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchIncomingRequest();
    }, []);

    async function acceptRequest(id) {
        if (processingId) return;

        try {
            setProcessingId(id);

            await api.patch(
                `/requests/${id}/accept`
            );

            alert("Request Accepted");

            await fetchIncomingRequest();

        } catch (error) {
            console.log(
                "Accept Request Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to Accept Request"
            );

        } finally {
            setProcessingId(null);
        }
    }

    async function rejectRequest(id) {
        if (processingId) return;

        try {
            setProcessingId(id);

            await api.patch(
                `/requests/${id}/reject`
            );

            alert("Request Rejected");

            await fetchIncomingRequest();

        } catch (error) {
            console.log(
                "Reject Request Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to Reject Request"
            );

        } finally {
            setProcessingId(null);
        }
    }

    return (
        <>
            <Navbar />

            <div className="container">

                <h1 className="heading">
                    Incoming Requests
                </h1>

                {loading && (
                    <h2 className="loading">
                        Loading requests...
                    </h2>
                )}

                {!loading && error && (
                    <div>
                        <h2 className="empty">
                            {error}
                        </h2>

                        <button
                            className="btn primary"
                            onClick={fetchIncomingRequest}
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {!loading &&
                    !error &&
                    incomingReq.length === 0 && (
                        <h2 className="empty">
                            No Incoming Requests
                        </h2>
                    )}

                {!loading &&
                    !error &&
                    incomingReq.length > 0 && (

                        <div className="requests-list">

                            {incomingReq.map((incoming) => (

                                <div
                                    className="request-card"
                                    key={incoming._id}
                                >

                                    <h2>
                                        {incoming.sender?.name ||
                                            "Unknown Player"}
                                    </h2>

                                    <p>
                                        City :{" "}
                                        {incoming.sender?.city ||
                                            "Not Available"}
                                    </p>

                                    <p>
                                        Sport :{" "}
                                        {incoming.sender?.sport ||
                                            "Not Available"}
                                    </p>

                                    <p>
                                        Status :{" "}
                                        {incoming.status}
                                    </p>

                                    {incoming.status === "pending" && (
                                        <div className="request-btns">

                                            <button
                                                className="btn success"
                                                onClick={() =>
                                                    acceptRequest(
                                                        incoming._id
                                                    )
                                                }
                                                disabled={
                                                    processingId ===
                                                    incoming._id
                                                }
                                            >
                                                {processingId ===
                                                incoming._id
                                                    ? "Processing..."
                                                    : "Accept"}
                                            </button>

                                            <button
                                                className="btn danger"
                                                onClick={() =>
                                                    rejectRequest(
                                                        incoming._id
                                                    )
                                                }
                                                disabled={
                                                    processingId ===
                                                    incoming._id
                                                }
                                            >
                                                {processingId ===
                                                incoming._id
                                                    ? "Processing..."
                                                    : "Reject"}
                                            </button>

                                        </div>
                                    )}

                                </div>

                            ))}

                        </div>
                    )}

            </div>
        </>
    );
}

export default IncomingRequest;