
import baliImage from "../assets/packages/bali.jpg";
import dubaiImage from "../assets/packages/dubai.jpg";
import switzerlandImage from "../assets/packages/switzerland.jpg";
import maldivesImage from "../assets/packages/maldives.jpg";
import parisImage from "../assets/packages/paris.jpg";
import manaliImage from "../assets/packages/manali.jpg";
import goaImage from "../assets/packages/goa.jpg";
import japanImage from "../assets/packages/japan.jpg";
import keralaImage from "../assets/packages/kerala.jpg";

const travelPackages = [
  {
    name: "Bali",
    image: baliImage,
    duration: "5 Days / 4 Nights",
    tagline: "Tropical beaches & island adventures",
    price: 25000,
  },
  {
    name: "Dubai",
    image: dubaiImage,
    duration: "4 Days / 3 Nights",
    tagline: "Luxury, shopping & desert experiences",
    price: 30000,
  },
  {
    name: "Switzerland",
    image: switzerlandImage,
    duration: "7 Days / 6 Nights",
    tagline: "Alpine views, lakes & mountain escapes",
    price: 75000,
  },
  {
    name: "Maldives",
    image: maldivesImage,
    duration: "5 Days / 4 Nights",
    tagline: "Turquoise lagoons & island relaxation",
    price: 45000,
  },
  {
    name: "Paris",
    image: parisImage,
    duration: "6 Days / 5 Nights",
    tagline: "Art, landmarks & romantic city walks",
    price: 65000,
  },
  {
    name: "Manali",
    image: manaliImage,
    duration: "4 Days / 3 Nights",
    tagline: "Mountain views & Himalayan adventures",
    price: 12000,
  },
  {
    name: "Goa",
    image: goaImage,
    duration: "3 Days / 2 Nights",
    tagline: "Sunny beaches & coastal getaways",
    price: 10000,
  },
  {
    name: "Japan",
    image: japanImage,
    duration: "7 Days / 6 Nights",
    tagline: "Temples, cities & cultural discoveries",
    price: 85000,
  },
  {
    name: "Kerala",
    image: keralaImage,
    duration: "5 Days / 4 Nights",
    tagline: "Backwaters, greenery & peaceful escapes",
    price: 18000,
  },
];

function Packages({ onSelectPackage }) {
  return (
    <main className="packages-page">
      {/* PAGE HEADER */}
      <section className="packages-banner">
        <span className="packages-eyebrow">
          ✦ DISCOVER THE WORLD WITH TRAVELMATE
        </span>

        <h1>
          Explore Our <span>Travel Packages</span>
        </h1>

        <p>
          From tropical islands to breathtaking mountains,
          discover unforgettable destinations and find
          the perfect journey for your next adventure.
        </p>

        <div className="packages-banner-highlights">
          <span>🌍 9 Destinations</span>
          <span>✈️ Memorable Adventures</span>
          <span>💙 Easy Booking</span>
        </div>
      </section>

      {/* TRAVEL PACKAGES */}
      <section className="packages" id="packages">
        <div className="packages-section-heading">
          <span className="packages-section-label">
            FIND YOUR PERFECT ESCAPE
          </span>

          <h2>
            Destinations Worth <span>Exploring</span>
          </h2>

          <p>
            Browse our travel packages and choose
            the adventure that's right for you.
          </p>
        </div>

        <div className="package-list">
          {travelPackages.map((travelPackage) => (
            <article
              className="package-card"
              key={travelPackage.name}
            >
              <div className="package-image-wrap">
                <img
                  className="package-image"
                  src={travelPackage.image}
                  alt={`${travelPackage.name} destination`}
                  loading="lazy"
                />

                <span className="package-duration">
                  🕒 {travelPackage.duration}
                </span>
              </div>

              <div className="package-card-content">
                <div className="package-location-label">
                  ✦ EXPLORE DESTINATION
                </div>

                <h3>{travelPackage.name}</h3>

                <p className="package-tagline">
                  {travelPackage.tagline}
                </p>

                <div className="package-card-bottom">
                  <div className="package-price-block">
                    <span className="package-price-label">
                      Starting from
                    </span>

                    <p className="price">
                      ₹{travelPackage.price.toLocaleString("en-IN")}
                      <span className="package-price-unit">
                        {" "}/ person
                      </span>
                    </p>
                  </div>

                  <button
                    type="button"
                    className="package-view-button"
                    onClick={() =>
                      onSelectPackage(travelPackage.name)
                    }
                  >
                    View Details →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* BOTTOM MESSAGE */}
      <section className="packages-bottom-cta">
        <h2>Your Next Adventure Starts Here</h2>
        <p>
          Explore destinations, discover new experiences,
          and create memories that last a lifetime.
        </p>
      </section>
    </main>
  );
}

export default Packages;
