"use client";

import { useState } from "react";
import { IconButton } from "@/components/ui/IconButton";
import { HomeIcon, UserIcon, SearchIcon } from "@/components/ui/icons";
import { dispatchSearchTap } from "@/lib/palette-events";

type Tab = "home" | "about" | "search";

export function FloatingNav() {
  const [active, setActive] = useState<Tab>("home");

  return (
    <nav
      aria-label="Primary"
      className="fixed left-1/2 top-[25px] z-50 -translate-x-1/2"
    >
      <div className="flex items-center gap-0 rounded-full bg-[var(--nav-glass)] p-2 backdrop-blur-[25px]">
        <IconButton
          variant={active === "home" ? "navActive" : "nav"}
          aria-label="Home"
          aria-current={active === "home"}
          onClick={() => setActive("home")}
        >
          <HomeIcon size={18} />
        </IconButton>
        <IconButton
          variant={active === "about" ? "navActive" : "nav"}
          aria-label="About"
          aria-current={active === "about"}
          onClick={() => setActive("about")}
        >
          <UserIcon size={18} />
        </IconButton>
        <IconButton
          variant={active === "search" ? "navActive" : "nav"}
          aria-label="Search"
          aria-current={active === "search"}
          silent
          onClick={() => {
            setActive("search");
            dispatchSearchTap();
          }}
        >
          <SearchIcon size={18} />
        </IconButton>
      </div>
    </nav>
  );
}
