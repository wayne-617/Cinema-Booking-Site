// Copied from welcome page, using as template
import React from 'react';
import logo from '../logo512.png';
import './dashboardPage.css'

export function dashboardPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--background-color)" }}>
      <header style={{ borderBottom: "1px solid var(--primary-accent)" }}>
        <div
          style={{
            margin: "0 auto",
            display: "flex",
            padding: "16px",
            maxWidth: "1200px",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ gap: "8px", display: "flex", alignItems: "center" }}>
             <img src = {logo} alt='Logo'className='logo'/>
            <span
              style={{ fontSize: "20px", fontFamily: "var(--font-heading)", fontWeight: "bold" }}
            >
              Absolute Cinema
            </span>
          </div>
          <nav style={{ gap: "32px", display: "flex", alignItems: "center" }}>
            <button
              href="/login"
              className='buttons'
            >
              Movies
            </button>
            <button
              href="/login"
              className='buttons'
            >
              Showtimes
            </button>
            <button
              href="/login"
              className='buttons'
            >
              Theaters
            </button>
            <button className='buttons'
              href="/login"
            >
              About
            </button>
          </nav>
          <div style={{ gap: "16px", display: "flex", alignItems: "center" }}>
            <button className='buttons' size="sm" variant="ghost">
              Sign In
            </button>
            <button className='buttons' size="sm">Book Now</button>
          </div>
        </div>
      </header>
      <section style={{ padding: "80px 0", overflow: "hidden", position: "relative" }}>
        <div
          style={{
            inset: "0",
            zIndex: 10,
            position: "absolute",
            background:
              "linear-gradient(to bottom, var(--primary-color), var(--primary-accent), transparent)",
          }}
        />
        <div style={{ inset: "0", opacity: 0.2, position: "absolute" }}>
        </div>
        <div
          style={{
            margin: "0 auto",
            zIndex: 20,
            padding: "0 16px",
            maxWidth: "1200px",
            position: "relative",
          }}
        >
          <div style={{ maxWidth: "768px" }}>
            <h1
              style={{
                fontSize: "48px",
                fontFamily: "var(--font-heading)",
                fontWeight: "bold",
                lineHeight: 1.1,
                marginBottom: "24px",
              }}
            >
              Experience Cinema Like Never Before
            </h1>
            <p
              style={{
                color: "var(--text-color)",
                fontSize: "20px",
                lineHeight: 1.6,
                marginBottom: "32px",
              }}
            >
              Immerse yourself in the latest blockbusters with state-of-the-art sound, crystal-clear
              visuals, and luxury seating that puts you right in the action.
            </p>
            <div style={{ gap: "16px", display: "flex", flexDirection: "column" }}>
              <button className='buttons' size="lg" style={{ padding: "24px 32px", fontSize: "18px" }}>
                Book Tickets Now
              </button>
              <button
              className='buttons'
                size="lg"
                style={{ padding: "24px 32px", fontSize: "18px" }}
                variant="outline"
              >
                Watch Trailer
              </button>
            </div>
          </div>
        </div>
      </section>
      <section style={{ padding: "64px 0" }}>
        <div style={{ margin: "0 auto", padding: "0 16px", maxWidth: "1200px" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2
              style={{
                fontSize: "36px",
                fontFamily: "var(--font-heading)",
                fontWeight: "bold",
                marginBottom: "16px",
              }}
            >
              Why Choose Absolute Cinema?
            </h2>
            <p style={{ color: "var(--primary-color)", fontSize: "18px" }}>
              Premium cinema experience with cutting-edge technology
            </p>
          </div>
          <div style={{ gap: "32px", display: "grid", gridTemplateColumns: "1fr" }}>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  margin: "0 auto 16px",
                  display: "flex",
                  alignItems: "center",
                  transition: "background-color 0.2s",
                  borderRadius: "50%",
                  justifyContent: "center",
                  backgroundColor: "var(--primary-color) / 0.1)",
                }}
              >
              </div>
              <h3 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "12px" }}>
                Dolby Atmos Sound
              </h3>
              <p style={{ color: "var(--primary-color)" }}>
                Immersive 3D audio that puts you right in the middle of the action with
                crystal-clear sound quality.
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  margin: "0 auto 16px",
                  display: "flex",
                  alignItems: "center",
                  transition: "background-color 0.2s",
                  borderRadius: "50%",
                  justifyContent: "center",
                  backgroundColor: "var(--primary-color) / 0.1)",
                }}
              >
              </div>
              <h3 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "12px" }}>
                4K Laser Projection
              </h3>
              <p style={{ color: "var(--primary-color)" }}>
                Ultra-high definition visuals with vibrant colors and sharp details that bring
                movies to life.
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  margin: "0 auto 16px",
                  display: "flex",
                  alignItems: "center",
                  transition: "background-color 0.2s",
                  borderRadius: "50%",
                  justifyContent: "center",
                  backgroundColor: "var(--primary-color) / 0.1)",
                }}
              >
              </div>
              <h3 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "12px" }}>
                Luxury Reclining Seats
              </h3>
              <p style={{ color: "var(--primary-color)" }}>
                Plush leather recliners with personal tables and cup holders for maximum comfort
                during your movie.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section style={{ padding: "64px 0", backgroundColor: "(var(--secondary-color) / 0.3)" }}>
        <div style={{ margin: "0 auto", padding: "0 16px", maxWidth: "1200px" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2
              style={{
                fontSize: "36px",
                fontFamily: "var(--font-heading)",
                fontWeight: "bold",
                marginBottom: "16px",
              }}
            >
              Today's Showtimes
            </h2>
            <p style={{ color: "var(--primary-color)", fontSize: "18px" }}>
              Select your preferred time and book instantly
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
export default welcomePage;