
import { Link } from "react-router-dom";

import coastalHero from "../assets/coastal-hero.jpg";
import baliImage from "../assets/packages/bali.jpg";
import dubaiImage from "../assets/packages/dubai.jpg";
import switzerlandImage from "../assets/packages/switzerland.jpg";

const featuredDestinations = [
  {
    name: "Bali, Indonesia",
    description:
      "Tropical beaches, beautiful temples, and island adventures.",
    image: baliImage,
    tag: "Tropical Escape",
  },
  {
    name: "Dubai, UAE",
    description:
      "Iconic skyscrapers, desert adventures, and luxury experiences.",
    image: dubaiImage,
    tag: "City Adventure",
  },
  {
    name: "Switzerland",
    description:
      "Snow-capped mountains, scenic lakes, and unforgettable views.",
    image: switzerlandImage,
    tag: "Mountain Retreat",
  },
];

const travelFeatures = [
  {
    icon: "📅",
    title: "Easy Booking",
    description:
      "Discover destinations, choose your favorite package, and book your next adventure with ease.",
  },
  {
    icon: "🌍",
    title: "Handpicked Destinations",
    description:
      "Explore exciting destinations, from tropical beaches to breathtaking mountains and vibrant cities.",
  },
  {
    icon: "💙",
    title: "Manage Your Trips",
    description:
      "Keep track of your bookings and manage your travel plans conveniently in one place.",
  },
];

function Home() {
  return (
    <main className="home-page">
      {/* COASTAL ESCAPE HERO */}
      <section
        className="hero coastal-hero"
        style={{
          backgroundImage: `
            linear-gradient(
              90deg,
              rgba(7, 27, 49, 0.78) 0%,
              rgba(7, 27, 49, 0.42) 55%,
              rgba(7, 27, 49, 0.2) 100%
            ),
            url("${coastalHero}")
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="hero-content coastal-hero-content">
          <span className="hero-eyebrow">
            ✦ DISCOVER YOUR NEXT ADVENTURE
          </span>

          <h1>
            The World Is
            <span className="hero-highlight">
              {" "}Yours to Explore.
            </span>
          </h1>

          <p className="hero-description">
            Escape the ordinary. Discover breathtaking destinations,
            unforgettable experiences, and journeys worth remembering
            with TravelMate.
          </p>

          <div className="hero-actions">
            <Link
              to="/packages"
              className="hero-primary-button"
            >
              Explore Destinations
              <span aria-hidden="true"> →</span>
            </Link>

            <Link
              to="/about"
              className="hero-secondary-button"
            >
              Learn About Us
            </Link>
          </div>

          <div className="hero-highlights">
            <span>✈️ 9 Amazing Destinations</span>
            <span>🌍 Explore the World</span>
            <span>💙 Easy Trip Booking</span>
          </div>
        </div>
      </section>

      {/* WELCOME SECTION */}
      <section className="home-intro">
        <div className="home-intro-content">
          <span className="section-eyebrow">
            WELCOME TO TRAVELMATE
          </span>

          <h2>
            Your Journey Starts <span>Here</span>
          </h2>

          <p>
            Every great adventure begins with a dream.
            Whether you're searching for tropical beaches,
            vibrant cities, or breathtaking mountains,
            TravelMate helps you discover your perfect escape.
          </p>

          <Link
            to="/packages"
            className="intro-link"
          >
            Discover Our Travel Packages →
          </Link>
        </div>
      </section>

      {/* FEATURED DESTINATIONS */}
      <section className="featured-destinations">
        <div className="featured-heading">
          <span className="section-eyebrow">
            HANDPICKED FOR YOU
          </span>

          <h2>
            Featured <span>Destinations</span>
          </h2>

          <p>
            Explore some of our most exciting destinations
            and find inspiration for your next getaway.
          </p>
        </div>

        <div className="featured-grid">
          {featuredDestinations.map((destination) => (
            <article
              className="featured-card"
              key={destination.name}
            >
              <div className="featured-image-wrapper">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="featured-image"
                  loading="lazy"
                />

                <span className="featured-tag">
                  {destination.tag}
                </span>
              </div>

              <div className="featured-card-content">
                <h3>{destination.name}</h3>

                <p>{destination.description}</p>

                <Link
                  to="/packages"
                  className="featured-card-link"
                >
                  View Packages
                  <span aria-hidden="true"> →</span>
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="featured-footer">
          <Link
            to="/packages"
            className="featured-all-button"
          >
            Explore All Destinations →
          </Link>
        </div>
      </section>

      {/* WHY CHOOSE TRAVELMATE */}
      <section className="why-choose">
        <div className="why-choose-heading">
          <span className="section-eyebrow">
            THE TRAVELMATE EXPERIENCE
          </span>

          <h2>
            Why Choose <span>TravelMate?</span>
          </h2>

          <p>
            Your next adventure should be exciting,
            effortless, and unforgettable.
          </p>
        </div>

        <div className="why-choose-grid">
          {travelFeatures.map((feature) => (
            <article
              className="why-choose-card"
              key={feature.title}
            >
              <div
                className="why-choose-icon"
                aria-hidden="true"
              >
                {feature.icon}
              </div>

              <h3>{feature.title}</h3>

              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="home-final-cta">
        <div className="home-final-cta-content">
          <span>YOUR NEXT ADVENTURE AWAITS</span>

          <h2>
            Ready to Explore the World?
          </h2>

          <p>
            Find your dream destination and start planning
            unforgettable memories today.
          </p>

          <Link
            to="/packages"
            className="home-final-cta-button"
          >
            Start Exploring →
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Home;
