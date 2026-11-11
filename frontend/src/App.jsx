
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import {
  Link,
  NavLink,
  Route,
  Routes,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Home from "./pages/Home";
import Packages from "./pages/Packages";

import travelMateLogo from "./assets/travelmate-logo.png";
import baliImage from "./assets/packages/bali.jpg";
import dubaiImage from "./assets/packages/dubai.jpg";
import switzerlandImage from "./assets/packages/switzerland.jpg";
import maldivesImage from "./assets/packages/maldives.jpg";
import parisImage from "./assets/packages/paris.jpg";
import manaliImage from "./assets/packages/manali.jpg";
import goaImage from "./assets/packages/goa.jpg";
import japanImage from "./assets/packages/japan.jpg";
import keralaImage from "./assets/packages/kerala.jpg";

import "./App.css";

const API_URL = "http://localhost:5000";

const travelPackages = [
  {
    name: "Bali",
    image: baliImage,
    icon: "🏝️",
    duration: "5 Days / 4 Nights",
    tagline: "Tropical beaches & island adventures",
    price: 25000,
    description:
      "Enjoy beautiful beaches, tropical scenery, local culture and unforgettable experiences.",
  },
  {
    name: "Dubai",
    image: dubaiImage,
    icon: "🏙️",
    duration: "4 Days / 3 Nights",
    tagline: "Luxury, shopping & desert experiences",
    price: 30000,
    description:
      "Experience modern architecture, luxury shopping, desert adventures and exciting city attractions.",
  },
  {
    name: "Switzerland",
    image: switzerlandImage,
    icon: "🏔️",
    duration: "7 Days / 6 Nights",
    tagline: "Alpine views, lakes & mountain escapes",
    price: 75000,
    description:
      "Discover beautiful mountains, peaceful lakes, scenic villages and breathtaking landscapes.",
  },
  {
    name: "Maldives",
    image: maldivesImage,
    icon: "🏝️",
    duration: "5 Days / 4 Nights",
    tagline: "Turquoise lagoons & island relaxation",
    price: 45000,
    description:
      "Relax by crystal-clear lagoons, discover beautiful beaches and enjoy peaceful island experiences.",
  },
  {
    name: "Paris",
    image: parisImage,
    icon: "🗼",
    duration: "6 Days / 5 Nights",
    tagline: "Art, landmarks & romantic city walks",
    price: 65000,
    description:
      "Explore famous landmarks, charming streets, museums and memorable Parisian sights.",
  },
  {
    name: "Manali",
    image: manaliImage,
    icon: "🏔️",
    duration: "4 Days / 3 Nights",
    tagline: "Mountain views & Himalayan adventures",
    price: 12000,
    description:
      "Enjoy scenic valleys, mountain views, local markets and refreshing Himalayan air.",
  },
  {
    name: "Goa",
    image: goaImage,
    icon: "🌴",
    duration: "3 Days / 2 Nights",
    tagline: "Sunny beaches & coastal getaways",
    price: 10000,
    description:
      "Discover sandy beaches, coastal culture, delicious food and relaxing seaside experiences.",
  },
  {
    name: "Japan",
    image: japanImage,
    icon: "🌸",
    duration: "7 Days / 6 Nights",
    tagline: "Temples, cities & cultural discoveries",
    price: 85000,
    description:
      "Experience vibrant cities, historic temples, beautiful gardens and Japanese culture.",
  },
  {
    name: "Kerala",
    image: keralaImage,
    icon: "🌿",
    duration: "5 Days / 4 Nights",
    tagline: "Backwaters, greenery & peaceful escapes",
    price: 18000,
    description:
      "Explore lush landscapes, peaceful backwaters, scenic hill stations and local traditions.",
  },
];

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const dateText = (value) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

function StatusBadge({ status }) {
  const statusClass =
    status === "Pending"
      ? "status-pending"
      : status === "Cancelled"
      ? "status-cancelled"
      : "status-confirmed";

  return (
    <span className={`booking-status ${statusClass}`}>
      {status}
    </span>
  );
}

// Admin dashboard has its own styling.
// Your existing App.css continues to style other pages.
const adminStyles = {
  page: {
    minHeight: "80vh",
    padding: "55px 20px 80px",
    background:
      "linear-gradient(145deg, #e8faff 0%, #f7fcff 55%, #e8f4ff 100%)",
  },
  container: {
    maxWidth: 1200,
    margin: "0 auto",
  },
  heading: {
    color: "#083b59",
    fontSize: "clamp(28px, 4vw, 42px)",
    margin: "0 0 10px",
  },
  subtitle: {
    color: "#52748a",
    marginBottom: 30,
  },
  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: 18,
    marginBottom: 32,
  },
  statCard: {
    background: "#fff",
    borderRadius: 18,
    padding: 24,
    boxShadow: "0 8px 28px rgba(8, 59, 89, 0.08)",
    border: "1px solid #d9eef7",
  },
  statNumber: {
    fontSize: 34,
    fontWeight: 800,
    color: "#087f9f",
    margin: "12px 0 0",
  },
  card: {
    background: "#fff",
    borderRadius: 18,
    padding: 22,
    border: "1px solid #d9eef7",
    boxShadow: "0 8px 28px rgba(8, 59, 89, 0.07)",
  },
  button: {
    background: "linear-gradient(135deg, #0788a8, #06658b)",
    color: "white",
    border: 0,
    borderRadius: 10,
    padding: "11px 18px",
    cursor: "pointer",
    fontWeight: 700,
  },
  confirmButton: {
    background: "#0b987d",
    color: "white",
    border: 0,
    borderRadius: 9,
    padding: "10px 16px",
    cursor: "pointer",
    fontWeight: 700,
  },
};

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmingId, setConfirmingId] = useState(null);
  const [filter, setFilter] = useState("All");
  const [adminBookingToCancel, setAdminBookingToCancel] = useState(null);

  const fetchAdminBookings = async () => {
    const token = localStorage.getItem("token");

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/bookings/admin/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not load admin bookings"
        );
      }

      if (!Array.isArray(data)) {
        throw new Error("Unexpected bookings response");
      }

      setBookings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminBookings();
  }, []);

  const confirmBooking = async (bookingId) => {
    const token = localStorage.getItem("token");
    setConfirmingId(bookingId);

    try {
      const response = await fetch(
        `${API_URL}/api/bookings/admin/${bookingId}/confirm`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not confirm booking"
        );
      }

      setBookings((previous) =>
        previous.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: "Confirmed" }
            : booking
        )
      );

      toast.success("Booking confirmed successfully!");
    } catch (err) {
      toast.error("Confirmation failed", {
        description: err.message,
      });
      await fetchAdminBookings();
    } finally {
      setConfirmingId(null);
    }
  };

  const cancelAdminBooking = async (bookingId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in again.");
      return;
    }

    setConfirmingId(bookingId);
    try {
      const response = await fetch(
        `${API_URL}/api/bookings/admin/${bookingId}/cancel`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Could not cancel booking");
      }

      setBookings((previous) =>
        previous.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: "Cancelled" }
            : booking
        )
      );
      toast.success("Booking cancelled successfully!");
    } catch (err) {
      toast.error("Cancellation failed", {
        description: err.message,
      });
      await fetchAdminBookings();
    } finally {
      setConfirmingId(null);
    }
  };

  const pending = bookings.filter(
    (booking) => booking.status === "Pending"
  ).length;

  const confirmed = bookings.filter(
    (booking) => booking.status === "Confirmed"
  ).length;

  const cancelled = bookings.filter(
    (booking) => booking.status === "Cancelled"
  ).length;

  const filteredBookings =
    filter === "All"
      ? bookings
      : bookings.filter(
          (booking) => booking.status === filter
        );

  const statistics = [
    { label: "Total Bookings", value: bookings.length, icon: "📋" },
    { label: "Pending", value: pending, icon: "⏳" },
    { label: "Confirmed", value: confirmed, icon: "✅" },
    { label: "Cancelled", value: cancelled, icon: "❌" },
  ];

  return (
    <main style={adminStyles.page}>
      <div style={adminStyles.container}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 20,
            flexWrap: "wrap",
            marginBottom: 28,
          }}
        >
          <div>
            <h1 style={adminStyles.heading}>
              🌊 Admin Dashboard
            </h1>
            <p style={adminStyles.subtitle}>
              Welcome to TravelMate booking management.
            </p>
          </div>

          <button
            type="button"
            style={adminStyles.button}
            onClick={fetchAdminBookings}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "↻ Refresh Bookings"}
          </button>
        </div>

        <div style={adminStyles.stats}>
          {statistics.map((stat) => (
            <div key={stat.label} style={adminStyles.statCard}>
              <div style={{ fontSize: 27 }}>{stat.icon}</div>
              <p style={{ color: "#52748a", marginTop: 12 }}>
                {stat.label}
              </p>
              <p style={adminStyles.statNumber}>
                {loading ? "—" : stat.value}
              </p>
            </div>
          ))}
        </div>

        <section style={adminStyles.card}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16,
              marginBottom: 24,
            }}
          >
            <h2 style={{ color: "#083b59", margin: 0 }}>
              Customer Bookings
            </h2>

            <select
              aria-label="Filter bookings by status"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              style={{
                padding: "10px 14px",
                border: "1px solid #b6dce9",
                borderRadius: 10,
                background: "#f7fcff",
                color: "#083b59",
              }}
            >
              <option value="All">All Bookings</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {loading ? (
            <p>Loading customer bookings...</p>
          ) : error ? (
            <div>
              <p style={{ color: "#b91c1c" }}>{error}</p>
              <button
                type="button"
                style={adminStyles.button}
                onClick={fetchAdminBookings}
              >
                Try Again
              </button>
            </div>
          ) : filteredBookings.length === 0 ? (
            <p style={{ color: "#52748a" }}>
              No {filter === "All" ? "" : filter.toLowerCase()}{" "}
              bookings found.
            </p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: 760,
                  textAlign: "left",
                }}
              >
                <thead>
                  <tr style={{ background: "#eaf8fc" }}>
                    {[
                      "Customer",
                      "Destination",
                      "Travel Date",
                      "Travelers",
                      "Total",
                      "Status",
                      "Action",
                    ].map((heading) => (
                      <th
                        key={heading}
                        style={{
                          padding: 14,
                          color: "#083b59",
                          borderBottom: "1px solid #d6eaf2",
                        }}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr key={booking._id}>
                      <td
                        style={{
                          padding: 14,
                          borderBottom: "1px solid #edf2f7",
                        }}
                      >
                        <strong>
                          {booking.user?.name || "Unknown User"}
                        </strong>
                        <div
                          style={{
                            fontSize: 12,
                            color: "#64748b",
                            overflowWrap: "anywhere",
                          }}
                        >
                          {booking.user?.email || "No email"}
                        </div>
                      </td>

                      <td style={{ padding: 14 }}>
                        {booking.destination}
                      </td>

                      <td style={{ padding: 14 }}>
                        {dateText(booking.travelDate)}
                      </td>

                      <td style={{ padding: 14 }}>
                        {booking.numberOfPeople}
                      </td>

                      <td style={{ padding: 14 }}>
                        {money(booking.totalPrice)}
                      </td>

                      <td style={{ padding: 14 }}>
                        <StatusBadge status={booking.status} />
                      </td>

                      <td style={{ padding: 14 }}>
                        {booking.status !== "Cancelled" ? (
                          <div
                            style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
                          >
                            {booking.status === "Pending" && (
                              <button
                                type="button"
                                style={adminStyles.confirmButton}
                                disabled={confirmingId !== null}
                                onClick={() => confirmBooking(booking._id)}
                              >
                                {confirmingId === booking._id
                                  ? "Processing..."
                                  : "✓ Confirm"}
                              </button>
                            )}
                            <button
                              type="button"
                              disabled={confirmingId !== null}
                              onClick={() => setAdminBookingToCancel(booking)}
                              style={{
                                backgroundColor: "#dc2626",
                                color: "white",
                                border: 0,
                                borderRadius: 9,
                                padding: "10px 16px",
                                fontWeight: 700,
                                cursor: confirmingId !== null
                                  ? "not-allowed"
                                  : "pointer",
                              }}
                            >
                              {confirmingId === booking._id
                                ? "Processing..."
                                : "✕ Cancel"}
                            </button>
                          </div>
                        ) : (
                          <span style={{ color: "#64748b" }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {adminBookingToCancel && (
        <div
          role="presentation"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: 20,
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-cancel-booking-title"
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 16,
              padding: 30,
              maxWidth: 420,
              width: "100%",
              textAlign: "center",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.25)",
            }}
          >
            <h2
              id="admin-cancel-booking-title"
              style={{ color: "#1e293b" }}
            >
              Cancel Customer Booking?
            </h2>
            <p style={{ color: "#64748b", margin: "16px 0 24px" }}>
              Are you sure you want to cancel this customer's{" "}
              <strong>{adminBookingToCancel.destination}</strong> booking?
            </p>
            <div className="cancel-dialog-actions">
              <button
                type="button"
                className="keep-booking-button"
                disabled={confirmingId !== null}
                onClick={() => setAdminBookingToCancel(null)}
              >
                Keep Booking
              </button>
              <button
                type="button"
                className="confirm-cancel-button"
                disabled={confirmingId !== null}
                onClick={() => {
                  const bookingId = adminBookingToCancel._id;
                  setAdminBookingToCancel(null);
                  cancelAdminBooking(bookingId);
                }}
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(
    () => Boolean(localStorage.getItem("token"))
  );

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  const isAdmin =
    isLoggedIn && currentUser?.role === "admin";

  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);
  const [isNavHidden, setIsNavHidden] = useState(false);

  const [showBooking, setShowBooking] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] =
    useState(false);
  const [confirmedDestination, setConfirmedDestination] =
    useState("");
  const [numberOfPeople, setNumberOfPeople] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [bookingSubmitting, setBookingSubmitting] =
    useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerConfirmed, setRegisterConfirmed] =
    useState(false);

  const [myBookings, setMyBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] =
    useState(false);
  const [bookingsError, setBookingsError] = useState("");
  const [cancellingBookingId, setCancellingBookingId] =
    useState(null);
  const [bookingToCancel, setBookingToCancel] =
    useState(null);

  const match = location.pathname.match(
    /^\/packages\/([^/]+)\/?$/
  );

  const packageSlug = match
    ? decodeURIComponent(match[1]).toLowerCase()
    : null;

  const activePackage = travelPackages.find(
    (item) => item.name.toLowerCase() === packageSlug
  );

  const openPackage = (packageName) => {
    setShowBooking(false);
    setBookingConfirmed(false);
    navigate(
      `/packages/${encodeURIComponent(
        packageName.toLowerCase()
      )}`
    );
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (showBooking) {
      document
        .getElementById("booking")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }, [showBooking]);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 80) {
        setIsNavHidden(false);
      } else if (currentScrollY > lastScrollY + 3) {
        setIsNavHidden(true);
      } else if (currentScrollY < lastScrollY - 3) {
        setIsNavHidden(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchMyBookings = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setBookingsError(
        "Please log in to view your bookings."
      );
      setMyBookings([]);
      return;
    }

    setBookingsLoading(true);
    setBookingsError("");

    try {
      const response = await fetch(
        `${API_URL}/api/bookings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not load bookings"
        );
      }

      setMyBookings(data);
    } catch (error) {
      setBookingsError(error.message);
      setMyBookings([]);
    } finally {
      setBookingsLoading(false);
    }
  };

  useEffect(() => {
    if (location.pathname === "/my-bookings") {
      fetchMyBookings();
    }
  }, [location.pathname, isLoggedIn]);

  const handleBooking = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please log in before booking.");
      navigate("/login", {
        state: { from: location.pathname },
      });
      return;
    }

    if (!activePackage) {
      toast.error("Please select a travel package.");
      return;
    }

    if (!travelDate || Number(numberOfPeople) < 1) {
      toast.error("Invalid booking details");
      return;
    }

    setBookingSubmitting(true);

    try {
      const response = await fetch(
        `${API_URL}/api/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            destination: activePackage.name,
            travelDate,
            numberOfPeople: Number(numberOfPeople),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not create booking"
        );
      }

      setConfirmedDestination(activePackage.name);
      setShowBooking(false);
      setBookingConfirmed(true);
      setNumberOfPeople("");
      setTravelDate("");

      toast.success("Booking request submitted!");
    } catch (error) {
      toast.error("Booking failed", {
        description: error.message,
      });
    } finally {
      setBookingSubmitting(false);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: loginEmail,
            password: loginPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Invalid email or password"
        );
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setCurrentUser(data.user);
      setIsLoggedIn(true);
      setLoginPassword("");
      setMyBookings([]);

      toast.success(`Welcome back, ${data.user.name}!`);

      const destination =
        data.user.role === "admin"
          ? "/admin"
          : location.state?.from || "/packages";

      navigate(destination, { replace: true });
    } catch (error) {
      toast.error("Login failed", {
        description: error.message,
      });
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed"
        );
      }

      setRegisterConfirmed(true);
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error("Registration failed", {
        description: error.message,
      });
    }
  };

  const handleCancelBooking = async (bookingId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please log in first.");
      return;
    }

    setCancellingBookingId(bookingId);

    try {
      const response = await fetch(
        `${API_URL}/api/bookings/${bookingId}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not cancel booking"
        );
      }

      setMyBookings((current) =>
        current.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: "Cancelled" }
            : booking
        )
      );

      toast.success("Booking cancelled successfully!");
    } catch (error) {
      toast.error("Unable to cancel booking", {
        description: error.message,
      });
    } finally {
      setCancellingBookingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    setCurrentUser(null);
    setIsMobileMenuOpen(false);
    setMyBookings([]);
    setShowBooking(false);
    setBookingConfirmed(false);

    navigate("/");
    toast.success("Logged out successfully!");
  };

  return (
    <div>
      <Toaster
        position={
          window.innerWidth <= 768
            ? "bottom-center"
            : "top-right"
        }
        richColors
        closeButton
        duration={4000}
      />

      <header
        className={
          isNavHidden ? "nav-hidden" : "nav-visible"
        }
      >
        <Link
          to="/"
          className="travelmate-logo"
          aria-label="TravelMate home"
        >
          <img
            src={travelMateLogo}
            alt="TravelMate"
            className="travelmate-logo-image"
          />
        </Link>

        <button
          type="button"
          className="mobile-menu-toggle"
          onClick={() =>
            setIsMobileMenuOpen(!isMobileMenuOpen)
          }
          aria-label={
            isMobileMenuOpen ? "Close menu" : "Open menu"
          }
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>

        <nav
          className={
            isMobileMenuOpen ? "mobile-nav-open" : ""
          }
        >
          <NavLink to="/">Home</NavLink>
          <NavLink to="/packages">Packages</NavLink>
          <NavLink to="/about">About</NavLink>

          {isLoggedIn ? (
            <>
              {isAdmin ? (
                <NavLink to="/admin">
                  Admin Dashboard
                </NavLink>
              ) : (
                <NavLink to="/my-bookings">
                  My Bookings
                </NavLink>
              )}

              <button
                type="button"
                className="logout-button"
                onClick={handleLogout}
              >
                <span aria-hidden="true">↪</span> Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/packages"
          element={
            <Packages onSelectPackage={openPackage} />
          }
        />

        <Route
          path="/packages/:packageSlug"
          element={
            activePackage ? (
              <main>
                <section className="package-details">
                  <h2>
                    {activePackage.name} Travel Package
                  </h2>

                  <img
                    src={activePackage.image}
                    alt={`${activePackage.name} destination`}
                    style={{
                      width: "100%",
                      maxWidth: 680,
                      borderRadius: 12,
                      display: "block",
                      margin: "16px auto",
                    }}
                  />

                  <p>
                    <strong>Duration:</strong>{" "}
                    {activePackage.duration}
                  </p>

                  <p>
                    <strong>Starting Price:</strong>{" "}
                    {money(activePackage.price)} per traveler
                  </p>

                  <p>{activePackage.description}</p>

                  {!bookingConfirmed && (
                    <button
                      className="book-button"
                      type="button"
                      onClick={() => {
                        if (!isLoggedIn) {
                          toast.error(
                            "Please log in before booking."
                          );
                          navigate("/login", {
                            state: {
                              from: location.pathname,
                            },
                          });
                          return;
                        }

                        setShowBooking(true);
                      }}
                    >
                      Book Now
                    </button>
                  )}

                  <button
                    className="details-back-button"
                    type="button"
                    onClick={() => {
                      setShowBooking(false);
                      setBookingConfirmed(false);
                      navigate("/packages");
                    }}
                  >
                    ← Back to Packages
                  </button>
                </section>

                {showBooking && !bookingConfirmed && (
                  <section
                    className="booking-section"
                    id="booking"
                  >
                    <div className="booking-form">
                      <h2>Book Your Trip</h2>

                      <p>
                        Booking for:{" "}
                        <strong>
                          {activePackage.name}
                        </strong>
                      </p>

                      <form onSubmit={handleBooking}>
                        <label htmlFor="booking-name">
                          Full Name
                        </label>
                        <input
                          id="booking-name"
                          type="text"
                          placeholder="Enter your name"
                          defaultValue={currentUser?.name || ""}
                          required
                        />

                        <label htmlFor="booking-email">
                          Email
                        </label>
                        <input
                          id="booking-email"
                          type="email"
                          placeholder="Enter your email"
                          defaultValue={currentUser?.email || ""}
                          required
                        />

                        <label htmlFor="booking-people">
                          Number of Travelers
                        </label>
                        <input
                          id="booking-people"
                          type="number"
                          min="1"
                          placeholder="Number of travelers"
                          value={numberOfPeople}
                          onChange={(event) =>
                            setNumberOfPeople(
                              event.target.value
                            )
                          }
                          required
                        />

                        <label htmlFor="booking-date">
                          Travel Date
                        </label>
                        <input
                          id="booking-date"
                          type="date"
                          min={new Date()
                            .toLocaleDateString("en-CA")}
                          value={travelDate}
                          onChange={(event) =>
                            setTravelDate(event.target.value)
                          }
                          required
                        />

                        <button
                          type="submit"
                          disabled={bookingSubmitting}
                        >
                          {bookingSubmitting
                            ? "Saving Booking..."
                            : "Confirm Booking"}
                        </button>
                      </form>

                      <button
                        className="close-button"
                        type="button"
                        onClick={() =>
                          setShowBooking(false)
                        }
                      >
                        Cancel
                      </button>
                    </div>
                  </section>
                )}

                {bookingConfirmed && (
                  <section className="confirmation-section">
                    <div className="confirmation-card">
                      <h2>
                        🎉 Booking Request Submitted!
                      </h2>

                      <p>
                        Your{" "}
                        <strong>
                          {confirmedDestination}
                        </strong>{" "}
                        trip has been booked successfully.
                      </p>

                      <p>
                        Your booking status is Pending.
                      </p>

                      <div className="confirmation-actions">
                        <button
                          type="button"
                          className="confirmation-back-button"
                          onClick={() => {
                            setBookingConfirmed(false);
                            navigate("/packages");
                          }}
                        >
                          ← Back to Packages
                        </button>

                        <button
                          type="button"
                          className="confirmation-bookings-button"
                          onClick={() =>
                            navigate("/my-bookings")
                          }
                        >
                          My Bookings →
                        </button>
                      </div>
                    </div>
                  </section>
                )}
              </main>
            ) : (
              <main>
                <section className="package-details">
                  <h2>Package not found</h2>
                  <Link to="/packages">
                    View all packages
                  </Link>
                </section>
              </main>
            )
          }
        />

        <Route
          path="/about"
          element={
            <main className="about-page">
              <section className="about-intro">
                <span className="about-eyebrow">
                  ✦ WELCOME TO TRAVELMATE
                </span>

                <h1>
                  Your Journey,{" "}
                  <span>Our Passion.</span>
                </h1>

                <p>
                  TravelMate is your companion for
                  discovering beautiful destinations and
                  planning unforgettable adventures.
                  From tropical beaches and vibrant cities
                  to peaceful mountain escapes, we make
                  exploring the world easier.
                </p>

                <p>
                  Our goal is simple: help you find
                  exciting travel packages, explore
                  destination details, and manage your
                  trips with confidence.
                </p>
              </section>

              <section className="about-benefits">
                <span className="about-eyebrow">
                  THE TRAVELMATE EXPERIENCE
                </span>

                <h2>
                  Why Choose <span>TravelMate?</span>
                </h2>

                <p className="about-section-description">
                  Everything you need to plan your next
                  adventure, all in one place.
                </p>

                <div className="about-benefit-grid">
                  <article className="about-benefit-card">
                    <div className="about-benefit-icon">
                      🌍
                    </div>
                    <h3>Exciting Destinations</h3>
                    <p>
                      Discover beautiful places, from
                      relaxing island getaways to
                      unforgettable city adventures.
                    </p>
                  </article>

                  <article className="about-benefit-card">
                    <div className="about-benefit-icon">
                      📅
                    </div>
                    <h3>Simple Booking</h3>
                    <p>
                      Explore package details, choose
                      your travel dates, and submit your
                      booking request in a few steps.
                    </p>
                  </article>

                  <article className="about-benefit-card">
                    <div className="about-benefit-icon">
                      💙
                    </div>
                    <h3>Manage Your Trips</h3>
                    <p>
                      View your bookings, check their
                      status, and manage your travel
                      plans conveniently.
                    </p>
                  </article>
                </div>
              </section>

              <section className="about-how">
                <span className="about-eyebrow">
                  YOUR ADVENTURE MADE SIMPLE
                </span>

                <h2>
                  How <span>TravelMate Works</span>
                </h2>

                <div className="about-steps">
                  {[
                    {
                      number: "01",
                      title: "Explore",
                      description:
                        "Browse our destinations and discover your perfect getaway.",
                    },
                    {
                      number: "02",
                      title: "Choose",
                      description:
                        "Compare travel packages and select the adventure that suits you.",
                    },
                    {
                      number: "03",
                      title: "Book",
                      description:
                        "Submit your booking request and manage your trip through TravelMate.",
                    },
                  ].map((step) => (
                    <div
                      className="about-step"
                      key={step.number}
                    >
                      <span className="about-step-number">
                        {step.number}
                      </span>
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="about-cta">
                <span>YOUR NEXT ADVENTURE AWAITS</span>
                <h2>
                  Ready to Discover the World?
                </h2>
                <p>
                  Explore exciting destinations and start
                  planning your next memorable journey today.
                </p>
                <button
                  type="button"
                  className="about-explore-button"
                  onClick={() => navigate("/packages")}
                >
                  Explore Travel Packages →
                </button>
              </section>
            </main>
          }
        />

        <Route
          path="/login"
          element={
            <main>
              <section
                className="login-section"
                id="login"
              >
                <div className="login-form">
                  <h2>Login to TravelMate</h2>

                  <form onSubmit={handleLogin}>
                    <label htmlFor="login-email">
                      Email
                    </label>
                    <input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginEmail}
                      onChange={(event) =>
                        setLoginEmail(event.target.value)
                      }
                      required
                    />

                    <label htmlFor="login-password">
                      Password
                    </label>
                    <input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(event) =>
                        setLoginPassword(
                          event.target.value
                        )
                      }
                      required
                    />

                    <button type="submit">
                      Login
                    </button>
                  </form>

                  <p className="switch-form">
                    Don't have an account?{" "}
                    <Link to="/register">
                      Create one
                    </Link>
                  </p>

                  <button
                    className="close-button"
                    type="button"
                    onClick={() => navigate("/")}
                  >
                    Close
                  </button>
                </div>
              </section>
            </main>
          }
        />

        <Route
          path="/register"
          element={
            <main>
              <section
                className="register-section"
                id="register"
              >
                <div className="register-form">
                  {registerConfirmed ? (
                    <div className="register-confirmation-card">
                      <h2>
                        🎉 Account Created Successfully!
                      </h2>

                      <p>
                        Welcome to{" "}
                        <strong>TravelMate</strong>!
                        Your account has been created.
                      </p>

                      <button
                        type="button"
                        onClick={() => {
                          setRegisterConfirmed(false);
                          navigate("/login");
                        }}
                      >
                        Go to Login
                      </button>
                    </div>
                  ) : (
                    <>
                      <h2>
                        Create Your TravelMate Account
                      </h2>

                      <form onSubmit={handleRegister}>
                        <label htmlFor="register-name">
                          Full Name
                        </label>
                        <input
                          id="register-name"
                          type="text"
                          placeholder="Enter your name"
                          value={name}
                          onChange={(event) =>
                            setName(event.target.value)
                          }
                          required
                        />

                        <label htmlFor="register-email">
                          Email
                        </label>
                        <input
                          id="register-email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(event) =>
                            setEmail(event.target.value)
                          }
                          required
                        />

                        <label htmlFor="register-password">
                          Password
                        </label>
                        <input
                          id="register-password"
                          type="password"
                          placeholder="Create a password"
                          minLength={8}
                          value={password}
                          onChange={(event) =>
                            setPassword(event.target.value)
                          }
                          required
                        />

                        <label htmlFor="register-confirm">
                          Confirm Password
                        </label>
                        <input
                          id="register-confirm"
                          type="password"
                          placeholder="Confirm your password"
                          minLength={8}
                          value={confirmPassword}
                          onChange={(event) =>
                            setConfirmPassword(
                              event.target.value
                            )
                          }
                          required
                        />

                        <button type="submit">
                          Create Account
                        </button>
                      </form>

                      <p className="switch-form">
                        Already have an account?{" "}
                        <Link to="/login">Login</Link>
                      </p>

                      <button
                        className="close-button"
                        type="button"
                        onClick={() => navigate("/")}
                      >
                        Close
                      </button>
                    </>
                  )}
                </div>
              </section>
            </main>
          }
        />

        <Route
          path="/my-bookings"
          element={
            <main>
              <section
                className="my-bookings-section"
                id="my-bookings"
              >
                <h2>✈️ My Bookings</h2>

                {!isLoggedIn ? (
                  <p>
                    Please{" "}
                    <Link
                      to="/login"
                      state={{
                        from: "/my-bookings",
                      }}
                    >
                      log in
                    </Link>{" "}
                    to view your bookings.
                  </p>
                ) : bookingsLoading ? (
                  <p>Loading your bookings...</p>
                ) : bookingsError ? (
                  <p>{bookingsError}</p>
                ) : myBookings.length === 0 ? (
                  <p>No bookings found.</p>
                ) : (
                  <div className="bookings-grid">
                    {myBookings.map((booking) => {
                      const packageImage =
                        travelPackages.find(
                          (pkg) =>
                            pkg.name.toLowerCase() ===
                            booking.destination.toLowerCase()
                        )?.image;

                      return (
                        <div
                          key={booking._id}
                          className="booking-card"
                        >
                          {packageImage && (
                            <img
                              src={packageImage}
                              alt={booking.destination}
                              className="booking-destination-image"
                            />
                          )}

                          <h3>
                            📍 {booking.destination}
                          </h3>

                          <p>
                            Travel Date:{" "}
                            {dateText(booking.travelDate)}
                          </p>

                          <p>
                            Travelers:{" "}
                            {booking.numberOfPeople}
                          </p>

                          <p>
                            Total Price:{" "}
                            {money(booking.totalPrice)}
                          </p>

                          <p>
                            Status:{" "}
                            <StatusBadge
                              status={booking.status}
                            />
                          </p>

                          {booking.status !== "Cancelled" && (
                            <button
                              type="button"
                              onClick={() =>
                                setBookingToCancel(booking)
                              }
                              disabled={
                                cancellingBookingId !== null
                              }
                              style={{
                                backgroundColor: "#dc2626",
                                color: "white",
                                marginTop: 10,
                              }}
                            >
                              {cancellingBookingId ===
                              booking._id
                                ? "Cancelling..."
                                : "Cancel Booking"}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="booking-action-buttons">
                  {isLoggedIn && (
                    <button
                      type="button"
                      className="refresh-bookings-button"
                      onClick={fetchMyBookings}
                      disabled={bookingsLoading}
                    >
                      {bookingsLoading
                        ? "Refreshing..."
                        : "↻ Refresh Bookings"}
                    </button>
                  )}

                  <button
                    type="button"
                    className="booking-close-button"
                    onClick={() => navigate("/")}
                  >
                    Close
                  </button>
                </div>
              </section>
            </main>
          }
        />

        <Route
          path="/admin"
          element={
            !isLoggedIn ? (
              <Navigate
                to="/login"
                state={{ from: "/admin" }}
                replace
              />
            ) : isAdmin ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="*"
          element={
            <main>
              <section className="about">
                <h2>Page not found</h2>
                <Link to="/">Go Home</Link>
              </section>
            </main>
          }
        />
      </Routes>

      {bookingToCancel && (
        <div
          role="presentation"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: 20,
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-booking-title"
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 16,
              padding: 30,
              maxWidth: 420,
              width: "100%",
              textAlign: "center",
              boxShadow:
                "0 20px 60px rgba(0, 0, 0, 0.25)",
            }}
          >
            <h2
              id="cancel-booking-title"
              style={{ color: "#1e293b" }}
            >
              Cancel Booking?
            </h2>

            <p
              style={{
                color: "#64748b",
                margin: "16px 0 24px",
              }}
            >
              Are you sure you want to cancel your{" "}
              <strong>
                {bookingToCancel.destination}
              </strong>{" "}
              trip?
            </p>

            <div className="cancel-dialog-actions">
              <button
                type="button"
                className="keep-booking-button"
                onClick={() =>
                  setBookingToCancel(null)
                }
                disabled={
                  cancellingBookingId !== null
                }
              >
                Keep Booking
              </button>

              <button
                type="button"
                className="confirm-cancel-button"
                disabled={
                  cancellingBookingId !== null
                }
                onClick={() => {
                  const bookingId =
                    bookingToCancel._id;
                  setBookingToCancel(null);
                  handleCancelBooking(bookingId);
                }}
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <footer>
        <p>
          © 2026 TravelMate. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;
