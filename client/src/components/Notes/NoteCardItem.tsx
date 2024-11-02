import { noteType } from "@/types";
import { cardItem } from "@/components/Notes/index";
import { noteFormat } from "./Formats";

function calculateHoursDifference(DateCreated: string): string {
  const curr_date: Date = new Date();
  const createdDate: Date = new Date(DateCreated);

  const timeDiff: number = curr_date.getTime() - createdDate.getTime();

  const secondDiff: number = Math.floor(timeDiff / 1000);
  const minuteDiff: number = Math.floor(timeDiff / (1000 * 60));
  const hourDiff: number = Math.floor(timeDiff / (1000 * 60 * 60));
  const dayDiff: number = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const monthDiff: number = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 30));
  const yearDiff: number = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 365));
  const decadeDiff: number = Math.floor(yearDiff / 10);

  if (decadeDiff >= 1) {
    return `${decadeDiff} decade${decadeDiff > 1 ? "s" : ""}`;
  } else if (yearDiff >= 1) {
    return `${yearDiff} year${yearDiff > 1 ? "s" : ""}`;
  } else if (monthDiff >= 1) {
    return `${monthDiff} month${monthDiff > 1 ? "s" : ""}`;
  } else if (dayDiff >= 1) {
    return `${dayDiff} day${dayDiff > 1 ? "s" : ""}`;
  } else if (hourDiff >= 1) {
    return `${hourDiff} hr${hourDiff > 1 ? "s" : ""}`;
  } else if (minuteDiff >= 1) {
    return `${minuteDiff} min`;
  } else {
    return `${secondDiff} sec`;
  }
}

export default function NoteCardItem({ note }: { note: noteType }) {
  const color = noteFormat.find(
    (format) => format.value === note.format && format.color
  )?.color;

  return (
    <cardItem.Card className="max-h-[500px] max-w-[300px] m-2 relative -z-50 overflow-hidden">
      <cardItem.CardHeader className="text-left">
        <cardItem.CardTitle
          className={`text-[${color}]`}
          style={{ color: color }}
        >
          {note.title}
        </cardItem.CardTitle>
        <cardItem.CardDescription>
          Last Updated: {calculateHoursDifference(note.DateCreated)}
        </cardItem.CardDescription>
      </cardItem.CardHeader>
      <cardItem.CardContent className="h-full">
        <div className="grid w-full items-center">
          <div className="flex flex-col space-y-1.5 overflow-hidden">
            <p className="overflow-hidden line-clamp-[13] whitespace-pre-line text-left text-xs">
              {note.message}
            </p>
          </div>
        </div>
      </cardItem.CardContent>
    </cardItem.Card>
  );
}

//  darkMode with CodeMirror Instance
// const [isDarkMode, setIsDarkMode] = useState<boolean>(
//   document.documentElement.classList.contains("dark")
// );

// useEffect(() => {
//   const themeChangeHandler = () => {
//     setIsDarkMode(document.documentElement.classList.contains("dark"));
//   };

//   const observer = new MutationObserver(themeChangeHandler);
//   observer.observe(document.documentElement, {
//     attributes: true,
//     attributeFilter: ["class"],
//   });
//   return () => observer.disconnect();
// }, []);

// const extension = cardItem.useFormat({ format: note.format });

{
  /* ) : (
              extension && (
                <cardItem.CodeMirror
                  className="text-left w-fit"
                  basicSetup={basicSetup}
                  readOnly
                  value={note.message.substring(0, 300)}
                  theme={
                    isDarkMode
                      ? cardItem.githubDarkInit({
                          settings: {
                            background: "#09090b", // Dark background
                            fontFamily:
                              "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                            fontSize: ".7rem",
                          },
                        })
                      : cardItem.githubLightInit({
                          settings: {
                            background: "#ffffff", // Light background
                            fontFamily:
                              "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                            fontSize: ".7rem",
                          },
                        })
                  }
                  extensions={[extension]}
                />
              )
            )} */
}
