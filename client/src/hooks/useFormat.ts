import { useEffect, useState } from "react";
import {
  loadLanguage,
  langs,
  LanguageName,
} from "@uiw/codemirror-extensions-langs";

const extensionCache: { [key: string]: any } = {};

export function useFormat({ format }: { format: LanguageName | string }) {
  const [extension, setExtension] = useState<any>(null);

  useEffect(() => {
    async function loadExtension() {
      if (extensionCache[format]) {
        setExtension(extensionCache[format]);
        return;
      }

      let loadedExtension;

      if (format in langs) {
        loadedExtension = loadLanguage(format as LanguageName);
      } else {
        loadedExtension = (
          await import("@codemirror/lang-markdown")
        ).markdown();
      }

      extensionCache[format] = loadedExtension;
      setExtension(loadedExtension);
    }

    loadExtension();
  }, [format]);

  return extension;
}
