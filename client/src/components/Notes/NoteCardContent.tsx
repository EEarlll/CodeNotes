import React, { lazy, Suspense, useEffect, useState } from "react";
import { basicSetup, cardContent } from "@/components/Notes/index";
import { githubDarkInit, githubLightInit } from "@uiw/codemirror-theme-github";
import { EditorView } from "@uiw/react-codemirror";
import { noteType } from "@/types";
import rehypeExternalLinks from "rehype-external-links";
import { Link } from "react-router-dom";

const LazyCodeMirror = lazy(() => import("@uiw/react-codemirror"));
const LazyMarkdownPreview = lazy(() => import("@uiw/react-markdown-preview"));

function getResponsiveFontSize() {
  return window.innerWidth < 768 ? "0.5rem" : "1rem";
}

export default function NoteCardContent({
  formData,
  extension,
  HandleChange,
  isUser,
}: propType) {
  const [fontSize, setFontSize] = useState(getResponsiveFontSize());

  useEffect(() => {
    const handleResize = () => {
      setFontSize(getResponsiveFontSize());
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (formData.format === "site") {
    const site: string[] = formData.message
      .replace("/watch?v=", "/embed/")
      .split(/\r?\n/);
    const [url, setUrl] = useState<string[]>(site);

    function handleUrlChange(
      e: React.ChangeEvent<HTMLInputElement>,
      i: number
    ) {
      const updatedUrls = [...url];
      updatedUrls[i] = e.target.value;
      setUrl(updatedUrls);
      HandleChange(updatedUrls.join("\r\n"));
    }

    return (
      <>
        {url.map((item: string, index: number) => {
          return (
            <React.Fragment key={index}>
              <Link to={item} target="_blank">
                <input
                  type="text"
                  value={item}
                  className="bg-inherit border-none outline-none text-blue-500 cursor-pointer w-screen"
                  onChange={(e) => handleUrlChange(e, index)}
                />
              </Link>

              <iframe
                width={"100%"}
                height={"100%"}
                src={item}
                className="p-4"
              />
            </React.Fragment>
          );
        })}
      </>
    );
  }

  return (
    <cardContent.Tabs defaultValue="edit" className="w-full">
      {formData.format == "markdown" && (
        <cardContent.TabsList>
          <cardContent.TabsTrigger value="edit">Edit</cardContent.TabsTrigger>
          <cardContent.TabsTrigger value="preview">
            Preview
          </cardContent.TabsTrigger>
        </cardContent.TabsList>
      )}

      <cardContent.TabsContent value="edit">
        <Suspense>
          <LazyCodeMirror
            basicSetup={basicSetup}
            value={formData.message}
            readOnly={!isUser}
            className="w-fit md:text-[1rem] text-[.5rem]"
            height="100%"
            theme={
              document.documentElement.classList.contains("dark")
                ? githubDarkInit({
                    settings: {
                      background: "#09090b", // Dark background
                      fontFamily:
                        "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                    },
                  })
                : githubLightInit({
                    settings: {
                      background: "#ffffff", // Light background
                      fontFamily:
                        "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                    },
                  })
            }
            extensions={[
              extension,
              EditorView.theme({
                "&.cm-focused": {
                  outline: "none",
                },
              }),
            ]}
            onChange={HandleChange}
          />
        </Suspense>
      </cardContent.TabsContent>
      <cardContent.TabsContent value="preview" className="">
        <Suspense>
          <LazyMarkdownPreview
            source={formData.message}
            skipHtml={false}
            disableCopy
            rehypePlugins={[[rehypeExternalLinks, { target: "_blank" }]]}
            style={{
              padding: 16,
              fontSize: fontSize,
              background: document.documentElement.classList.contains("dark")
                ? "#09090b"
                : "#ffffff",
            }}
            wrapperElement={{
              "data-color-mode": document.documentElement.classList.contains(
                "dark"
              )
                ? "dark"
                : "light",
            }}
          />
        </Suspense>
      </cardContent.TabsContent>
    </cardContent.Tabs>
  );
}

type propType = {
  formData: noteType;
  extension: any;
  HandleChange: (val: string) => void;
  isUser: boolean;
};
