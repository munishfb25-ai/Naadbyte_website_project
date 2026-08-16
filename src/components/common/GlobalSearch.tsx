import { useState, useRef, useEffect } from "react";
import { Search, X, Music, Video, Disc, Hash, Globe, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { globalSearchData, SearchItem, SearchResultType } from "@/data/searchData";

const iconMap: Record<SearchResultType, React.ReactNode> = {
  song: <Music className="size-4" />,
  video: <Video className="size-4" />,
  release: <Disc className="size-4" />,
  genre: <Hash className="size-4" />,
  language: <Globe className="size-4" />,
};

const labelMap: Record<SearchResultType, string> = {
  song: "SONGS",
  video: "VIDEOS",
  release: "RELEASES",
  genre: "GENRES",
  language: "LANGUAGES",
};

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Search logic
  const filteredResults = query.trim()
    ? globalSearchData
        .filter(
          (item) =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.subtitle?.toLowerCase().includes(query.toLowerCase()),
        )
        .slice(0, 8)
    : [];

  const groupedResults = filteredResults.reduce(
    (acc, item) => {
      if (!acc[item.type]) acc[item.type] = [];
      acc[item.type].push(item);
      return acc;
    },
    {} as Record<SearchResultType, SearchItem[]>,
  );

  const flatList = Object.values(groupedResults).flat();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setActiveIndex(-1); // Reset keyboard focus when query changes
  }, [query]);

  useEffect(() => {
    if (isMobileOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isMobileOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" && query.trim()) {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < flatList.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : flatList.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < flatList.length) {
        handleSelect(flatList[activeIndex] as SearchItem);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      setIsMobileOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleSelect = (item: SearchItem) => {
    setIsOpen(false);
    setIsMobileOpen(false);
    setQuery("");
    inputRef.current?.blur();

    // Example: Navigate using TanStack Router
    // This could be enhanced to dispatch to your audio player if it's a song
    navigate({ to: item.url, replace: false });
  };

  return (
    <div ref={containerRef} className="relative z-50 flex items-center">
      {/* Mobile Icon Toggle */}
      <button
        type="button"
        onClick={() => setIsMobileOpen((prev) => !prev)}
        className="md:hidden p-2 text-foreground transition-colors hover:text-gold"
        aria-label="Toggle search"
      >
        <Search className="size-5" />
      </button>

      {/* Search Input Container */}
      <div
        className={`absolute right-0 top-1/2 -translate-y-1/2 md:relative md:top-auto md:translate-y-0 transition-all duration-300 ${
          isMobileOpen
            ? "w-[calc(100vw-32px)] md:w-auto opacity-100 visible"
            : "w-0 md:w-auto opacity-0 invisible md:opacity-100 md:visible"
        }`}
      >
        <div
          className={`relative flex items-center w-full md:w-[280px] lg:w-[320px] rounded-full border bg-black/40 backdrop-blur-md transition-colors ${
            isOpen
              ? "border-gold/50 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
              : "border-white/10 hover:border-white/30"
          }`}
        >
          <div className="pl-3 pr-2 py-2 flex items-center pointer-events-none text-muted-foreground">
            <Search className="size-4" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => {
              if (query.trim()) setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search songs, videos, albums..."
            className="w-full bg-transparent border-none py-2 text-sm text-white placeholder-muted-foreground focus:outline-none focus:ring-0 rounded-full"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setIsOpen(false);
                inputRef.current?.focus();
              }}
              className="px-3 py-2 text-muted-foreground hover:text-white transition-colors"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* Dropdown Results */}
      <AnimatePresence>
        {isOpen && query.trim() && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[calc(100%+12px)] right-0 w-[calc(100vw-32px)] md:w-[400px] rounded-2xl border border-white/10 bg-black/80 backdrop-blur-2xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh] origin-top-right"
          >
            {flatList.length > 0 ? (
              <div className="overflow-y-auto p-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-track]:bg-transparent">
                {Object.entries(groupedResults).map(([type, items]) => {
                  if (!items.length) return null;
                  return (
                    <div key={type} className="mb-4 last:mb-1">
                      <div className="px-3 py-2 text-xs font-semibold uppercase tracking-widest text-gold/80">
                        {labelMap[type as SearchResultType]}
                      </div>
                      <ul className="flex flex-col gap-1">
                        {items.map((item) => {
                          const index = flatList.findIndex((i) => i.id === item.id);
                          const isActive = index === activeIndex;
                          return (
                            <li key={item.id}>
                              <button
                                onClick={() => handleSelect(item)}
                                onMouseEnter={() => setActiveIndex(index)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left ${
                                  isActive
                                    ? "bg-white/10 shadow-[inset_0_0_20px_rgba(212,175,55,0.05)]"
                                    : "hover:bg-white/5"
                                }`}
                              >
                                {item.thumbnail ? (
                                  <div className="relative shrink-0 size-10 rounded-md overflow-hidden bg-white/5 border border-white/10">
                                    <img
                                      src={item.thumbnail}
                                      alt={item.title}
                                      className="size-full object-cover"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity">
                                      {iconMap[item.type]}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="shrink-0 size-10 rounded-md flex items-center justify-center bg-white/5 text-muted-foreground border border-white/10">
                                    {iconMap[item.type]}
                                  </div>
                                )}
                                <div className="flex flex-col flex-1 min-w-0">
                                  <span
                                    className={`text-sm font-medium truncate ${isActive ? "text-gold" : "text-white"}`}
                                  >
                                    {item.title}
                                  </span>
                                  {item.subtitle && (
                                    <span className="text-xs text-muted-foreground truncate">
                                      {item.subtitle}
                                    </span>
                                  )}
                                </div>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
                <div className="pt-2 mt-2 border-t border-white/10">
                  <button className="w-full py-2.5 flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground hover:text-white transition-colors group">
                    View all results
                    <ArrowRight className="size-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
                <div className="size-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  <Search className="size-5 text-muted-foreground" />
                </div>
                <h3 className="text-white font-medium text-sm mb-1">No results found.</h3>
                <p className="text-xs text-muted-foreground">Try another title or genre.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
