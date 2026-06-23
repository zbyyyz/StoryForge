"use client";
import { useState, useEffect } from "react";

interface WorkInfo { title: string; type: string; }

export function useWorkInfo(): WorkInfo {
  const [info, setInfo] = useState<WorkInfo>({ title: "", type: "" });
  useEffect(() => {
    try {
      const works = JSON.parse(localStorage.getItem("storyforge_works") || "[]");
      const activeId = localStorage.getItem("storyforge_active_work");
      let w = null;
      if (activeId) w = works.find((item: { id: string }) => item.id === activeId);
      if (!w && works.length > 0) w = works[0];
      if (w) setInfo({ title: w.title || "未命名", type: w.type || "" });
    } catch {}
  }, []);
  return info;
}
