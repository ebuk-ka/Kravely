import { useState } from 'react';

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      q: "How do I place an order on Kravely?",
      a: "Simply download our app or visit the website, browse through available vendors and their menus, select your items, and proceed to checkout. We offer doorstep delivery in minutes!"
    },
    {
      q: "What areas does Kravely deliver to?",
      a: "Currently, we deliver across FUTO campus and surrounding areas in Owerri. We're rapidly expanding to more neighborhoods. Check your address on our app to see if we serve your location."
    },
    {
      q: "How much does delivery cost?",
      a: "Delivery is FREE for orders above ₦5,000. For orders below ₦5,000, a flat delivery fee of ₦300 applies. Your rider arrives within 15-30 minutes of order confirmation."
    },
    {
      q: "Can I become a vendor on Kravely?",
      a: "Absolutely! We're currently accepting new vendors. Join our WhatsApp waitlist to express interest, and our team will guide you through the onboarding process with competitive commission rates."
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept cash on delivery, bank transfers, and mobile money (MTN Mobile Money, Airtel Money). More payment options are coming soon!"
    },
    {
      q: "How can I track my order?",
      a: "Once your order is confirmed, you'll receive real-time tracking updates via SMS and in-app notifications. You can see your rider's location and estimated arrival time."
    },
    {
      q: "What if my order arrives late or has issues?",
      a: "We guarantee quality or your money back! Contact our support team immediately via the app or WhatsApp. Our team resolves 95%+ of complaints within 24 hours."
    },
    {
      q: "Are there any discounts or promo codes available?",
      a: "Yes! We frequently run promos for new users and loyal customers. Check the 'Promos' section in the app or follow our social media for the latest deals and discount codes."
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div style={{ background: "#000", padding: "80px 20px", position: "relative", overflow: "hidden" }}>
      {/* Decorative background elements */}
      <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, background: "radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -50, left: -50, width: 300, height: 300, background: "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

      <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 2 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <p style={{ color: "#22c55e", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: 2, marginBottom: 12, textTransform: "uppercase" }}>Have Questions?</p>
          <h2 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: "clamp(28px, 5vw, 42px)", letterSpacing: -1, marginBottom: 16 }}>
            Frequently Asked Questions
          </h2>
          <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 15, maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
            Everything you need to know about ordering, delivery, and becoming a Kravely vendor.
          </p>
        </div>

        {/* FAQ Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map((item, index) => (
            <div
              key={index}
              style={{
                background: "#0a0a0a",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 16,
                overflow: "hidden",
                transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                transform: activeIndex === index ? "scale(1.01)" : "scale(1)",
                borderColor: activeIndex === index ? "rgba(34,197,94,0.25)" : "rgba(255,255,255,0.06)",
                boxShadow: activeIndex === index ? "0 16px 40px rgba(34,197,94,0.1)" : "none"
              }}
              onMouseEnter={e => {
                if (activeIndex !== index) {
                  e.currentTarget.style.borderColor = "rgba(34,197,94,0.15)";
                }
              }}
              onMouseLeave={e => {
                if (activeIndex !== index) {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                }
              }}
            >
              {/* Question Button */}
              <button
                onClick={() => toggleFAQ(index)}
                style={{
                  width: "100%",
                  padding: "20px 24px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 16,
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => {
                  if (activeIndex !== index) {
                    e.currentTarget.style.background = "rgba(34,197,94,0.04)";
                  }
                }}
                onMouseLeave={e => {
                  if (activeIndex !== index) {
                    e.currentTarget.style.background = "none";
                  }
                }}
              >
                <span style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, textAlign: "left", flex: 1, letterSpacing: -0.5 }}>
                  {item.q}
                </span>
                <span style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: activeIndex === index ? "#22c55e" : "rgba(34,197,94,0.1)",
                  color: activeIndex === index ? "#000" : "#22c55e",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  fontWeight: 700,
                  flexShrink: 0,
                  transition: "all 0.3s",
                  transform: activeIndex === index ? "rotate(45deg)" : "rotate(0)"
                }}>
                  +
                </span>
              </button>

              {/* Answer */}
              <div style={{
                maxHeight: activeIndex === index ? 200 : 0,
                overflow: "hidden",
                transition: "max-height 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
              }}>
                <div style={{ padding: "0 24px 20px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <p style={{ color: "#a78bfa", fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.7 }}>
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div style={{
          background: "linear-gradient(135deg, rgba(34,197,94,0.08), rgba(124,58,237,0.08))",
          border: "1px solid rgba(34,197,94,0.15)",
          borderRadius: 20,
          padding: "40px 32px",
          textAlign: "center",
          marginTop: 60
        }}>
          <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 15, marginBottom: 16 }}>Still have questions?</p>
          <h3 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(18px, 4vw, 24px)", marginBottom: 20, letterSpacing: -0.5 }}>
            Get in touch with our support team
          </h3>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="https://wa.me/2348123456789"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "#22c55e",
                color: "#000",
                padding: "12px 28px",
                borderRadius: 50,
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
                fontSize: 14,
                textDecoration: "none",
                transition: "all 0.2s",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 8px 20px rgba(34,197,94,0.3)"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(34,197,94,0.4)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(34,197,94,0.3)";
              }}
            >
              💬 Chat on WhatsApp
            </a>
            <a
              href="mailto:support@kravely.com"
              style={{
                background: "rgba(124,58,237,0.1)",
                color: "#a78bfa",
                padding: "12px 28px",
                borderRadius: 50,
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
                fontSize: 14,
                textDecoration: "none",
                transition: "all 0.2s",
                border: "1px solid rgba(124,58,237,0.25)",
                cursor: "pointer"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(124,58,237,0.15)";
                e.currentTarget.style.borderColor = "rgba(124,58,237,0.4)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(124,58,237,0.1)";
                e.currentTarget.style.borderColor = "rgba(124,58,237,0.25)";
              }}
            >
              ✉️ Email us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
