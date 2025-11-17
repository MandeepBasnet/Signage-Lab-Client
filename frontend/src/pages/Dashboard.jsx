import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import LayoutContent from "../components/LayoutContent";
import PlaylistContent from "../components/PlaylistContent";
import MediaContent from "../components/MediaContent";
import { clearAuth } from "../utils/auth";

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState("design-layout");
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    clearAuth();
    navigate("/login", { replace: true });
  }, [navigate]);

  return (
    <div className="flex min-h-screen w-screen bg-gray-100 overflow-hidden">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar currentPage={currentPage} onLogout={handleLogout} />
        <div className="flex-1 overflow-y-auto p-5 bg-gray-100">
          {currentPage === "design-layout" && <LayoutContent />}
          {currentPage === "library-playlist" && <PlaylistContent />}
          {currentPage === "library-media" && <MediaContent />}
        </div>
      </div>
    </div>
  );
}
