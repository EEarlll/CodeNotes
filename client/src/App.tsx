import Sidebar from "./components/SideBar/Sidebar";
import { SquareChartGantt } from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import { ContextMenuProvider } from "./components/SideBar/ContextMenuProvider";
import { ThemeProvider } from "./components/theme-provider";
import { AuthContextProvider } from "./components/Auth/AuthContextProvider";
import { ContextMenuWrapper } from "./components/SideBar/ContextMenuWrapper";

export default function App() {
  return (
    <AuthContextProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <ContextMenuProvider>
          <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            {/* Desktop View */}
            <div className="hidden border-r bg-muted/40 md:block">
              <ContextMenuWrapper>
                <div className="flex h-full max-h-screen flex-col gap-2 sticky top-0">
                  <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-3.5">
                    <Link
                      to="/"
                      className="flex items-center gap-2 font-semibold"
                    >
                      <SquareChartGantt className="h-6 w-6" />
                      <span className="font-mono text-2xl tracking-widest">
                        CodeNotes
                      </span>
                    </Link>
                  </div>
                  <div className="flex-1">
                    <Sidebar />
                  </div>
                </div>
              </ContextMenuWrapper>
            </div>
            <div className="flex flex-col">
              {/* Mobile View */}
              <Sidebar isMobile={true} />
              {/* Main Content */}
              <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 container">
                <Outlet />
              </main>
            </div>
          </div>
        </ContextMenuProvider>
      </ThemeProvider>
    </AuthContextProvider>
  );
}
