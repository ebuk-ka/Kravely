import { useEffect, useRef, useState } from "react";

// Real FUTO campus delivery locations with approximate coordinates
const DELIVERY_ZONES = [
  { id: 1, name: "Umuchima",       lat: 5.3892, lng: 7.0012, type: "hostel",  desc: "Main hostel area"         },
  { id: 2, name: "Eziobodo",       lat: 5.3810, lng: 6.9950, type: "area",    desc: "Off-campus community"     },
  { id: 3, name: "Ihiagwa",        lat: 5.3960, lng: 7.0080, type: "area",    desc: "Off-campus community"     },
  { id: 4, name: "Obinze",         lat: 5.4020, lng: 7.0150, type: "area",    desc: "Nearby community"         },
  { id: 5, name: "Backgate",       lat: 5.3855, lng: 7.0040, type: "gate",    desc: "Back gate area"           },
  { id: 6, name: "Main Gate",      lat: 5.3920, lng: 7.0020, type: "gate",    desc: "Main entrance"            },
  { id: 7, name: "Engineering",    lat: 5.3900, lng: 7.0055, type: "faculty", desc: "Faculty of Engineering"   },
  { id: 8, name: "Hostels A & B",  lat: 5.3878, lng: 7.0030, type: "hostel",  desc: "Student hostels"          },
  { id: 9, name: "Hostels C & D",  lat: 5.3865, lng: 7.0045, type: "hostel",  desc: "Student hostels"          },
  { id: 10, name: "ICT Building",  lat: 5.3910, lng: 7.0065, type: "faculty", desc: "ICT & SEET faculty"       },
];

const VENDORS = [
  { id: 1, name: "Pearl's Cuisine",       tag: "Jumbo Orders · Bulk",    emoji: "👑", rating: 4.9, time: "3-4hrs min", featured: true,  open: true  },
  { id: 2, name: "Chrissy Cuisine",      tag: "Local Delicacies",       emoji: "👑", rating: 4.8, time: "15–25 min", featured: false, open: true  },
  { id: 3, name: "Chukwu's Grill Spot",  tag: "Grills & Suya",          emoji: "🔥", rating: 4.6, time: "20–30 min", featured: false, open: true  },
  { id: 4, name: "Campus Bites",          tag: "Snacks & Fast Food",     emoji: "🥪", rating: 4.5, time: "10–15 min", featured: false, open: true  },
  { id: 5, name: "Owerri Rice Palace",    tag: "Rice Dishes",            emoji: "🍚", rating: 4.9, time: "25–35 min", featured: false, open: true  },
  { id: 6, name: "FreshJuice Hub",        tag: "Drinks & Smoothies",     emoji: "🥤", rating: 4.7, time: "5–10 min",  featured: false, open: false },
  { id: 7, name: "Pepper Soup Corner",    tag: "Soups & Stews",          emoji: "🍜", rating: 4.8, time: "20–30 min", featured: false, open: true  },
  { id: 8, name: "Combo King",            tag: "Combo Meals",            emoji: "🍱", rating: 4.5, time: "20–30 min", featured: false, open: true  },
];

const ZONE_COLORS = {
  hostel:  "#22c55e",
  area:    "#60a5fa",
  gate:    "#f97316",
  faculty: "#a78bfa",
};

function CoverageMap() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [activeZone, setActiveZone] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Load Leaflet CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => {
      if (!mapRef.current || mapInstanceRef.current) return;

      const L = window.L;

      // Init map centered on FUTO
      const map = L.map(mapRef.current, {
        center: [5.3900, 7.0050],
        zoom: 15,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      mapInstanceRef.current = map;

      // Dark styled tile layer using CartoDB Dark Matter
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 19,
        }
      ).addTo(map);

      // Draw delivery coverage circle
      L.circle([5.3900, 7.0050], {
        radius: 1800,
        color: "#22c55e",
        fillColor: "#22c55e",
        fillOpacity: 0.06,
        weight: 1.5,
        dashArray: "6 4",
      }).addTo(map);

      // Add markers for each delivery zone
      DELIVERY_ZONES.forEach((zone) => {
        const color = ZONE_COLORS[zone.type];

        // Custom HTML marker
        const markerHtml = `
          <div style="
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
          ">
            <div style="
              width: 32px; height: 32px;
              border-radius: 50% 50% 50% 0;
              background: ${color};
              border: 2.5px solid #000;
              transform: rotate(-45deg);
              box-shadow: 0 4px 12px ${color}60;
              display: flex; align-items: center; justify-content: center;
            ">
              <div style="
                width: 10px; height: 10px;
                background: #000;
                border-radius: 50%;
                transform: rotate(45deg);
              "></div>
            </div>
            <div style="
              background: rgba(0,0,0,0.85);
              color: #fff;
              font-size: 10px;
              font-weight: 700;
              font-family: 'DM Sans', sans-serif;
              padding: 3px 8px;
              border-radius: 4px;
              white-space: nowrap;
              margin-top: 4px;
              border: 1px solid ${color}50;
            ">${zone.name}</div>
          </div>
        `;

        const icon = L.divIcon({
          html: markerHtml,
          className: "",
          iconSize: [80, 60],
          iconAnchor: [40, 44],
        });

        const marker = L.marker([zone.lat, zone.lng], { icon })
          .addTo(map)
          .bindPopup(
            `<div style="font-family:'DM Sans',sans-serif; padding:4px 0; min-width:140px;">
              <p style="font-weight:700; font-size:14px; color:#fff; margin:0 0 4px;">${zone.name}</p>
              <p style="font-size:12px; color:#9ca3af; margin:0 0 6px;">${zone.desc}</p>
              <span style="background:${color}20; color:${color}; font-size:10px; font-weight:700; padding:3px 8px; border-radius:50px; border:1px solid ${color}40;">${zone.type}</span>
            </div>`,
            {
              className: "kravely-popup",
              maxWidth: 200,
            }
          );

        marker.on("click", () => setActiveZone(zone.id));
      });

      // Custom popup styles
      const style = document.createElement("style");
      style.textContent = `
        .kravely-popup .leaflet-popup-content-wrapper {
          background: #111;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          color: #fff;
          box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        }
        .kravely-popup .leaflet-popup-tip {
          background: #111;
        }
        .kravely-popup .leaflet-popup-close-button {
          color: #6b7280 !important;
        }
        .leaflet-control-zoom {
          border: 1px solid rgba(255,255,255,0.1) !important;
          border-radius: 8px !important;
          overflow: hidden;
        }
        .leaflet-control-zoom a {
          background: #111 !important;
          color: #fff !important;
          border-bottom: 1px solid rgba(255,255,255,0.08) !important;
        }
        .leaflet-control-zoom a:hover {
          background: #222 !important;
        }
        .leaflet-control-attribution {
          background: rgba(0,0,0,0.6) !important;
          color: #6b7280 !important;
          font-size: 9px !important;
        }
        .leaflet-control-attribution a { color: #6b7280 !important; }
      `;
      document.head.appendChild(style);

      setMapLoaded(true);
    };

    document.head.appendChild(script);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .map-section { animation: fadeInUp 0.6s ease both; }
        .vendor-card-row { transition: all 0.2s ease; }
        .vendor-card-row:hover { background: rgba(255,255,255,0.04) !important; transform: translateX(4px); }
        .zone-pill { transition: all 0.2s ease; cursor: pointer; }
        .zone-pill:hover { opacity: 0.85; transform: scale(1.04); }
      `}</style>

      <section style={{
        background: "#000", padding: "100px 0",
        position: "relative", overflow: "hidden",
      }}>
        {/* Background glow */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse at 30% 50%, rgba(34,197,94,0.04) 0%, transparent 60%)" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>

          {/* Header */}
          <div style={{ marginBottom: 48, maxWidth: 600 }}>
            <span style={{ color: "#22c55e", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>
              Delivery Coverage
            </span>
            <h2 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: "clamp(28px, 5vw, 48px)", letterSpacing: -1.5, marginTop: 12, marginBottom: 12 }}>
              We deliver across FUTO 📍
            </h2>
            <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 16, lineHeight: 1.7 }}>
              From hostels to faculty buildings — Kravely covers every corner of FUTO campus and surrounding communities.
            </p>
          </div>

          {/* Main two-column layout */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: 24,
            alignItems: "start",
          }}
            className="map-grid"
          >

            {/* ===== LEFT — MAP ===== */}
            <div>
              <div style={{
                borderRadius: 20, overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.08)",
                height: 520,
                position: "relative",
              }}>
                {/* Loading state */}
                {!mapLoaded && (
                  <div style={{
                    position: "absolute", inset: 0, zIndex: 10,
                    background: "#0a0a0a",
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", gap: 12,
                  }}>
                    <div style={{ fontSize: 32 }}>🗺️</div>
                    <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>Loading map...</p>
                  </div>
                )}

                {/* Map container */}
                <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

                {/* Map legend */}
                <div style={{
                  position: "absolute", bottom: 16, left: 16, zIndex: 1000,
                  background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12, padding: "10px 14px",
                  display: "flex", flexDirection: "column", gap: 6,
                }}>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>Legend</p>
                  {Object.entries(ZONE_COLORS).map(([type, color]) => (
                    <div key={type} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
                      <span style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif", fontSize: 11, textTransform: "capitalize" }}>{type}</span>
                    </div>
                  ))}
                </div>

                {/* Kravely badge on map */}
                <div style={{
                  position: "absolute", top: 16, left: 16, zIndex: 1000,
                  background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)",
                  border: "1px solid rgba(34,197,94,0.3)",
                  borderRadius: 50, padding: "6px 14px",
                  display: "flex", alignItems: "center", gap: 7,
                }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", animation: "pulse 2s infinite" }} />
                  <span style={{ color: "#22c55e", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700 }}>FUTO Campus</span>
                </div>
              </div>

              {/* Zone chips below map */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
                {DELIVERY_ZONES.map(zone => (
                  <button
                    key={zone.id}
                    className="zone-pill"
                    onClick={() => setActiveZone(activeZone === zone.id ? null : zone.id)}
                    style={{
                      background: activeZone === zone.id ? `${ZONE_COLORS[zone.type]}20` : "rgba(255,255,255,0.04)",
                      border: `1px solid ${activeZone === zone.id ? ZONE_COLORS[zone.type] + "50" : "rgba(255,255,255,0.08)"}`,
                      color: activeZone === zone.id ? ZONE_COLORS[zone.type] : "#6b7280",
                      fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 12,
                      padding: "6px 14px", borderRadius: 50, cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 5,
                    }}
                  >
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: ZONE_COLORS[zone.type] }} />
                    {zone.name}
                  </button>
                ))}
              </div>
            </div>

            {/* ===== RIGHT — VENDOR LIST ===== */}
            <div style={{
              background: "#0a0a0a",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20, overflow: "hidden",
              display: "flex", flexDirection: "column",
              maxHeight: 520,
            }}>
              {/* Header */}
              <div style={{ padding: "18px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, margin: 0 }}>
                    Our Vendors
                  </h3>
                  <span style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", color: "#22c55e", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 50, fontFamily: "'DM Sans', sans-serif" }}>
                    {VENDORS.filter(v => v.open).length} open now
                  </span>
                </div>
                <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 12, marginTop: 4, marginBottom: 0 }}>
                  All vendors deliver across FUTO
                </p>
              </div>

              {/* Scrollable vendor list */}
              <div style={{
                overflowY: "auto", flex: 1,
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(34,197,94,0.2) transparent",
              }}>
                <style>{`
                  .vendor-scroll::-webkit-scrollbar { width: 4px; }
                  .vendor-scroll::-webkit-scrollbar-track { background: transparent; }
                  .vendor-scroll::-webkit-scrollbar-thumb { background: rgba(34,197,94,0.2); border-radius: 4px; }
                `}</style>
                <div className="vendor-scroll" style={{ padding: "8px 0" }}>
                  {VENDORS.map((vendor, i) => (
                    <div
                      key={vendor.id}
                      className="vendor-card-row"
                      style={{
                        padding: "14px 20px",
                        borderBottom: i < VENDORS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                        display: "flex", alignItems: "center", gap: 14,
                        background: "transparent",
                      }}
                    >
                      {/* Emoji */}
                      <div style={{
                        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                        background: vendor.featured ? "rgba(234,179,8,0.1)" : "rgba(34,197,94,0.08)",
                        border: `1px solid ${vendor.featured ? "rgba(234,179,8,0.2)" : "rgba(34,197,94,0.15)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 20,
                      }}>
                        {vendor.emoji}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                          <p style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {vendor.name}
                          </p>
                          {vendor.featured && (
                            <span style={{ fontSize: 9, background: "rgba(234,179,8,0.15)", color: "#eab308", padding: "1px 6px", borderRadius: 50, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, flexShrink: 0 }}>★</span>
                          )}
                        </div>
                        <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 11, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {vendor.tag}
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                          <span style={{ color: "#22c55e", fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700 }}>⭐ {vendor.rating}</span>
                          <span style={{ color: "#4b5563", fontFamily: "'DM Sans', sans-serif", fontSize: 10 }}>🕐 {vendor.time}</span>
                        </div>
                      </div>

                      {/* Status */}
                      <div style={{ flexShrink: 0, textAlign: "right" }}>
                        <span style={{
                          display: "block",
                          background: vendor.open ? "rgba(34,197,94,0.1)" : "rgba(107,114,128,0.1)",
                          border: `1px solid ${vendor.open ? "rgba(34,197,94,0.25)" : "rgba(107,114,128,0.2)"}`,
                          color: vendor.open ? "#22c55e" : "#6b7280",
                          fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
                          fontSize: 10, padding: "3px 8px", borderRadius: 50,
                        }}>
                          {vendor.open ? "Open" : "Closed"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div style={{ padding: "12px 20px", borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
                <p style={{ color: "#4b5563", fontFamily: "'DM Sans', sans-serif", fontSize: 11, textAlign: "center", margin: 0 }}>
                  More vendors joining Kravely soon 🚀
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Responsive style */}
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @media (max-width: 900px) {
          .map-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}

export default CoverageMap;
