"use client";

import { useState } from "react";
import { createClient } from "@/app/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/home` },
    });
    if (error) setError(error.message);
    else setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-[380px] px-6">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold mb-2">StoryForge</h1>
          <p className="text-sm text-gray-500">登录以保存你的创作到云端</p>
        </div>

        {sent ? (
          <div className="text-center p-6 border border-gray-200 rounded-xl">
            <div className="text-3xl mb-3">📧</div>
            <div className="text-sm font-medium mb-1">登录链接已发送</div>
            <div className="text-xs text-gray-500">请检查 {email} 的收件箱，点击链接完成登录</div>
          </div>
        ) : (
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">邮箱地址</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#111] transition-colors"
              />
            </div>
            {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
            <button
              type="submit"
              disabled={loading || !email}
              className="w-full py-3 bg-[#111] text-white rounded-lg text-sm font-medium hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "发送中..." : "发送登录链接"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <a href="/home" className="text-xs text-gray-400 hover:text-gray-600">跳过登录，使用本地模式 →</a>
        </div>
      </div>
    </div>
  );
}
