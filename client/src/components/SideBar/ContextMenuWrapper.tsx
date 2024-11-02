import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMenu } from "./ContextMenuProvider";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../Auth/AuthContextProvider";

export function ContextMenuWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const { openModal, openModalCategory } = useMenu();

  useEffect(() => {
    const callback = (event: KeyboardEvent) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.altKey &&
        event.code === "KeyP"
      ) {
        navigator.share({
          text: document.title,
          url: window.location.href,
        });
      }
      if ((event.metaKey || event.ctrlKey) && event.code === "BracketRight") {
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: `Clipboard`,
          description: `${window.location.href} copied to clipboard.`,
        });
      }
    };
    document.addEventListener("keydown", callback);
    return () => {
      document.removeEventListener("keydown", callback);
    };
  }, []);

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem inset onClick={() => navigate(-1)}>
          Back
          <ContextMenuShortcut>Alt+Left arrow</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem
          inset
          disabled={!location.key}
          onClick={() => navigate(+1)}
        >
          Forward
          <ContextMenuShortcut>Alt+Right arrow</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem inset onClick={() => window.location.reload()}>
          Reload
          <ContextMenuShortcut>Ctrl+R</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem
          inset
          onClick={() =>
            navigator.share({
              text: document.title,
              url: window.location.href,
            })
          }
        >
          Share
          <ContextMenuShortcut>Ctrl+Alt+P</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          inset
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
          }}
        >
          Copy URL to clipboard
          <ContextMenuShortcut>Ctrl+]</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem inset onClick={openModal}>
          Add Notes
        </ContextMenuItem>
        {currentUser && (
          <ContextMenuItem inset onClick={openModalCategory}>
            Add Category
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}
