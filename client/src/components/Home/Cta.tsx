import React from "react";
import { ctaUI } from ".";
import WhiteWave from "./white_wave.svg?react";
import BlackWave from "./black_wave.svg?react";
import { useTheme } from "../theme-provider";
import { Link } from "react-router-dom";

const ctaInfo = [
  {
    Title: "Create & Share Snippets",
    Content: "The perfect platform for creating and sharing snippets.",
    Footer: "Try CodeNotes",
    Link: "/signIn",
    Icon: <ctaUI.NotebookPen className="w-8 h-8" />,
  },
  {
    Title: "Explore Ideas",
    Content: "Discover a wealth of inspiration and innovative snippets.",
    Footer: "Browse Snippets",
    Link: "/Notes/",
    Icon: <ctaUI.Lightbulb className="w-8 h-8" />,
  },
  {
    Title: "Organize Your Work",
    Content: "Easily categorize and manage your snippets for quick access.",
    Footer: "Get Organized",
    Link: "/Notes/All/default",
    Icon: <ctaUI.Folder className="w-8 h-8" />,
  },
];

export function CtaCard(Info: CtaCardType) {
  return (
    <div className="flex-grow">
      <ctaUI.Card className="min-h-64">
        <ctaUI.CardHeader className="relative">
          <div className="position absolute top-0 bg-accent p-4 rounded-md left-0 translate-x-7 -translate-y-8">
            {Info.Icon}
          </div>
          <ctaUI.CardTitle className="text-xl md:text-2xl pt-4">
            {Info.Title}
          </ctaUI.CardTitle>
        </ctaUI.CardHeader>
        <ctaUI.CardContent>
          <p className="text-sm">{Info.Content}</p>
        </ctaUI.CardContent>
        <ctaUI.CardFooter>
          <Link to={Info.Link} className={ctaUI.buttonVariants()}>
            {Info.Footer}
          </Link>
        </ctaUI.CardFooter>
      </ctaUI.Card>
    </div>
  );
}

export default function Cta() {
  const { theme } = useTheme();

  return (
    <>
      <div className="flex md:flex-row flex-col justify-between w-full gap-12 md:gap-8 relative">
        {ctaInfo.map((item: CtaCardType, index) => (
          <CtaCard
            Content={item.Content}
            Footer={item.Footer}
            Icon={item.Icon}
            Title={item.Title}
            key={index}
            Link={item.Link}
          />
        ))}
        {theme === "dark" ? (
          <WhiteWave className="w-[300px] md:w-[600px] absolute -rotate-90 bottom-0 -z-50 translate-y-full -translate-x-[55%]" />
        ) : (
          <BlackWave className="w-[300px] md:w-[600px] absolute -rotate-90 bottom-0 -z-50 translate-y-full -translate-x-[55%]" />
        )}
      </div>
    </>
  );
}

type CtaCardType = {
  Title: string;
  Content: string;
  Footer: string;
  Link: string;
  Icon: React.ReactNode;
};
