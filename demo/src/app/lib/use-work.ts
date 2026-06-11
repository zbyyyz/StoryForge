"use client";
import { useState, useEffect } from "react";

interface WorkInfo { title: string; type: string; }

export function useWorkInfo(): WorkInfo {
  const [info, setInfo] = useState<WorkInfo>({ title: "城市边缘", type: "现代都市" });
  useEffect(() => {
    try {
      const works = JSON.parse(localStorage.getItem("storyforge_works") || "[]");
      if (works.length > 0) setInfo({ title: works[0].title || "未命名", type: works[0].type || "" });
    } catch {}
  }, []);
  return info;
}
