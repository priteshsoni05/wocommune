import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown, Filter, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const PINE = "#01796F";

type Service = {
  id: string;
  title: string;
  price_per_hour: number | null;
};

type Helpanion = {
  id: string;
  user_id: string;
  username?: string | null;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  status: string | null;
  services?: Service[];
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const getMinPrice = (services?: Service[]) => {
  if (!services || services.length === 0) return null;
  const nums = services
    .map((s) => (s.price_per_hour == null ? undefined : Number(s.price_per_hour)))
    .filter((n): n is number => Number.isFinite(n));
  if (nums.length === 0) return null;
  return Math.min(...nums);
};

const HelpanionsDirectory = () => {
  const [loading, setLoading] = useState(true);
  const [helpanions, setHelpanions] = useState<Helpanion[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "pending">("all");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select(
          `
          id,
          user_id,
          username,
          display_name,
          bio,
          avatar_url,
          status,
          services:services(
            id,
            title,
            price_per_hour
          )
        `
        )
        .eq("role", "helpanion");

      if (error) {
        console.error(error);
      } else {
        setHelpanions((data || []) as unknown as Helpanion[]);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const filtered = useMemo(() => {
    let list = helpanions;
    if (filter !== "all") {
      list = list.filter((h) => (h.status || "pending") === filter);
    }
    if (search.trim().length > 0) {
      const q = search.toLowerCase();
      list = list.filter(
        (h) =>
          (h.display_name || "").toLowerCase().includes(q) ||
          (h.bio || "").toLowerCase().includes(q) ||
          (h.username || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [helpanions, filter, search]);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#2B2B2B]">
      <header className="bg-white border-b">
        <div className="max-w-[1140px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <h1 className="font-semibold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Find a Helpanion
          </h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-8 w-56"
                placeholder="Search name, bio, username"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1">
                  <Filter className="h-4 w-4" />
                  {filter === "all" ? "All" : filter === "active" ? "Active" : "Pending"}
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilter("all")}>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("active")}>Active</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("pending")}>Pending</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="max-w-[1140px] mx-auto px-4 md:px-8 py-8">
        {loading ? (
          <p className="text-center text-muted-foreground">Loading...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No helpanions found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((h) => {
              const minPrice = getMinPrice(h.services);
              const profileHref = h.username?.trim()
                ? `/${encodeURIComponent(h.username.trim())}`
                : `/profile/${h.user_id}`;

              return (
                <Card key={h.id} className="border bg-white rounded-2xl hover:shadow-md transition">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-neutral-100 flex items-center justify-center">
                        {h.avatar_url ? (
                          <img src={h.avatar_url} alt={h.display_name || "Helpanion"} className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-semibold">{getInitials(h.display_name || "H")}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3
                          className="font-semibold text-lg truncate"
                          style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                          {h.display_name}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {h.bio || "Helping through shared experience."}
                        </p>
                        {minPrice && (
                          <p className="mt-1 text-sm">
                            From <span className="font-semibold">₹{minPrice}</span> / hr
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-5 flex gap-2">
                      <Button asChild variant="outline" className="flex-1 h-9 rounded-lg border-neutral-800">
                        <Link to={profileHref}>View Profile</Link>
                      </Button>
                      <Button asChild className="flex-1 h-9 rounded-lg text-white" style={{ backgroundColor: PINE }}>
                        <Link to={profileHref}>
                          Book Session <ArrowRight className="ml-1 h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs">
                        {h.status || "pending"}
                      </Badge>
                      {h.username && <Badge variant="secondary" className="text-xs">@{h.username}</Badge>}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <section className="bg-[#F3F2EE] py-10">
        <div className="max-w-[1140px] mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-xl font-serif" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Walk with us
            </h4>
            <p className="text-sm text-gray-700">Stories, guidance, and events — straight to your inbox.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <a
              href="https://wocommune.substack.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-5 py-2 rounded-md font-semibold"
              style={{ backgroundColor: PINE, color: "#fff" }}
            >
              Subscribe on Substack
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HelpanionsDirectory;
