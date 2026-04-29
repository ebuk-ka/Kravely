import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ArrowLeft, Trash2 } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function Favourites() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  let mounted = true;

  const loadFavourites = async () => {
    setLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!mounted) return;

    if (!session?.user) {
      setUser(null);
      setFavourites([]);
      setLoading(false);
      navigate("/login");
      return;
    }

    setUser(session.user);

    const { data, error } = await supabase
      .from("favourites")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (!mounted) return;

    if (error) {
      console.log("Favourite load error:", error.message);
      setFavourites([]);
    } else {
      setFavourites(data || []);
    }

    setLoading(false);
  };

  loadFavourites();

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    if (!mounted) return;

    if (session?.user) {
      loadFavourites();
    } else {
      setUser(null);
      setFavourites([]);
      setLoading(false);
      navigate("/login");
    }
  });

  return () => {
    mounted = false;
    subscription.unsubscribe();
  };
}, [navigate]);

  const removeFavourite = async (id) => {
  const { error } = await supabase
    .from("favourites")
    .delete()
    .eq("id", id);

  if (error) {
    console.log("Remove favourite error:", error.message);
    return;
  }

  setFavourites((prev) => prev.filter((item) => item.id !== id));
};
  return (
    <div className="fav-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@400;500;600;700;800&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          background: #070707;
        }

        .fav-page {
          min-height: 100vh;
          background: #070707;
          color: white;
          font-family: "DM Sans", sans-serif;
          padding: 28px 18px 80px;
        }

        .fav-wrap {
          max-width: 1200px;
          margin: 0 auto;
        }

        .fav-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 32px;
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #d4d4d8;
          text-decoration: none;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.08);
          padding: 12px 16px;
          border-radius: 999px;
          font-weight: 700;
        }

        .fav-title {
          font-family: "Syne", sans-serif;
          font-size: clamp(34px, 5vw, 58px);
          font-weight: 800;
          letter-spacing: -2px;
          margin-bottom: 8px;
        }

        .fav-sub {
          color: #9ca3af;
          font-size: 15px;
        }

        .fav-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
          margin-top: 28px;
        }

        .fav-card {
          background: #0f0f10;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 24px;
          overflow: hidden;
        }

        .fav-img {
          width: 100%;
          height: 190px;
          object-fit: cover;
          display: block;
        }

        .fav-body {
          padding: 16px;
        }

        .fav-name {
          font-family: "Syne", sans-serif;
          font-size: 18px;
          font-weight: 800;
          margin-bottom: 6px;
        }

        .fav-vendor {
          color: #9ca3af;
          font-size: 13px;
          margin-bottom: 12px;
        }

        .fav-price {
          color: #22c55e;
          font-family: "Syne", sans-serif;
          font-size: 22px;
          font-weight: 800;
          margin-bottom: 14px;
        }

        .remove-btn {
          width: 100%;
          border: none;
          background: rgba(239,68,68,.12);
          color: #ef4444;
          padding: 12px;
          border-radius: 14px;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
        }

        .empty {
          margin-top: 80px;
          text-align: center;
          background: #0f0f10;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 28px;
          padding: 60px 20px;
        }

        .empty-icon {
          width: 64px;
          height: 64px;
          border-radius: 20px;
          background: rgba(34,197,94,.12);
          display: grid;
          place-items: center;
          margin: 0 auto 18px;
        }

        .empty h2 {
          font-family: "Syne", sans-serif;
          font-size: 28px;
          margin-bottom: 8px;
        }

        .empty p {
          color: #9ca3af;
          margin-bottom: 22px;
        }

        .shop-btn {
          display: inline-flex;
          text-decoration: none;
          background: #22c55e;
          color: #000;
          padding: 14px 22px;
          border-radius: 999px;
          font-weight: 900;
        }

        @media (max-width: 1000px) {
          .fav-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 760px) {
          .fav-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 520px) {
          .fav-grid {
            grid-template-columns: 1fr;
          }

          .fav-top {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>
      

      <div className="fav-wrap">
        <div className="fav-top">
          <div>
            <h1 className="fav-title">Your Favourites</h1>
            <p className="fav-sub">Meals you saved will appear here.</p>
          </div>

          <Link to="/order" className="back-btn">
            <ArrowLeft size={17} />
            Back to Order
          </Link>
        </div>

        {loading ? (
          <p style={{ color: "#9ca3af" }}>Loading favourites...</p>
        ) : favourites.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">
              <Heart size={28} color="#22c55e" />
            </div>
            <h2>No favourites yet</h2>
            <p>Tap the heart on meals you like and they’ll show here.</p>
            <Link to="/order" className="shop-btn">Browse meals</Link>
          </div>
        ) : (
          <div className="fav-grid">
            {favourites.map((item) => (
              <div className="fav-card" key={item.id}>
                <img
                  src={item.image_url}
                  alt={item.item_name}
                  className="fav-img"
                />

                <div className="fav-body">
                  <h3 className="fav-name">{item.item_name}</h3>
                  <p className="fav-vendor">{item.vendor_name}</p>

                  {item.price_naira && (
                    <p className="fav-price">
                      ₦{Number(item.price_naira).toLocaleString()}
                    </p>
                  )}

                  <button
                    className="remove-btn"
                    onClick={() => removeFavourite(item.id)}
                  >
                    <Trash2 size={16} />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}