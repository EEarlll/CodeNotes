import { useEffect, useState } from "react";

const extensionCache: { [key: string]: any } = {};

export function useFormat({ format }: { format: string }) {
  const [extension, setExtension] = useState<any>(null);

  useEffect(() => {
    async function loadExtension() {
      if (extensionCache[format]) {
        setExtension(extensionCache[format]);
        return;
      }

      let loadedExtension;
      switch (format) {
        case "python":
          loadedExtension = (await import("@codemirror/lang-python")).python();
          break;
        case "javascript":
          loadedExtension = (
            await import("@codemirror/lang-javascript")
          ).javascript({ jsx: true, typescript: true });
          break;
        case "markdown":
          loadedExtension = (
            await import("@codemirror/lang-markdown")
          ).markdown();
          break;
        case "php":
          loadedExtension = (await import("@codemirror/lang-php")).php();
          break;
        case "sql":
          loadedExtension = (await import("@codemirror/lang-sql")).sql();
          break;
        case "json":
          loadedExtension = (await import("@codemirror/lang-json")).json();
          break;
        default:
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
