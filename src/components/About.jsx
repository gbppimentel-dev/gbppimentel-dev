import { asset } from "../utils/assets";

export default function About() {
  return (
    <section
      className="works"
      id="about"
    >
      <div className="section-art" aria-hidden="true" style={{ backgroundImage: `url(${asset("images/about-me.png")})` }} />
      <div className="container">
        <div style={{ textAlign: "center" }}>
          <div
            className="works-title"
            style={{
              display: "inline-block",
              color: "white",
              marginBottom: "10px",
            }}
          >
            <h2>ABOUT ME</h2>
            <p
              style={{
                textAlign: "justify",
                fontFamily: "'Poppins'",
                color: "white",
                fontWeight: "500",
                marginTop: "25px",
              }}
            >
              Hello, I'm Glenn Bernard Pimentel – a digital creator experienced in crafting web
              applications, handling databases, designing games, and producing
              artworks. Here’s where code and creativity meet.
            </p>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 col-md-6 col-lg-3 about-me">
            <div className="about-card">
              <div className="about-image01" aria-hidden="true"></div>
              <div className="about-content01">
                <h3>Web development</h3>
                <p
                  className="about-text-1"
                  style={{
                    textTransform: "none",
                    fontFamily: "'Roboto', sans-serif",
                    fontWeight: "400",
                  }}
                >
                  From front-end to back-end, I love to create online
                  experiences. With
                  {" "}<span style={{ color: "var(--coral)", fontWeight: "600" }}>
                    React
                  </span>, I code efficient designs with powerful functionality. My
                  expertise in
                  {" "}<span style={{ color: "var(--blue)", fontWeight: "600" }}>
                    CSS
                  </span>{" "}
                  and
                  {" "}<span style={{ color: "var(--lilac)", fontWeight: "600" }}>
                    Bootstrap
                  </span>{" "}
                  help me publish responsive layouts. I ensure consistent user
                  experiences. I prototype on
                  {" "}<span style={{ color: "var(--amber)", fontWeight: "600" }}>
                    Figma
                  </span>, deploy on
                  {" "}<span style={{ color: "var(--sage)", fontWeight: "600" }}>
                    Vercel
                  </span>
                  /
                  {" "}<span style={{ color: "var(--blue)", fontWeight: "600" }}>
                    GitHub Pages
                  </span>{" "}
                  - turning visions into live websites.
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3 about-me">
            <div className="about-card">
              <div className="about-image02" aria-hidden="true"></div>
              <div className="about-content02">
                <h3>Databases</h3>
                <p
                  className="about-text-1"
                  style={{
                    textTransform: "none",
                    fontFamily: "'Roboto', sans-serif",
                    fontWeight: "400",
                  }}
                >
                  I contributed building full-stack web services. I have
                  relevant experience in
                  {" "}<span style={{ color: "var(--coral)", fontWeight: "600" }}>
                    mySQL
                  </span>{" "}
                  and
                  {" "}<span style={{ color: "var(--blue)", fontWeight: "600" }}>
                    PHP
                  </span>
                  . For now, I'm currently studying
                  {" "}<span style={{ color: "var(--sage)", fontWeight: "600" }}>
                    MongoDB
                  </span>
                  . I create, optimize, and secure databases. I use
                  {" "}<span style={{ color: "var(--amber)", fontWeight: "600" }}>
                    PHPMyAdmin
                  </span>{" "}
                  for efficient administration, guaranteeing data integrity.
                  Whether structuring
                  {" "}<span style={{ color: "var(--lilac)", fontWeight: "600" }}>
                    queries
                  </span>{" "}
                  or designing relational databases, I ensure seamless back-end.
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3 about-me">
            <div className="about-card">
              <div className="about-image03" aria-hidden="true"></div>
              <div className="about-content03">
                <h3>Game development</h3>
                <p
                  className="about-text-1"
                  style={{
                    textTransform: "none",
                    fontFamily: "'Roboto', sans-serif",
                    fontWeight: "400",
                  }}
                >
                  Gaming is my passion since I was young. I tinkered with
                  {" "}<span style={{ color: "var(--coral)", fontWeight: "600" }}>
                    Unity
                  </span>, and built multiple
                  {" "}<span style={{ color: "var(--blue)", fontWeight: "600" }}>
                    Ren'py
                  </span>{" "}
                  VN games. I love to tell 2D stories and wonders with engaging
                  narratives. Proficient in objective
                  {" "}<span style={{ color: "var(--amber)", fontWeight: "600" }}>
                    C#
                  </span>,
                  {" "}<span style={{ color: "var(--lilac)", fontWeight: "600" }}>
                    C++
                  </span>, and
                  {" "}<span style={{ color: "var(--sage)", fontWeight: "600" }}>
                    scripting
                  </span>, I code intricate gameplay and interfaces. Beyond code, I
                  take account performance for an immersive player experience.
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3 about-me">
            <div className="about-card">
              <div className="about-image04" aria-hidden="true"></div>
              <div className="about-content04">
                <h3>Digital art</h3>
                <p
                  className="about-text-1"
                  style={{
                    textTransform: "none",
                    fontFamily: "'Roboto', sans-serif",
                    fontWeight: "400",
                  }}
                >
                  Creativity is the word that defines me. With tools like
                  {" "}<span style={{ color: "var(--coral)", fontWeight: "600" }}>
                    Photoshop
                  </span>,
                  {" "}<span style={{ color: "var(--blue)", fontWeight: "600" }}>
                    Procreate
                  </span>, and
                  {" "}<span style={{ color: "var(--amber)", fontWeight: "600" }}>
                    Illustrator
                  </span>, I craft digital art that speaks volumes. From illustrations,
                  vector graphics, and 3D art I visualize ideas across
                  platforms. I am well versed in
                  {" "}<span style={{ color: "var(--lilac)", fontWeight: "600" }}>
                    Figma
                  </span>{" "}
                  and
                  {" "}<span style={{ color: "var(--sage)", fontWeight: "600" }}>
                    Canva
                  </span>{" "}
                  as I love to design engaging user interfaces and captivating
                  digital content.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
