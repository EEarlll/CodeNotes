import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../theme-provider";
import NoteSidebar from "./NoteSidebar";
import { sideBarUI as UI } from "@/components/SideBar/index";
import { useAuth } from "../Auth/AuthContextProvider";
import { doSignOut } from "@/firebase/auth";
import { ChangeEvent, useState } from "react";
import useDebounce from "@/hooks/useDebounce";

export default function Sidebar({ isMobile }: { isMobile?: boolean }) {
  const { setTheme } = useTheme();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [openSheet, setOpenSheet] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  function handlechange(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setSearch(e.target.value);
  }

  useDebounce({
    effect: () => {
      const params = new URLSearchParams();
      if (search) {
        params.append("search", search);
      } else {
        params.delete("search");
      }
      navigate({ search: params.toString() });
    },
    dependency: [search, navigate],
    delay: 800,
  });

  return (
    <>
      {isMobile ? (
        <header className="bg-white dark:bg-background flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 sticky top-0 backdrop-brightness-0 justify-between z-50">
          <UI.Sheet open={openSheet} onOpenChange={setOpenSheet}>
            <UI.SheetTrigger asChild>
              <UI.Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <UI.Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </UI.Button>
            </UI.SheetTrigger>
            <UI.SheetContent side="left" className="flex flex-col">
              <UI.SheetTitle>
                <Link
                  to="/"
                  className="flex items-center gap-2 font-semibold"
                  onClick={() => setOpenSheet((prev) => !prev)}
                >
                  <UI.SquareChartGantt className="h-6 w-6" />
                  <span className="font-mono text-2xl tracking-widest">
                    CodeNotes
                  </span>
                </Link>
              </UI.SheetTitle>

              <nav className="grid gap-2 text-lg font-medium j">
                <div className="flex flex-col gap-4 py-3">
                  <Link to={"/"} onClick={() => setOpenSheet((prev) => !prev)}>
                    <div className="flex gap-2 py-1 rounded-md hover:bg-accent hover:cursor-pointer">
                      <UI.Home className="h-6 w-6" />
                      <span className="my-auto">Home</span>
                    </div>
                  </Link>
                  <Link
                    to={"/About"}
                    onClick={() => setOpenSheet((prev) => !prev)}
                  >
                    <div className="flex gap-2 py-1 rounded-md hover:bg-accent hover:cursor-pointer">
                      <UI.File className="h-6 w-6" />
                      <span className="my-auto">About</span>
                    </div>
                  </Link>
                </div>
                {currentUser && <NoteSidebar setOpenSheet={setOpenSheet} />}
                <NoteSidebar title="All" setOpenSheet={setOpenSheet} />
              </nav>

              <UI.SheetDescription className="hidden">
                description
              </UI.SheetDescription>
            </UI.SheetContent>
          </UI.Sheet>

          {/* search */}
          <div className="flex md:w-full">
            <div className="w-full flex-1">
              {/* <Form method="get" action={`/Notes`}> */}
              <div className="relative w-full">
                <UI.Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <UI.Input
                  type="search"
                  name="search"
                  onChange={handlechange}
                  placeholder="Search notes..."
                  className="w-full appearance-none bg-background pl-11 shadow-none md:w-2/3 lg:w-1/2"
                />
              </div>
            </div>
          </div>
          {/* signIn/signOut/Theme */}
          <div className="gap-4 hidden md:flex">
            {currentUser ? (
              <UI.Button className="" onClick={doSignOut}>
                Logout
              </UI.Button>
            ) : (
              <>
                <UI.Button className="text-muted-foreground bg-background shadow-none appearance-none border border-input">
                  <Link to={"/SignUp"}>Sign Up</Link>
                </UI.Button>

                <UI.Button className="">
                  <Link to={"/SignIn"}>Sign In</Link>
                </UI.Button>
              </>
            )}
          </div>
          <UI.DropdownMenu>
            <UI.DropdownMenuTrigger asChild>
              <UI.Button variant="outline" size="icon" className="md:px-4">
                <UI.Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 absolute" />
                <UI.Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </UI.Button>
            </UI.DropdownMenuTrigger>
            <UI.DropdownMenuContent align="end">
              <UI.DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </UI.DropdownMenuItem>
              <UI.DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </UI.DropdownMenuItem>
              <UI.DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </UI.DropdownMenuItem>
            </UI.DropdownMenuContent>
          </UI.DropdownMenu>
          <UI.DropdownMenu>
            <UI.DropdownMenuTrigger asChild>
              <UI.Button
                variant="secondary"
                size="icon"
                className="rounded-full md:hidden"
              >
                <UI.CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </UI.Button>
            </UI.DropdownMenuTrigger>
            <UI.DropdownMenuContent align="end">
              {currentUser ? (
                <>
                  <UI.DropdownMenuLabel>My Account</UI.DropdownMenuLabel>
                  <UI.DropdownMenuSeparator />
                  <UI.DropdownMenuItem>Logout</UI.DropdownMenuItem>
                </>
              ) : (
                <>
                  <UI.DropdownMenuItem>
                    <Link to={"/SignUp"}>Sign Up</Link>{" "}
                  </UI.DropdownMenuItem>
                  <UI.DropdownMenuItem>
                    <Link to={"/SignIn"}> Sign In</Link>
                  </UI.DropdownMenuItem>
                </>
              )}
              <UI.DropdownMenuItem></UI.DropdownMenuItem>
            </UI.DropdownMenuContent>
          </UI.DropdownMenu>
        </header>
      ) : (
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          <div className="flex flex-col gap-4 py-3">
            <Link to={"/"}>
              <div className="flex gap-2 py-1 rounded-md hover:bg-accent hover:cursor-pointer">
                <UI.Home className="h-6 w-6" />
                <span className="my-auto">Home</span>
              </div>
            </Link>
            <Link to={"/About"}>
              <div className="flex gap-2 py-1 rounded-md hover:bg-accent hover:cursor-pointer">
                <UI.File className="h-6 w-6" />
                <span className="my-auto">About</span>
              </div>
            </Link>
          </div>
          <UI.Separator />
          {currentUser && <NoteSidebar />}
          <NoteSidebar title="All" />
        </nav>
      )}
    </>
  );
}
