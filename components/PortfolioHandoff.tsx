"use client";
import type { ReactNode } from "react";
/** Normal document flow keeps gallery and order reachable without a second scroll driver. */
export function PortfolioHandoff({children}:{children:ReactNode}){return <div className="portfolio-flow">{children}</div>;}
