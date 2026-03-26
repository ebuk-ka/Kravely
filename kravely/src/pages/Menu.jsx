import { useMemo, useState } from "react";
import pearlsLogo from "../assets/images/pearlslogo.jpeg";

const menuData = [
  {
    category: "RICE",
    items: [
      { name: "Asun Rice", prices: ["30,000", "45,000", "60,000"] },
      { name: "Nigerian Jollof", prices: ["30,000", "45,000", "50,000"] },
      { name: "Fried Rice", prices: ["30,000", "50,000", "60,000"] },
      { name: "Native Rice", prices: ["30,000", "45,000", "50,000"] },
      { name: "Coconut Rice", prices: ["46,000", "55,000", "65,000"] },
    ],
  },
  {
    category: "STEW",
    items: [
      { name: "Chicken", prices: ["40,500", "55,000", "60,000"] },
      { name: "Beef", prices: ["30,000", "40,000", "50,000"] },
      { name: "Turkey", prices: ["45,000", "55,500", "65,500"] },
      { name: "Goat Meat", prices: ["40,000", "47,000", "58,500"] },
      { name: "Fish Stew", prices: ["35,000", "40,500", "55,000"] },
    ],
  },
  {
    category: "PASTA",
    items: [
      { name: "Jollof Pasta", prices: ["25,000", "38,500", "46,500"] },
      { name: "Native Pasta", prices: ["30,000", "35,000", "46,500"] },
      { name: "Asun Pasta", prices: ["38,500", "45,500", "50,000"] },
      { name: "Special", prices: ["45,000", "50,000", "63,500"] },
    ],
  },
  {
    category: "PEPPER SOUP",
    items: [
      { name: "Chicken", prices: ["30,000", "50,000", "60,000"] },
      { name: "Turkey", prices: ["40,000", "65,500", "70,500"] },
      { name: "Goat Meat", prices: ["40,000", "50,000", "60,000"] },
      { name: "Catfish", prices: ["40,000", "50,000", "60,000"] },
      { name: "Assorted", prices: ["35,500", "45,500", "60,000"] },
    ],
  },
  {
    category: "SOUP",
    items: [
      { name: "Afang", prices: ["30,000", "40,000", "50,000"] },
      { name: "Ofe Owerri", prices: ["30,000", "40,000", "55,000"] },
      { name: "Egusi", prices: ["30,000", "40,000", "50,000"] },
      { name: "Okro", prices: ["20,000", "30,000", "40,000"] },
      { name: "Banga", prices: ["35,000", "45,000", "60,000"] },
      { name: "Fisherman Soup", prices: ["55,000", "80,000", "120,000"] },
      { name: "Vegetable/Edikalkong", prices: ["30,000", "40,000", "50,000"] },
      { name: "Oha", prices: ["30,000", "40,000", "50,000"] },
      { name: "Nsala", prices: ["45,000", "50,000", "55,000"] },
    ],
  },
];

const specialSection = {
  category: "SPECIAL MENU",
  items: [{ name: "Tapioca (with milk, sugar, coconut)", prices: ["3,000"] }],
};

const extrasSection = {
  category: "EXTRAS",
  items: [
    { name: "Plantain", prices: ["2,000"] },
    { name: "Coleslaw", prices: ["1,000"] },
  ],
};

const allMenuData = [
  ...menuData,
  specialSection,
  extrasSection,
];

const categoryOptions = ["ALL", ...menuData.map((section) => section.category), "SPECIAL MENU", "EXTRAS"];

export default function Menu() {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  const filteredSections = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return allMenuData
      .map((section) => {
        if (selectedCategory !== "ALL" && selectedCategory !== section.category) {
          return null;
        }

        const filteredItems = section.items
          .filter((item) => item.name.toLowerCase().includes(query))
          .sort((a, b) => 
            sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
          );

        if (filteredItems.length === 0) return null;

        return { ...section, items: filteredItems };
      })
      .filter(Boolean);
  }, [selectedCategory, searchQuery, sortAsc]);

  const hasResults = filteredSections.length > 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-900 via-slate-900 to-black text-white px-4 py-24 md:px-12">
      <section className="max-w-6xl mx-auto bg-black/50 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-xl p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
          <img
            src={pearlsLogo}
            alt="Pearl’s Cuisine logo"
            className="h-28 w-28 rounded-full object-cover border-2 border-green-400 shadow-lg"
          />
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-1">Pearl’s Cuisine</h1>
            <p className="text-sm text-green-300">FOOD MENU</p>
            <p className="mt-3 text-sm md:text-base text-gray-200 max-w-xl">
              Quality homemade flavors for rice, stew, pasta, pepper soup, and soup. Orders are prepared fresh (3-5hrs), with delivery cutoffs at 3pm within FUTA and Owerri.
            </p>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div>
            <label className="text-xs text-gray-300 block mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-lg border border-white/20 bg-black/60 px-3 py-2 text-sm"
            >
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-300 block mb-1">Search</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. Jollof, Chicken, Tapioca"
              className="w-full rounded-lg border border-white/20 bg-black/60 px-3 py-2 text-sm"
            />
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={() => setSortAsc((p) => !p)}
              className="w-full rounded-lg bg-green-500 px-4 py-2 text-sm font-bold text-black hover:bg-green-600"
            >
              Sort: {sortAsc ? "A ? Z" : "Z ? A"}
            </button>
          </div>
        </div>

        {hasResults ? (
          <div className="grid gap-8">
            {filteredSections.map((section) => (
              <article key={section.category} className="rounded-2xl bg-black/60 border border-white/5 p-5">
                <h2 className="text-2xl text-green-300 font-bold mb-4">{section.category}</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="py-2 pr-6">Item</th>
                        <th className="py-2 pr-6">2L</th>
                        <th className="py-2 pr-6">3L</th>
                        <th className="py-2">4L</th>
                      </tr>
                    </thead>
                    <tbody>
                      {section.items.map((item) => (
                        <tr key={item.name} className="border-b border-white/10 hover:bg-white/5 duration-150">
                          <td className="py-2 pr-6 font-medium">{item.name}</td>
                          <td className="py-2 pr-6">{item.prices[0] ? `?${item.prices[0]}` : "—"}</td>
                          <td className="py-2 pr-6">{item.prices[1] ? `?${item.prices[1]}` : "—"}</td>
                          <td className="py-2">{item.prices[2] ? `?${item.prices[2]}` : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-black/60 border border-white/5 p-6 text-center text-gray-200">No menu items matched your filter.</div>
        )}

        <article className="mt-8 rounded-2xl bg-black/60 border border-white/5 p-5">
          <h2 className="text-2xl text-green-300 font-bold mb-4">NOTES</h2>
          <p>All meals take 3–5 hrs to get ready. Orders within FUTA end by 3pm; orders within Owerri end by 3pm.</p>
          <p className="mt-3">To place an order:</p>
          <ul className="list-disc pl-5 text-gray-200">
            <li>TikTok: Pearl’s Cuisine</li>
            <li>WhatsApp: <strong>09068987178</strong></li>
          </ul>
        </article>
      </section>
    </main>
  );
}
