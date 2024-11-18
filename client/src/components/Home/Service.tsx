import { serviceUI } from ".";
import { type CarouselApi } from "../ui/carousel";
import WhiteWave from "./white_wave.svg?react";
import BlackWave from "./black_wave.svg?react";
import { useTheme } from "../theme-provider";
import { useEffect, useState } from "react";

const accordionList: accordionType[] = [
  {
    title: "Remember All Your Notes",
    description:
      "CodeNote helps you keep all your notes in one place, offering a streamlined web view with clear formatting. Developers can easily upload and organize code snippets for future reference.",
  },
  {
    title: "Keep Notes Accessible",
    description:
      "Browse notes from other users and get inspired by their insights and techniques.",
  },
  {
    title: "Embed Content",
    description:
      "Enhance your notes by embedding useful websites and YouTube videos for quick access to relevant resources.",
  },
  {
    title: "Categorize Your Notes",
    description:
      "Stay organized by categorizing notes, making it easy to locate information when needed.",
  },
  {
    title: "Pin Important Notes",
    description:
      "Quickly access frequently used notes by pinning them. CodeNote supports both local pinning and account-based pinning.",
  },
  {
    title: "Custom Formatting",
    description:
      "Format notes to your liking with support for various syntax options, including Python, JavaScript, and more.",
  },
];

const serviceList: serviceItemType[] = [
  {
    img: "/logo/jstsReact.jpg",
    title: "JS/TS/React",
  },
  {
    img: "/logo/Python_logo.png",
    title: "Python",
  },
  {
    img: "/logo/SQL_logo.png",
    title: "SQL",
  },
  {
    img: "/logo/PHP_logo.png",
    title: "PHP",
  },
];

const carouselList: serviceItemType[] = [
  {
    img: "/features/feature1.png",
    title: "Create Rich-Format Notes",
  },
  {
    img: "/features/feature2.png",
    title: "Light and Dark Mode Options",
  },

  {
    img: "/features/feature3.png",
    title: "Embed Links and Media",
  },
  {
    img: "/features/feature4.png",
    title: "Markdown Preview Support",
  },
  {
    img: "/features/feature5.png",
    title: "Syntax Highlighting",
  },
  {
    img: "/features/feature6.png",
    title: "Pin Notes for Quick Access",
  },
  {
    img: "/features/feature7.png",
    title: "Organize Notes by Category",
  },
];

export function AccordionItems({ title, description }: accordionType) {
  return (
    <serviceUI.Accordion type="single" collapsible className="md:my-4">
      <serviceUI.AccordionItem value="item-1">
        <serviceUI.AccordionTrigger>{title}</serviceUI.AccordionTrigger>
        <serviceUI.AccordionContent>{description}</serviceUI.AccordionContent>
      </serviceUI.AccordionItem>
    </serviceUI.Accordion>
  );
}

export default function Service() {
  const { theme } = useTheme();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [_, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <>
      <h1 className="text-center text-2xl font-semibold">
        A personalized platform for coding, notes, and snippets
      </h1>
      <div className="flex w-full flex-col md:flex-row gap-14">
        <div className="basis-1/4">
          {accordionList.map((item: accordionType, index: number) => (
            <AccordionItems
              title={item.title}
              description={item.description}
              key={index}
            />
          ))}
        </div>
        <div className="w-full flex justify-center flex-col items-center">
          <serviceUI.Carousel className="w-[90%] rounded-md" setApi={setApi}>
            <serviceUI.CarouselContent>
              {carouselList.map((element, index) => (
                <serviceUI.CarouselItem key={index}>
                  <div className="p-1">
                    <img src={element.img} alt="" className="rounded-md" />
                  </div>
                </serviceUI.CarouselItem>
              ))}
            </serviceUI.CarouselContent>
            <serviceUI.CarouselPrevious />
            <serviceUI.CarouselNext />
          </serviceUI.Carousel>
          <div className="py-2 text-center text-sm text-muted-foreground">
            {carouselList[current].title}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-evenly relative">
        {serviceList.map((item, index) => (
          <serviceUI.Card
            className="md:w-[170px] md:h-[250px] w-[100px] h-[100px] m-1"
            key={index}
          >
            <serviceUI.CardHeader>
              <serviceUI.CardTitle className="text-center md:text-2xl text-xs">
                {item.title}
              </serviceUI.CardTitle>
            </serviceUI.CardHeader>
            <serviceUI.CardContent className="relative md:max-w-[150px] md:h-[120px] mx-auto ">
              <img
                src={item.img}
                alt=""
                className="w-auto h-auto max-w-full max-h-full absolute top inset-x-0 inset-y-0 m-auto"
              />
            </serviceUI.CardContent>
          </serviceUI.Card>
        ))}

        <serviceUI.Card className="md:w-[200px] md:h-[250px] border-none">
          <serviceUI.CardHeader>
            <serviceUI.CardTitle className="md:text-2xl text-lg">
              Getting Started
            </serviceUI.CardTitle>
          </serviceUI.CardHeader>
          <serviceUI.CardContent>
            <p className="text-sm">
              Begin your journey with CodeNote by creating an account, and start
              organizing, formatting, and accessing all your notes and code
              snippets in one convenient location.
            </p>
          </serviceUI.CardContent>
          <serviceUI.CardFooter>
            <p></p>
          </serviceUI.CardFooter>
        </serviceUI.Card>
        {theme === "dark" ? (
          <WhiteWave className="w-[300px] md:w-[600px] absolute rotate-180 bottom-0 left-0 -translate-x-[15%] -z-50 translate-y-[10%]" />
        ) : (
          <BlackWave className="w-[300px] md:w-[600px] absolute rotate-180 bottom-0 left-0 -translate-x-[15%] -z-50 translate-y-[10%]" />
        )}
      </div>
    </>
  );
}

type accordionType = {
  title: string;
  description: string;
};

type serviceItemType = {
  title: string;
  img: string;
};
