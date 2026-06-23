"use client";

import { useEffect } from "react";
import { migrateIfNeeded } from "./lib/migration";

export function AppInit() {
  useEffect(() => { migrateIfNeeded(); }, []);
  return null;
}
