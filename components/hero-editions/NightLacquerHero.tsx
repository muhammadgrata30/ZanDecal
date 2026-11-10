"use client";

import { EditionPreview } from "./EditionPreview";
import { editions } from "./editions";
import "../../app/hero-editions/editions.css";
import "./night-lacquer-home.css";

export function NightLacquerHero() {
  return <EditionPreview edition={editions[1]} production />;
}
