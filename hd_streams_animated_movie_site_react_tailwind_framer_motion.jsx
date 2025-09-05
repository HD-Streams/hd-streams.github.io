import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Star, Search, Filter, Sparkles, Film, Calendar, X, ChevronRight, Heart, Clock, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// HD Streams — ultra-animated movie UI
// Tech: React + Tailwind + Framer Motion (+ shadcn/ui)
// Notes: purely a front-end demo with placeholder data.
// Logo provided by user: https://avatars.githubusercontent.com/u/220392450?v=4

const LOGO = "https://avatars.githubusercontent.com/u/220392450?v=4";

const GENRES = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Drama",
  "Fantasy",
  "Horror",
  "Romance",
  "Sci-Fi",
  "Thriller",
];

const gradientPool = [
  "from-indigo-500 via-purple-500 to-pink-500",
  "from-sky-500 via-cyan-500 to-emerald-500",
  "from-rose-500 via-orange-500 to-yellow-500",
  "from-fuchsia-500 via-violet-500 to-indigo-500",
  "from-amber-500 via-lime-500 to-emerald-500",
  "from-blue-600 via-teal-500 to-emerald-500",
  "from-red-500 via-pink-500 to-purple-500",
  "from-emerald-500 via-teal-500 to-cyan-500",
];

const sampleMovies = Array.from({ length: 18 }).map((_, i) => {
  const year = 2005 + (i % 19);
  const rating = (Math.random() * 4 + 6).toFixed(1);
  const genre = GENRES[(i * 3) % GENRES.length];
  return {
    id: i + 1,
    title: `Sample Movie ${i + 1}`,
    year,
    rating: Number(rating),
    duration: 90 + (i % 60),
    genre,
    description:
      "A high‑energy, visually stunning journey through worlds of adventure. This is placeholder copy to demo the UI.",
    gradient: gradientPool[i % gradientPool.length],
  };
});

function useDebounce(value, delay = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function TitleGlow({ children, className = "" }) {
  return (
    <div className={`relative inline-block ${className}`}>
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500/60 via-fuchsia-500/60 to-emerald-500/60 blur-xl opacity-40" />
      <h1 className="relative font-extrabold tracking-tight text-4xl sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/60">
        {children}
      </h1>
    </div>
  );
}

const floatVariants = {
  initial: { y: 0 },
  animate: {
    y: [0, -6, 0],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
};

function Poster({ title, gradient }) {
  return (
    <div className={`aspect-[2/3] w-full rounded-xl overflow-hidden relative bg-gradient-to-br ${gradient}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.2),transparent_45%)]" />
      <div className="absolute bottom-0 w-full p-3 bg-gradient-to-t from-black/70 to-transparent">
        <p className="text-white/90 font-semibold drop-shadow-sm line-clamp-2">{title}</p>
      </div>
    </div>
  );
}

function MovieCard({ movie, onOpen }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
      className="group relative"
      onClick={() => onOpen(movie)}
    >
      <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-fuchsia-500 via-indigo-500 to-emerald-500 opacity-0 group-hover:opacity-100 blur-md transition-opacity" />
      <Card className="relative rounded-2xl overflow-hidden bg-neutral-900 border-neutral-800">
        <CardContent className="p-0">
          <Poster title={movie.title} gradient={movie.gradient} />
          <div className="p-3 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Badge className="bg-neutral-800 text-neutral-200 border border-neutral-700">{movie.genre}</Badge>
                <div className="flex items-center gap-1 text-amber-400"><Star className="w-4 h-4 fill-current" /><span className="text-sm font-semibold">{movie.rating}</span></div>
              </div>
              <p className="text-neutral-300 mt-1 text-sm">{movie.year} • {movie.duration}m</p>
            </div>
            <Button className="rounded-xl" size="icon" variant="secondary">
              <Play className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function FilterPill({ icon: Icon, children, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm transition-all ${
        active
          ? "bg-white text-black border-white"
          : "bg-neutral-900/60 text-neutral-200 border-neutral-700 hover:border-neutral-500"
      }`}
    >
      <Icon className="w-4 h-4" /> {children}
    </button>
  );
}

export default function HDStreams() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("All");
  const [minRating, setMinRating] = useState(0);
  const [yearFrom, setYearFrom] = useState(2005);
  const [selected, setSelected] = useState(null);
  const [love, setLove] = useState({});

  const debouncedQuery = useDebounce(query, 250);

  const filtered = useMemo(() => {
    return sampleMovies.filter((m) => {
      const matchesQuery = m.title.toLowerCase().includes(debouncedQuery.toLowerCase());
      const matchesGenre = genre === "All" || m.genre === genre;
      const matchesRating = m.rating >= minRating;
      const matchesYear = m.year >= yearFrom;
      return matchesQuery && matchesGenre && matchesRating && matchesYear;
    });
  }, [debouncedQuery, genre, minRating, yearFrom]);

  const heroWords = ["Movies", "Series", "Animation", "Thrillers", "Classics", "New Releases"];

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-fuchsia-500/30">
      {/* Glow backdrops */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-24 -left-24 w-[36rem] h-[36rem] bg-fuchsia-600/20 blur-[120px] rounded-full" />
        <div className="absolute top-40 -right-16 w-[30rem] h-[30rem] bg-indigo-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-1/3 w-[40rem] h-[40rem] bg-emerald-600/20 blur-[140px] rounded-full" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/40 border-b border-neutral-800">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
          <motion.img
            variants={floatVariants}
            initial="initial"
            animate="animate"
            src={LOGO}
            alt="HD Streams logo"
            className="w-9 h-9 rounded-xl ring-1 ring-white/15"
          />
          <div className="flex items-center gap-2">
            <span className="font-black tracking-tight text-xl">HD</span>
            <span className="text-white/60">Streams</span>
            <Badge className="ml-2 bg-gradient-to-r from-fuchsia-600 to-indigo-600 border-0">BETA</Badge>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <FilterPill icon={Sparkles}>Trending</FilterPill>
            <FilterPill icon={Flame}>Hot Now</FilterPill>
            <FilterPill icon={Film}>All</FilterPill>
            <Button className="rounded-xl">Sign In</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative">
        <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
            <div className="flex-1">
              <TitleGlow>HD Streams</TitleGlow>
              <p className="mt-4 text-neutral-300 max-w-2xl">
                A super‑smooth, animation‑packed demo UI for movies & series. Type to search, filter by genre, rating, and year. Click a card to view details.
              </p>

              <div className="mt-6 flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search titles, people, or collections..."
                    className="pl-10 pr-4 py-6 rounded-2xl bg-neutral-900 border-neutral-800 text-neutral-100 placeholder:text-neutral-500"
                  />
                </div>
                <Button className="rounded-2xl px-5">
                  <Filter className="w-5 h-5 mr-2" /> Filters
                </Button>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-neutral-400">
                <span className="opacity-80">Try:</span>
                {heroWords.map((w, i) => (
                  <motion.span
                    key={w}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="px-2 py-1 rounded-lg bg-white/5 border border-white/10"
                  >
                    {w}
                  </motion.span>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 16 }}
              className="grid grid-cols-3 gap-3 w-full max-w-sm"
            >
              {sampleMovies.slice(0, 6).map((m) => (
                <motion.div key={m.id} whileHover={{ scale: 1.04 }}>
                  <Poster title={m.title} gradient={m.gradient} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Animated divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </header>

      {/* Controls */}
      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Badge className="bg-neutral-900 border-neutral-800 text-neutral-300">Genre</Badge>
            <div className="flex gap-1 flex-wrap">
              {(["All", ...GENRES]).map((g) => (
                <FilterPill key={g} icon={Film} active={genre === g} onClick={() => setGenre(g)}>
                  {g}
                </FilterPill>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Badge className="bg-neutral-900 border-neutral-800 text-neutral-300">Min Rating</Badge>
            <input
              type="range"
              min={0}
              max={10}
              step={0.5}
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="accent-fuchsia-500 w-40"
            />
            <span className="tabular-nums text-neutral-300">{minRating.toFixed(1)}</span>

            <Badge className="bg-neutral-900 border-neutral-800 text-neutral-300 ml-4">Year From</Badge>
            <input
              type="range"
              min={2005}
              max={2024}
              step={1}
              value={yearFrom}
              onChange={(e) => setYearFrom(Number(e.target.value))}
              className="accent-indigo-500 w-48"
            />
            <span className="tabular-nums text-neutral-300">{yearFrom}</span>
          </div>
        </div>
      </section>

      {/* Carousel */}
      <section className="mx-auto max-w-7xl px-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-xl flex items-center gap-2"><Sparkles className="w-5 h-5" /> Trending Now</h2>
          <button className="text-sm text-neutral-400 hover:text-white inline-flex items-center">See all <ChevronRight className="w-4 h-4" /></button>
        </div>
        <motion.div className="flex gap-4 overflow-x-auto pb-2" drag="x" dragConstraints={{ left: -600, right: 0 }}>
          {sampleMovies.slice(0, 10).map((m) => (
            <motion.div key={m.id} whileHover={{ y: -4 }} className="min-w-[180px] w-[180px]" onClick={() => setSelected(m)}>
              <Poster title={m.title} gradient={m.gradient} />
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-neutral-300 line-clamp-1">{m.title}</span>
                <span className="text-amber-400 inline-flex items-center gap-1"><Star className="w-3 h-3" /> {m.rating}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Grid */}
      <main className="mx-auto max-w-7xl px-4 pb-16">
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          <AnimatePresence>
            {filtered.map((m) => (
              <MovieCard key={m.id} movie={m} onOpen={setSelected} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center text-neutral-400 py-16">No matches. Try different filters.</div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800/80">
        <div className="mx-auto max-w-7xl px-4 py-10 grid md:grid-cols-3 gap-8 text-sm text-neutral-400">
          <div>
            <div className="flex items-center gap-3">
              <img src={LOGO} alt="logo" className="w-8 h-8 rounded-lg ring-1 ring-white/10" />
              <span className="font-semibold text-white">HD Streams</span>
            </div>
            <p className="mt-3 max-w-sm">Demo UI only. No streaming content is hosted here. Replace the placeholder data with your catalog or API.</p>
          </div>
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-white mb-2">Discover</p>
              <ul className="space-y-1 opacity-80">
                <li>Trending</li>
                <li>New Releases</li>
                <li>Top Rated</li>
                <li>Collections</li>
              </ul>
            </div>
            <div>
              <p className="text-white mb-2">Genres</p>
              <ul className="space-y-1 opacity-80">
                {GENRES.slice(0,6).map((g) => <li key={g}>{g}</li>)}
              </ul>
            </div>
            <div>
              <p className="text-white mb-2">Company</p>
              <ul className="space-y-1 opacity-80">
                <li>About</li>
                <li>Careers</li>
                <li>Contact</li>
                <li>Terms</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end md:items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
              className="relative w-full max-w-3xl rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 z-10 inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid md:grid-cols-2">
                <div className="relative">
                  <Poster title={selected.title} gradient={selected.gradient} />
                  <div className="absolute bottom-3 left-3 flex gap-2">
                    <Badge className="bg-neutral-900 border-neutral-800 text-neutral-200">{selected.genre}</Badge>
                    <Badge className="bg-neutral-900 border-neutral-800 text-neutral-200 inline-flex items-center gap-1"><Star className="w-3 h-3" /> {selected.rating}</Badge>
                    <Badge className="bg-neutral-900 border-neutral-800 text-neutral-200 inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {selected.duration}m</Badge>
                  </div>
                </div>
                <div className="p-5 flex flex-col">
                  <h3 className="text-2xl font-bold">{selected.title}</h3>
                  <p className="text-neutral-400 mt-1">{selected.year} • {selected.genre}</p>
                  <p className="mt-4 text-neutral-300 leading-relaxed">{selected.description}</p>

                  <div className="mt-5 flex items-center gap-3">
                    <Button className="rounded-xl px-5" onClick={() => alert("Demo only ✨ Replace with your player.")}> 
                      <Play className="w-5 h-5 mr-2" /> Play Trailer
                    </Button>
                    <button
                      onClick={() => setLove((s) => ({ ...s, [selected.id]: !s[selected.id] }))}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border transition ${
                        love[selected.id]
                          ? "bg-pink-500 text-white border-pink-500"
                          : "bg-neutral-900 text-white border-neutral-800 hover:border-neutral-600"
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${love[selected.id] ? "fill-current" : ""}`} />
                      {love[selected.id] ? "Saved" : "Watchlist"}
                    </button>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3">
                        <p className="text-white/80 font-medium">Cast #{i + 1}</p>
                        <p className="text-neutral-400">Role</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
