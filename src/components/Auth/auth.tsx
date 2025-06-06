
export const logout = async () => {
  try {
    const res = await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      console.warn("⚠️ Logout failed with status:", res.status);
    }

    window.location.href = "/login";
  } catch (err) {
    console.error("❌ Logout error:", err);
    window.location.href = "/login"; 
  }
};
