import { useEffect, useRef } from "react";

function CoverageMap() {
  const canvasRef = useRef(null);

  // Define locations constant for use in both map and JSX
  const locations = [
    {
      id: 1,
      name: "Umuchima Hostel",
      emoji: "🏨",
      x: 25,
      y: 30,
      description: "Main student residence",
      color: "#22c55e",
    },
    {
      id: 2,
      name: "Eziobodo Hostel",
      emoji: "🏠",
      x: 75,
      y: 35,
      description: "North campus area",
      color: "#60a5fa",
    },
    {
      id: 3,
      name: "Obinze Hostel",
      emoji: "🏢",
      x: 50,
      y: 70,
      color: "#fbbf24",
    },
    {
      id: 4,
      name: "Ihiagwa Hostel",
      emoji: "🏘️",
      x: 25,
      y: 70,
      color: "#a78bfa",
    },
    {
      id: 5,
      name: "Faculty Areas",
      emoji: "🏛️",
      x: 50,
      y: 25,
      color: "#ec4899",
    },
    {
      id: 6,
      name: "Backgate",
      emoji: "🚪",
      x: 75,
      y: 70,
      color: "#f97316",
    },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas with campus ground color
    ctx.fillStyle = "#0f2c1a";
    ctx.fillRect(0, 0, width, height);

    // ===== DRAW ROADS =====
    const roads = [
      { x1: 0, y1: 40, x2: 100, y2: 40, width: 10 }, // Horizontal main road
      { x1: 50, y1: 0, x2: 50, y2: 100, width: 10 }, // Vertical main road
      { x1: 20, y1: 20, x2: 80, y2: 60, width: 7 }, // Diagonal road
    ];

    roads.forEach((road) => {
      const x1 = (road.x1 / 100) * width;
      const y1 = (road.y1 / 100) * height;
      const x2 = (road.x2 / 100) * width;
      const y2 = (road.y2 / 100) * height;
      const rw = (road.width / 100) * width;

      // Road background
      ctx.strokeStyle = "rgba(100,110,100,0.7)";
      ctx.lineWidth = rw;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Road markings (dashed lines)
      ctx.strokeStyle = "rgba(220,200,140,0.3)";
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 6]);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // ===== DRAW BUILDINGS FOR LOCATIONS =====
    locations.forEach((loc) => {
      const x = (loc.x / 100) * width;
      const y = (loc.y / 100) * height;
      const bw = 40; // Building width
      const bh = 45; // Building height

      // Building shadow
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;

      // Main building color
      ctx.fillStyle = loc.color + "cc";
      ctx.fillRect(x - bw / 2, y - bh / 2, bw, bh);

      // Building border
      ctx.shadowColor = "transparent";
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2.5;
      ctx.strokeRect(x - bw / 2, y - bh / 2, bw, bh);

      // Building roof (triangle)
      ctx.fillStyle = loc.color;
      ctx.beginPath();
      ctx.moveTo(x - bw / 2, y - bh / 2);
      ctx.lineTo(x, y - bh / 2 - 15);
      ctx.lineTo(x + bw / 2, y - bh / 2);
      ctx.fill();

      // Roof border
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x - bw / 2, y - bh / 2);
      ctx.lineTo(x, y - bh / 2 - 15);
      ctx.lineTo(x + bw / 2, y - bh / 2);
      ctx.stroke();

      // Windows
      const windowSize = 8;
      const windowGap = 12;
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
          const wx = x - bw / 4 + i * windowGap;
          const wy = y - bh / 4 + j * windowGap;
          ctx.fillStyle = "rgba(255,200,0,0.6)";
          ctx.fillRect(wx - windowSize / 2, wy - windowSize / 2, windowSize, windowSize);
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 1;
          ctx.strokeRect(wx - windowSize / 2, wy - windowSize / 2, windowSize, windowSize);
        }
      }

      // Location label on building
      ctx.fillStyle = loc.color;
      ctx.font = "bold 10px 'DM Sans', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(loc.name.split(" ")[0], x, y + bh / 2 + 12);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .location-card {
          animation: slideInUp 0.5s ease both;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .location-card:hover {
          transform: translateY(-4px);
        }
        .location-dot {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>

      <section
        style={{
          background: "#000",
          padding: "80px 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(34,197,94,0.05) 0%, transparent 70%)",
          }}
        />

        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 20px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <span
              style={{
                color: "#22c55e",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              COVERAGE MAP
            </span>
            <h2
              style={{
                color: "#fff",
                fontFamily: "'Syne', sans-serif",
                fontWeight: 900,
                fontSize: "clamp(28px, 5vw, 48px)",
                letterSpacing: -1.5,
                marginTop: 12,
                marginBottom: 16,
              }}
            >
              Where We Deliver
            </h2>
            <p
              style={{
                color: "#6b7280",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 16,
                lineHeight: 1.7,
                maxWidth: 500,
                margin: "0 auto",
              }}
            >
              We cover all major hostels and facilities across FUTO campus.
              Fast, reliable delivery to your doorstep.
            </p>
          </div>

          {/* Map and Locations Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 40,
              alignItems: "flex-start",
              marginBottom: 60,
            }}
          >
            {/* LEFT SIDE: Canvas Map */}
            <div
              style={{
                background: "linear-gradient(135deg, #0f2c1a 0%, #0a1f12 100%)",
                border: "2px solid rgba(34,197,94,0.3)",
                borderRadius: 24,
                overflow: "hidden",
                padding: 16,
                boxShadow: "0 0 40px rgba(34,197,94,0.1), inset 0 0 30px rgba(34,197,94,0.03)",
              }}
            >
              <canvas
                ref={canvasRef}
                width={400}
                height={400}
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  borderRadius: 12,
                }}
              />
            </div>

            {/* RIGHT SIDE: Featured Restaurants */}
            <div>
              <h3
                style={{
                  color: "#fff",
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 900,
                  fontSize: 24,
                  marginBottom: 24,
                  letterSpacing: -0.5,
                }}
              >
                Featured Partners
              </h3>

              <div
                style={{
                  maxHeight: "500px",
                  overflowY: "auto",
                  paddingRight: 12,
                }}
              >
                <style>{`
                  div::-webkit-scrollbar {
                    width: 8px;
                  }
                  div::-webkit-scrollbar-track {
                    background: rgba(255,255,255,0.05);
                    borderRadius: 10px;
                  }
                  div::-webkit-scrollbar-thumb {
                    background: rgba(34,197,94,0.4);
                    borderRadius: 10px;
                  }
                  div::-webkit-scrollbar-thumb:hover {
                    background: rgba(34,197,94,0.6);
                  }
                `}</style>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
                {[
                  {
                    name: "Pearl's Cuisine",
                    type: "Jumbo Orders & Bulk Delivery",
                    rating: "4.9",
                    icon: "👑",
                    featured: true,
                  },
                  {
                    name: "Mama Nkechi's Kitchen",
                    type: "Local Delicacies",
                    rating: "4.8",
                    icon: "🍲",
                  },
                  {
                    name: "Chukwu's Grill Spot",
                    type: "Grills & Suya",
                    rating: "4.6",
                    icon: "🔥",
                  },
                  {
                    name: "Campus Bites",
                    type: "Snacks & Fast Food",
                    rating: "4.5",
                    icon: "🥪",
                  },
                  {
                    name: "Owerri Rice Palace",
                    type: "Rice Dishes",
                    rating: "4.9",
                    icon: "🍚",
                  },
                  {
                    name: "Pepper Soup Corner",
                    type: "Soups & Stews",
                    rating: "4.8",
                    icon: "🍜",
                  },
                  {
                    name: "FreshJuice Hub",
                    type: "Drinks & Smoothies",
                    rating: "4.7",
                    icon: "🥤",
                  },
                  {
                    name: "Combo King",
                    type: "Combo Meals",
                    rating: "4.5",
                    icon: "🍱",
                  },
                  {
                    name: "Grilled Chicken Palace",
                    type: "Roasted & Grilled",
                    rating: "4.7",
                    icon: "🍗",
                  },
                  {
                    name: "Pasta Kitchen",
                    type: "Pasta & Italian",
                    rating: "4.4",
                    icon: "🍝",
                  },
                ].map((vendor, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: vendor.featured
                        ? "linear-gradient(135deg, rgba(234,179,8,0.1), rgba(202,138,4,0.05))"
                        : "rgba(255,255,255,0.02)",
                      border: vendor.featured
                        ? "1px solid rgba(234,179,8,0.3)"
                        : "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 16,
                      padding: 16,
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      animation: `slideInUp 0.5s ease ${idx * 60}ms both`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.borderColor = "rgba(34,197,94,0.4)";
                      e.currentTarget.style.boxShadow = "0 8px 24px rgba(34,197,94,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.borderColor = vendor.featured
                        ? "rgba(234,179,8,0.3)"
                        : "rgba(255,255,255,0.06)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <div
                        style={{
                          fontSize: 32,
                          flexShrink: 0,
                        }}
                      >
                        {vendor.icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 4,
                          }}
                        >
                          <h4
                            style={{
                              color: "#fff",
                              fontFamily: "'Syne', sans-serif",
                              fontWeight: 700,
                              fontSize: 15,
                              margin: 0,
                            }}
                          >
                            {vendor.name}
                          </h4>
                          {vendor.featured && (
                            <span
                              style={{
                                background: "linear-gradient(135deg, #eab308, #ca8a04)",
                                color: "#000",
                                fontSize: 9,
                                fontWeight: 800,
                                padding: "2px 8px",
                                borderRadius: 50,
                                fontFamily: "'DM Sans', sans-serif",
                                flexShrink: 0,
                              }}
                            >
                              👑 Featured
                            </span>
                          )}
                        </div>
                        <p
                          style={{
                            color: "#9ca3af",
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: 12,
                            margin: "4px 0 0 0",
                          }}
                        >
                          {vendor.type}
                        </p>
                        <div
                          style={{
                            color: "#22c55e",
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: 12,
                            fontWeight: 700,
                            marginTop: 6,
                          }}
                        >
                          ⭐ {vendor.rating} Rating
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              </div>
            </div>
          </div>

          {/* Coverage Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
            }}
          >
            {[
              {
                stat: "6",
                label: "Delivery Zones",
                icon: "📍",
              },
              {
                stat: "15–60",
                label: "Minutes Delivery",
                icon: "🕐",
              },
              {
                stat: "₦600",
                label: "Flat Delivery Fee",
                icon: "💵",
              },
              {
                stat: "4.8★",
                label: "Average Rating",
                icon: "⭐",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: "rgba(34,197,94,0.04)",
                  border: "1px solid rgba(34,197,94,0.15)",
                  borderRadius: 16,
                  padding: 24,
                  textAlign: "center",
                  animation: `slideInUp 0.5s ease ${idx * 80}ms both`,
                }}
              >
                <div
                  style={{
                    fontSize: 28,
                    marginBottom: 8,
                  }}
                >
                  {item.icon}
                </div>
                <div
                  style={{
                    color: "#22c55e",
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 900,
                    fontSize: 24,
                    marginBottom: 4,
                  }}
                >
                  {item.stat}
                </div>
                <div
                  style={{
                    color: "#6b7280",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                  }}
                >
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default CoverageMap;
