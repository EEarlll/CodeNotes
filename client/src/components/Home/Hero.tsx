import { heroUI } from ".";
import WhiteWave from "./white_wave.svg?react";
import BlackWave from "./black_wave.svg?react";
import { useTheme } from "../theme-provider";
import { Link } from "react-router-dom";

export default function Hero() {
  const { theme } = useTheme();

  return (
    <>
      <div className="flex flex-col md:flex-row gap-12  md:gap-4 mt-6 md:my-12 relative">
        <h1 className="text-3xl text-center md:hidden">CODENOTES</h1>
        <div className="basis-1/2 order-2 md:order-none mt-7 flex-col flex gap-7">
          <div className="flex md:max-w-md">
            <div className="hidden md:block">
              <heroUI.SquareChartGantt className="h-10 w-10" />
            </div>
            <h1 className="text-2xl text-center md:text-4xl font-bold">
              The perfect platform for creating and sharing snippets.
            </h1>
          </div>
          <p className="text-center md:text-left">
            CodeNotes is platform for sharing and discovering snippets. Easily
            create, format, and organize your snippets for various purposes,
            allowing for seamless categorization and sharing. Explore a wealth
            of ideas and inspiration while enhancing your projects with
            versatile content.
          </p>
          <div className="flex md:justify-start justify-center">
            <Link to={"/signUp"} className={heroUI.buttonVariants()}>
              Sign Up
            </Link>
          </div>
        </div>
        {/* image */}
        <div className="flex basis-1/2 z-20 relative">
          <div className="w-full bg-gradient-to-r dark:from-accent dark:to-primary-foreground from-secondary to-muted-foreground h-80 md:h-96 rounded-md flex flex-col md:items-end md:translate-x-0 relative z-50">
            <div className="w-4/5 md:w-2/3 bg-background border h-44 rounded-sm md:-translate-y-5 md:-translate-x-5 -translate-x-1 translate-y-5">
              <div className="p-4">
                <strong>Note</strong>
                <br />
                <code>
                  Ensure that all components are responsive and follow the
                  latest design guidelines.
                </code>
              </div>
            </div>
            <div className="w-4/5 md:w-2/3 bg-background border h-44 rounded-sm md:translate-x-5 translate-x-16 md:-translate-y-0 -translate-y-11">
              <div className="p-4">
                <strong className="text-[#3572A5]">Python</strong>
                <br />
                <code>
                  <code className="block">
                    <span className="text-purple-400">def </span>
                    <span className="text-blue-400">greet</span>(
                    <span className="text-green-400">name</span>):
                  </code>
                  <code className="block ml-4">
                    <span className="text-yellow-400">return </span>
                    <span className="text-green-400">f</span>"
                    <span className="text-red-400">Hello, </span>
                    {<span className="text-green-400">name</span>}!"
                  </code>
                </code>
              </div>
            </div>
            <div className="w-4/5 md:w-2/3 bg-background border h-44 rounded-sm md:translate-y-5 md:-translate-x-5 -translate-y-14 -translate-x-1">
              <div className="p-4">
                <strong className="text-[#F7E018]">Javscript</strong>
                <br />
                <code>
                  <code className="block">
                    <span className="text-purple-400">const </span>
                    <span className="text-green-400">greet </span>
                    <span className="text-pink-400"> = </span>(
                    <span className="text-blue-400">name</span>)
                    <span className="text-pink-400">{" => "}</span>
                    <span className="text-yellow-400">`Welcome, </span>
                    <span className="text-yellow-400">
                      ${<span className="text-blue-400">name</span>}
                    </span>
                    <span className="text-yellow-400">!`</span>;
                  </code>
                  <code className="block mt-2">
                    <span className="text-purple-400">console</span>.
                    <span className="text-blue-400">log</span>(
                    <span className="text-green-400">greet</span>(
                    <span className="text-yellow-400">'user'</span>));
                  </code>
                </code>
              </div>
            </div>
          </div>
        </div>
        {theme === "dark" ? (
          <WhiteWave className="w-[300px] md:w-[600px] absolute bottom-0 right-0 -z-50 -translate-y-[40%]  md:translate-y-[90%] translate-x-[25%]" />
        ) : (
          <BlackWave className="w-[300px] md:w-[600px] absolute bottom-0 right-0 -z-50 -translate-y-[40%]  md:translate-y-[90%] translate-x-[25%]" />
        )}
      </div>
    </>
  );
}

{
}
