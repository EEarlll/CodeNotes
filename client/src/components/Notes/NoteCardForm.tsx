import { noteCardType, noteType } from "@/types";
import { cardForm } from "@/components/Notes/index";
import { useRef, useState, useCallback, useEffect } from "react";
import NoteCardContent from "./NoteCardContent";
import { useAuth } from "../Auth/AuthContextProvider";
import { useCustomMutation } from "@/hooks/useCustomMutation";
import { base_url, fetchNote } from "@/api/notes";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "@/hooks/useLocalStorageState";

export default function NoteCardForm({ note, pin }: noteCardType) {
  const [currMsg, setcurrMsg] = useState<string>(note.message);
  const extension = cardForm.useFormat({ format: note.format });
  const [__, setOpen] = useState<boolean>(false);
  const isPin = useRef<number | null>(null);
  const { toast } = cardForm.useToast();
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [_, setPinList] = useLocalStorage<number[]>("pinList", []);

  const [formData, setFormData] = useState<noteType>({
    id: note.id,
    title: note.title,
    category: note.category,
    message: note.message,
    user: note.user,
    format: note.format,
    pin: note.pin,
    DateCreated: note.DateCreated,
  });

  useEffect(() => {
    if (isPin.current != null) {
      if (currentUser) {
        handlePinSubmit();
      } else {
        let _pinList: Array<number> = JSON.parse(
          localStorage.getItem("pinList") || "[]"
        );

        if (!_pinList.includes(note.id)) {
          _pinList.push(note.id);
        } else {
          _pinList = _pinList.filter((id: noteType["id"]) => id != note.id);
        }
        setPinList(_pinList);
        queryClient.invalidateQueries({ queryKey: ["notes"] });
        toast({
          title: note.title,
          description: `${pin ? "un" : ""}pinned item locally.`,
        });
      }
    }
    setOpen((prev) => !prev);
  }, [isPin.current]);

  // // HTTP REQUEST
  const updateMutation = useCustomMutation<noteType>({
    func: fetchNote,
    queryKey: ["notes"],
    formData: formData,
  });

  const deleteMutation = useCustomMutation<noteType>({
    func: fetchNote,
    queryKey: ["notes"],
    formData: formData,
  });

  const pinMutation = useCustomMutation<noteType>({
    func: fetchNote,
    queryKey: ["notes"],
    formData: formData,
  });

  // Functions
  const HandleChange = useCallback((val: string) => {
    setFormData((prevData) => ({ ...prevData, message: val }));
    setcurrMsg(formData.message);
  }, []);

  function copyText() {
    navigator.clipboard.writeText(currMsg);
    toast({
      description: "Copy text to the clipboard",
    });
  }

  function handlePin() {
    setFormData((prevdata) => ({
      ...prevdata,
      pin: prevdata.pin === 0 ? 1 : 0,
    }));
    isPin.current = isPin.current ? 0 : 1;
  }

  async function handlePinSubmit() {
    pinMutation.mutate({
      url: `${base_url}/Notes/${note.id}/pin`,
      method: pin ? "delete" : "POST",
      formData: formData,
      token: currentUser?.ID_TOKEN,
    });
  }

  return (
    <>
      <cardForm.Dialog onOpenChange={setOpen}>
        <cardForm.DialogTrigger>
          <cardForm.NoteCardItem note={formData}></cardForm.NoteCardItem>
        </cardForm.DialogTrigger>
        <cardForm.DialogContent
          className="max-w-[375px] md:max-w-[700px] transition-opacity h-[90%] md:mt-0 md:h-auto"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <cardForm.DialogHeader className="h-fit">
            <div className="flex">
              <cardForm.DialogTitle className="pl-4 pr-1 my-auto">
                <input
                  type="text"
                  className="border-none outline-none bg-inherit w-[150px] md:w-[150px]"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                />
              </cardForm.DialogTitle>
              <cardForm.Button variant={"ghost"} onClick={handlePin}>
                {pin ? (
                  <cardForm.Pin
                    size={16}
                    className="dark:text-yellow-400 text-yellow-600"
                  />
                ) : (
                  <cardForm.Pin
                    size={16}
                    className="dark:text-gray-500 text-gray-400"
                  />
                )}
              </cardForm.Button>
              <cardForm.Button variant={"ghost"} onClick={copyText}>
                <cardForm.Copy size={16} />
              </cardForm.Button>
              <small className="hidden md:block text-sm text-muted-foreground my-auto">
                By {note.user}
              </small>
            </div>
          </cardForm.DialogHeader>
          <div className="h-[50vh] md:h-[77vh] overflow-y-scroll scrollbarStyle">
            <NoteCardContent
              formData={formData}
              extension={extension}
              HandleChange={HandleChange}
              isUser={currentUser?.email === note.user}
            />
          </div>
          <cardForm.DialogFooter className="max-w-[300px] md:max-w-[700px]">
            <cardForm.AlertDialog>
              {currentUser?.email === note.user && (
                <div className="flex gap-3 justify-end">
                  <cardForm.AlertDialogTrigger
                    className={cardForm.buttonVariants({
                      variant: "destructive",
                    })}
                  >
                    Delete
                  </cardForm.AlertDialogTrigger>
                  <cardForm.Button
                    variant={"secondary"}
                    onClick={async () => {
                      updateMutation.mutate({
                        url: `${base_url}/Notes/${
                          note.id
                        }/update`,
                        method: "POST",
                        formData,
                        token: currentUser?.ID_TOKEN,
                      });
                      setOpen(false);
                    }}
                  >
                    Update
                  </cardForm.Button>
                </div>
              )}
              <cardForm.AlertDialogContent>
                <cardForm.AlertDialogHeader>
                  <cardForm.AlertDialogTitle>
                    Are you absolutely sure?
                  </cardForm.AlertDialogTitle>
                  <cardForm.AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this item and remove it from our servers.
                  </cardForm.AlertDialogDescription>
                </cardForm.AlertDialogHeader>
                <cardForm.AlertDialogFooter>
                  <cardForm.AlertDialogCancel>
                    Cancel
                  </cardForm.AlertDialogCancel>
                  <cardForm.AlertDialogAction
                    onClick={async () => {
                      deleteMutation.mutate({
                        url: `${base_url}/Notes/${
                          note.id
                        }/delete`,
                        method: "delete",
                        formData: formData,
                        token: currentUser?.ID_TOKEN,
                      });
                      setOpen(false);
                    }}
                  >
                    Delete
                  </cardForm.AlertDialogAction>
                </cardForm.AlertDialogFooter>
              </cardForm.AlertDialogContent>
            </cardForm.AlertDialog>
          </cardForm.DialogFooter>
        </cardForm.DialogContent>
        <cardForm.DialogDescription className="hidden">
          description
        </cardForm.DialogDescription>
      </cardForm.Dialog>
    </>
  );
}
