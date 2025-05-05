import React, { useEffect, useState } from "react";

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const testimonials = [
    { quote: "Kashi helped me find unique vintage pieces at great prices!", author: "Sofia", image: "https://i.pravatar.cc/150?img=1" },
    { quote: "As a seller, I've been able to turn my closet into a small business.", author: "Amir", image: "https://i.pravatar.cc/150?img=2" },
    { quote: "The community is so welcoming, and I love supporting sustainable fashion.", author: "Layla", image: "https://i.pravatar.cc/150?img=3" },
    { quote: "Easy to use and a great way to recycle fashion.", author: "Zara", image: "https://i.pravatar.cc/150?img=4" },
    { quote: "I found amazing deals and love the platform design!", author: "Noah", image: "https://i.pravatar.cc/150?img=5" },
    { quote: "Excellent customer service and a vibrant community.", author: "Yasmine", image: "https://i.pravatar.cc/150?img=6" },
    { quote: "My favorite thrift app so far. Everything just works!", author: "Liam", image: "https://i.pravatar.cc/150?img=7" },
    { quote: "Stylish, sustainable, and smart shopping.", author: "Emma", image: "https://i.pravatar.cc/150?img=8" },
    { quote: "I've saved money and look great doing it!", author: "Omar", image: "https://i.pravatar.cc/150?img=9" }
  ];

  const testimonialsPerSlide = 3;
  const totalSlides = Math.ceil(testimonials.length / testimonialsPerSlide);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const styles = {
    page: {
      backgroundColor: "#fefcf9",
      minHeight: "100vh",
      padding: "2rem 1.5rem 4rem",
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      fontFamily: "'Segoe UI', sans-serif",
    },
    heading: {
      fontSize: "3.5rem",
      fontWeight: "800",
      marginBottom: "1.5rem",
      color: "#1f1f1f",
      lineHeight: "1.2",
    },
    orangeText: {
      color: "#f97316",
    },
    darkerOrangeText: {
      color: "#ea580c",
    },
    paragraph: {
      fontSize: "1.25rem",
      color: "#444",
      maxWidth: "700px",
      margin: "0 auto 2.5rem",
      fontFamily: "'Comic Sans MS', 'Comic Sans', cursive",
      fontWeight: "400",
      letterSpacing: "0.3px",
    },
    button: {
      backgroundColor: "#f97316",
      color: "#fff",
      padding: "1.2rem 3rem",
      borderRadius: "999px",
      fontSize: "1.4rem",
      fontWeight: "600",
      textDecoration: "none",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      transition: "background-color 0.3s ease",
    },
    features: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      gap: "2rem",
      flexWrap: "wrap",
      maxWidth: "1140px",
      marginTop: "4rem",
      marginBottom: "4rem",
      width: "100%",
    },
    featureCard: {
      backgroundColor: "#fff",
      padding: "2.5rem 2rem",
      borderRadius: "1.5rem",
      boxShadow: "0 6px 18px rgba(0,0,0,0.07)",
      flex: "1 1 300px",
      maxWidth: "360px",
    },
    featureHeading: {
      color: "#f97316",
      fontSize: "1.6rem",
      fontWeight: "700",
      marginBottom: "1rem",
    },
    featureText: {
      fontSize: "1.15rem",
      color: "#555",
      lineHeight: "1.7",
    },
    aboutSection: {
      marginTop: "5rem",
      backgroundColor: "#fff",
      borderRadius: "1.5rem",
      padding: "3rem 2rem",
      maxWidth: "1000px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
    },
    aboutTitle: {
      fontSize: "2.2rem",
      fontWeight: "700",
      color: "#f97316",
      marginBottom: "1rem",
    },
    aboutText: {
      fontSize: "1.2rem",
      color: "#444",
      lineHeight: "1.8",
    },
    testimonialSection: {
      marginTop: "5rem",
      maxWidth: "1200px",
      textAlign: "center",
      padding: "0 1rem",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    testimonialTitle: {
      fontSize: "2rem",
      color: "#ea580c",
      fontWeight: "700",
      marginBottom: "2rem",
    },
    testimonialGrid: {
      display: "flex",
      justifyContent: "center",
      alignItems: "stretch",
      gap: "2rem",
      flexWrap: "nowrap",
    },
    testimonialCard: {
      backgroundColor: "#fff",
      padding: "1.5rem",
      borderRadius: "1rem",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      maxWidth: "300px",
      minWidth: "280px",
      flex: "1 1 300px",
      textAlign: "center",
    },
    image: {
      width: "60px",
      height: "60px",
      borderRadius: "50%",
      marginBottom: "1rem",
    },
    arrows: {
      display: "flex",
      justifyContent: "center",
      gap: "1rem",
      marginTop: "1.5rem",
    },
    arrowBtn: {
      padding: "0.6rem 1.2rem",
      backgroundColor: "#f97316",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
    },
    faqSection: {
      marginTop: "5rem",
      maxWidth: "1000px",
      textAlign: "left",
    },
    faqTitle: {
      fontSize: "2rem",
      fontWeight: "700",
      color: "#f97316",
      textAlign: "center",
      marginBottom: "2rem",
    },
    faqItem: {
      marginBottom: "1.5rem",
    },
    faqQuestion: {
      fontWeight: "700",
      fontSize: "1.1rem",
      marginBottom: "0.5rem",
    },
    faqAnswer: {
      color: "#555",
      lineHeight: "1.6",
    },
    ctaBanner: {
      marginTop: "4rem",
      padding: "2.5rem 2rem",
      backgroundColor: "#fff3e8",
      borderRadius: "1.5rem",
      boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    },
    ctaTitle: {
      fontSize: "2rem",
      fontWeight: "700",
      color: "#f97316",
      marginBottom: "1rem",
    },
    ctaText: {
      fontSize: "1.1rem",
      color: "#444",
      marginBottom: "1.5rem",
    },
  };

  const startIndex = currentSlide * testimonialsPerSlide;
  const currentTestimonials = testimonials.slice(startIndex, startIndex + testimonialsPerSlide);
  const fillerCount = testimonialsPerSlide - currentTestimonials.length;

  return (
    <div style={styles.page}>
      <div style={{ maxWidth: "48rem" }}>
        <h1 style={styles.heading}>
          Discover <span style={styles.orangeText}>Timeless Style</span> with{" "}
          <span style={styles.darkerOrangeText}>Kashi</span>
        </h1>
        <p style={styles.paragraph}>
          Buy and sell second-hand fashion with ease. Discover unique items,
          support sustainability, and join a stylish community built for modern fashion lovers.
        </p>
        <a
          href="/main"
          style={styles.button}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#ea580c")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f97316")}
        >
          Enter the Marketplace
        </a>
      </div>

      <div style={styles.features}>
        <div style={styles.featureCard}>
          <h3 style={styles.featureHeading}>👚 Unique Finds</h3>
          <p style={styles.featureText}>
            Explore one-of-a-kind pieces you won’t find in stores.
          </p>
        </div>
        <div style={styles.featureCard}>
          <h3 style={styles.featureHeading}>🌱 Sustainable</h3>
          <p style={styles.featureText}>
            Give clothes a second life and reduce fashion waste.
          </p>
        </div>
        <div style={styles.featureCard}>
          <h3 style={styles.featureHeading}>💬 Community</h3>
          <p style={styles.featureText}>
            Join a vibrant community of fashion lovers, sellers, and creatives.
          </p>
        </div>
      </div>

      <div style={styles.aboutSection}>
        <h2 style={styles.aboutTitle}>Why Kashi?</h2>
        <p style={styles.aboutText}>
          Kashi is more than a fashion marketplace — it's a movement toward sustainability
          and self-expression. Whether you're cleaning out your closet or looking for something
          bold and affordable, our platform offers a seamless experience.
        </p>
      </div>

      <div style={styles.testimonialSection}>
  <h2 style={styles.testimonialTitle}>What Our Users Say</h2>
  <div style={{ position: "relative", width: "100%", maxWidth: "1200px" }}>
    {/* Left arrow */}
    <button
      onClick={handlePrev}
      style={{
        ...styles.arrowBtn,
        position: "absolute",
        left: "-60px",
        top: "50%",
        transform: "translateY(-50%)",
      }}
    >
      ‹
    </button>

    {/* Testimonials */}
    <div style={{ ...styles.testimonialGrid, justifyContent: "center" }}>
      {currentTestimonials.map((t, index) => (
        <div key={index} style={styles.testimonialCard}>
          <img src={t.image} alt={t.author} style={styles.image} />
          <p>"{t.quote}"</p>
          <strong>- {t.author}</strong>
        </div>
      ))}
      {Array.from({ length: fillerCount }).map((_, i) => (
        <div key={`filler-${i}`} style={{ ...styles.testimonialCard, visibility: 'hidden' }} />
      ))}
    </div>

    {/* Right arrow */}
    <button
      onClick={handleNext}
      style={{
        ...styles.arrowBtn,
        position: "absolute",
        right: "-60px",
        top: "50%",
        transform: "translateY(-50%)",
      }}
    >
      ›
    </button>
  </div>
</div>



      <div style={styles.faqSection}>
        <h2 style={styles.faqTitle}>Frequently Asked Questions</h2>
        <div style={styles.faqItem}>
          <div style={styles.faqQuestion}>How do I start selling on Kashi?</div>
          <div style={styles.faqAnswer}>Sign up, take photos of your items, and list them. Simple!</div>
        </div>
        <div style={styles.faqItem}>
          <div style={styles.faqQuestion}>Is there a fee for listing items?</div>
          <div style={styles.faqAnswer}>No listing fees! We only take a small cut when your item sells.</div>
        </div>
        <div style={styles.faqItem}>
          <div style={styles.faqQuestion}>How long does shipping take?</div>
          <div style={styles.faqAnswer}>Most deliveries arrive within 3–7 days depending on your location.</div>
        </div>
      </div>

      <div style={styles.ctaBanner}>
        <h2 style={styles.ctaTitle}>Ready to start your fashion journey?</h2>
        <p style={styles.ctaText}>Join thousands of users discovering second-hand fashion. It’s fast, easy, and rewarding.</p>
        <a
          href="/signup"
          style={styles.button}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#ea580c")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f97316")}
        >
          Create an Account
        </a>
      </div>
    </div>
  );
}
