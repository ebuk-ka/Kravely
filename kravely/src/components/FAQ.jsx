import { useState } from "react";

const faqs = [
  {
    tag: "Ordering",
    tagColor: "#22c55e",
    tagBg: "rgba(34,197,94,0.1)",
    questions: [
      {
        q: "How do I place an order on Kravely?",
        a: "Simply sign up for a free account, browse vendors and meals on the Order Now page, add items to your cart, and checkout securely with Paystack. Your order goes straight to the vendor!",
      },
      {
        q: "What areas on FUTO campus does Kravely deliver to?",
        a: "We deliver across FUTO campus including all hostels (Umuchima, Eziobodo, Obinze, Ihiagwa), faculty areas, and Backgate. More locations are being added as we grow.",
      },
      {
        q: "How long does delivery take?",
        a: "Most meals arrive in 15–30 minutes. Jumbo/bulk orders from Pearl's Cuisine take 3-4hrs minutes as meals are freshly prepared. You'll see the estimated delivery time before you order.",
      },
      {
        q: "Can I order for a group of people?",
        a: "Absolutely! Pearl's Cuisine specialises in jumbo orders and bulk deliveries — perfect for hostel groups, events, or study sessions. Just add multiple items to your cart.",
      },
    ],
  },
  {
    tag: "Payments",
    tagColor: "#60a5fa",
    tagBg: "rgba(96,165,250,0.1)",
    questions: [
      {
        q: "How do I pay for my order?",
        a: "We use Paystack — Nigeria's most trusted payment platform. You can pay with your debit card, bank transfer, or USSD (*737#, *901# etc). All transactions are secured and encrypted.",
      },
      {
        q: "Is there a delivery fee?",
        a: "Yes, there's a flat delivery fee of ₦ 600 per order. This is shown clearly at checkout before you confirm. Your first order gets free delivery when you sign up!",
      },
      {
        q: "What happens if my payment fails?",
        a: "No money is deducted if your payment fails. You can try again immediately or use a different payment method. Your cart stays saved so you don't have to re-add items.",
      },
    ],
  },
  {
    tag: "Vendors",
    tagColor: "#eab308",
    tagBg: "rgba(234,179,8,0.1)",
    questions: [
      {
        q: "How do I register my food business on Kravely?",
        a: "Click 'Join as Vendor' on the homepage and fill out the vendor signup form. Our team reviews applications within 24 hours. Once approved, you get your own vendor dashboard to manage orders and menus.",
      },
      {
        q: "What commission does Kravely charge vendors?",
        a: "Kravely charges a 15% commission on each successful order. No monthly fees or setup costs — you only pay when you earn. Featured vendor placement is available for ₦25,000/month.",
      },
      {
        q: "Can I update my menu and prices at any time?",
        a: "Yes! Your vendor dashboard lets you add, remove, and update menu items and prices instantly. You can also mark items as unavailable without deleting them.",
      },
      {
        q: "How and when do vendors get paid?",
        a: "Vendor payouts are processed after each order is marked as delivered. Payments are sent directly to your registered bank account via Paystack — fast and reliable.",
      },
    ],
  },
  {
    tag: "Account",
    tagColor: "#a78bfa",
    tagBg: "rgba(167,139,250,0.1)",
    questions: [
      {
        q: "Is Kravely free to use for students?",
        a: "Yes! Creating an account is completely free. You only pay for the food you order plus the ₦300 delivery fee. No subscription, no hidden charges.",
      },
      {
        q: "I forgot my password. How do I reset it?",
        a: "Click 'Forgot password?' on the login page and enter your email. We'll send you a reset link within minutes. Check your spam folder if you don't see it.",
      },
      {
        q: "Can I cancel an order after placing it?",
        a: "You can cancel within 2 minutes of placing an order before the vendor starts preparing. Once preparation begins, cancellations are not possible. Contact support if you have urgent issues.",
      },
    ],
  },
];

function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <button
        onClick={onToggle}
        style={{
          width: "100%", background: "none", border: "none",
          cursor: "pointer", textAlign: "left",
          padding: "20px 0", display: "flex",
          justifyContent: "space-between", alignItems: "center", gap: 16,
        }}
      >
        <span style={{
          color: "#fff", fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600, fontSize: 15, lineHeight: 1.5,
        }}>
          {question}
        </span>
        <div style={{
          width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
          background: isOpen ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.06)",
          border: `1px solid ${isOpen ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.1)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.25s ease",
        }}>
          <span style={{
            color: isOpen ? "#22c55e" : "#6b7280",
            fontSize: 20, lineHeight: 1,
            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
            transition: "transform 0.25s ease, color 0.25s ease",
            display: "block", marginTop: "-2px",
          }}>+</span>
        </div>
      </button>

      {/* Answer */}
      <div style={{
        maxHeight: isOpen ? 400 : 0,
        overflow: "hidden",
        transition: "max-height 0.4s cubic-bezier(0.22,1,0.36,1)",
      }}>
        <p style={{
          color: "#9ca3af", fontFamily: "'DM Sans', sans-serif",
          fontSize: 15, lineHeight: 1.8,
          paddingBottom: 20, margin: 0,
        }}>
          {answer}
        </p>
      </div>
    </div>
  );
}

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  let globalIdx = 0;

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <section style={{
        background: "#000", padding: "100px 0",
        position: "relative", overflow: "hidden",
      }}>
        {/* Background glow */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.05) 0%, transparent 60%)",
        }} />

        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px", position: "relative", zIndex: 1 }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{
              color: "#22c55e", fontFamily: "'DM Sans', sans-serif",
              fontSize: 12, fontWeight: 700, letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}>
              FAQ
            </span>
            <h2 style={{
              color: "#fff", fontFamily: "'Syne', sans-serif",
              fontWeight: 900, fontSize: "clamp(28px, 5vw, 48px)",
              letterSpacing: -1.5, marginTop: 12, marginBottom: 16,
            }}>
              Got questions?
            </h2>
            <p style={{
              color: "#6b7280", fontFamily: "'DM Sans', sans-serif",
              fontSize: 16, lineHeight: 1.7, maxWidth: 480, margin: "0 auto",
            }}>
              Everything you need to know about ordering food on FUTO campus with Kravely.
            </p>
          </div>

          {/* FAQ Sections */}
          {faqs.map((section) => (
            <div key={section.tag} style={{ marginBottom: 48 }}>

              {/* Section tag */}
              <div style={{ marginBottom: 8 }}>
                <span style={{
                  background: section.tagBg,
                  color: section.tagColor,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12, fontWeight: 700,
                  padding: "4px 14px", borderRadius: 50,
                  border: `1px solid ${section.tagColor}30`,
                }}>
                  {section.tag}
                </span>
              </div>

              {/* Questions */}
              {section.questions.map((item) => {
                const idx = globalIdx++;
                return (
                  <FAQItem
                    key={idx}
                    question={item.q}
                    answer={item.a}
                    isOpen={openIndex === idx}
                    onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
                  />
                );
              })}
            </div>
          ))}

          {/* Bottom CTA */}
          <div style={{
            marginTop: 64, textAlign: "center",
            background: "linear-gradient(135deg, rgba(34,197,94,0.05) 0%, rgba(34,197,94,0.02) 100%)",
            border: "1px solid rgba(34,197,94,0.2)",
            borderRadius: 24, padding: "48px 32px",
          }}>
            <p style={{
              color: "#fff", fontFamily: "'Syne', sans-serif",
              fontWeight: 700, fontSize: 22, marginBottom: 12, letterSpacing: -0.5,
            }}>
              Still have questions?
            </p>
            <p style={{
              color: "#9ca3af", fontFamily: "'DM Sans', sans-serif",
              fontSize: 15, marginBottom: 28, lineHeight: 1.6,
            }}>
              Can't find the answer you're looking for? Our team is here to help.
            </p>
            <a
              href="mailto:kravelyhelp@gmail.com"
              style={{
                background: "#22c55e", color: "#000",
                fontFamily: "'DM Sans', sans-serif", fontWeight: 800,
                fontSize: 15, padding: "14px 32px", borderRadius: 12,
                textDecoration: "none", display: "inline-block",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(34,197,94,0.2)",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#16a34a"; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(34,197,94,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#22c55e"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(34,197,94,0.2)"; }}
            >
              Get in Touch
            </a>
          </div>

        </div>
      </section>
    </>
  );
}

export default FAQ;
