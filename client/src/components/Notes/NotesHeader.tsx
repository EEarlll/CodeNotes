import { header } from "@/components/Notes/index";
import {
  useState,
  ChangeEvent,
  useEffect,
  Dispatch,
  SetStateAction,
  MouseEvent,
  FormEvent,
} from "react";
import { noteType } from "@/types";
import { noteFormat } from "./Formats";
import { useMenu } from "../SideBar/ContextMenuProvider";
import { useAuth } from "../Auth/AuthContextProvider";
import { useQuery } from "@tanstack/react-query";
import { getCategory, fetchNote, base_url } from "@/api/notes";
import { useCustomMutation } from "@/hooks/useCustomMutation";

export default function NotesHeader({
  setDataKey,
}: {
  setDataKey: Dispatch<SetStateAction<number>>;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [openFormat, setOpenFormat] = useState<boolean>(false);
  const [value, setValue] = useState<string>("default");
  const [valueFormat, setValueFormat] = useState<string>("markdown");
  const { ModalState, setOpenModal } = useMenu();
  const { toast } = header.useToast();
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState<noteType>({
    id: 0,
    title: "",
    category: "default",
    message: "",
    user: currentUser?.email || "guest",
    format: "markdown",
    pin: 0,
    DateCreated: "",
  });

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      user: currentUser?.email || "guest",
    }));
  }, [currentUser]);

  useEffect(() => {
    if (!ModalState) {
      const timer = setTimeout(() => {
        document.body.style.pointerEvents = "";
      }, 0);

      return () => clearTimeout(timer);
    } else {
      document.body.style.pointerEvents = "auto";
    }
  }, [ModalState]);

  const { data } = useQuery({
    queryKey: ["headerCategories"],
    queryFn: getCategory,
  });

  const postMutation = useCustomMutation<noteType>({
    func: fetchNote,
    queryKey: ["notes"],
    formData: formData,
  });

  // Functions
  function HandleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }

  async function HandleSubmit(
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>
  ) {
    try {
      if (formData.title != "" && formData.message != "") {
        e.preventDefault();
        postMutation.mutate({
          url: `${base_url}/Notes/create`,
          method: "POST",
          formData: formData,
          token: currentUser?.ID_TOKEN,
        });
        setOpenModal && setOpenModal(!ModalState);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: `Error`,
        description: `${error}`,
      });
    }
  }

  return (
    <>
      <header.Dialog
        open={ModalState}
        onOpenChange={() => {
          setOpenModal && setOpenModal(!ModalState);
          setDataKey((prev) => prev + 1);
        }}
      >
        <header.DialogTrigger asChild>
          <header.Button size={"sm"} className="h-8 gap-1">
            <header.PlusCircle className="h-3.5 w-3.5"></header.PlusCircle>
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Notes
            </span>
          </header.Button>
        </header.DialogTrigger>
        <header.DialogContent className="sm:max-w-[425px] md:max-w-[600px] h-screen md:h-auto mt-14 md:mt-7">
          <header.DialogHeader className="h-fit">
            <header.DialogTitle>Add Note</header.DialogTitle>
            <header.DialogDescription className="pt-2">
              Add your note here. Click save when you're done.
            </header.DialogDescription>
          </header.DialogHeader>
          <form
            className="grid gap-4 py-4 sm:max-w-[425px] md:max-w-[700px] mx-auto h-full grid-rows-12 md:grid-rows-10"
            onSubmit={HandleSubmit}
          >
            <div className="grid grid-cols-4  md:grid-cols-6 items-center gap-4">
              <header.Label htmlFor="title" className="text-right">
                Title
              </header.Label>
              <header.Input
                id="title"
                name="title"
                className="w-[210px]"
                onChange={HandleChange}
                value={formData.title}
                required
              />
            </div>
            <div className="grid grid-cols-4 md:grid-cols-6 items-center gap-4">
              <header.Label htmlFor="user" className="text-right truncate">
                User
              </header.Label>
              <header.Input
                id="user"
                name="user"
                disabled
                className="w-[210px]"
                onChange={HandleChange}
                value={formData.user}
              />
            </div>
            <div className="grid grid-cols-4 md:grid-cols-6 items-center gap-4 hdden">
              <header.Label htmlFor="Format" className="text-right">
                Format
              </header.Label>
              <header.Popover
                open={openFormat}
                onOpenChange={setOpenFormat}
                modal={true}
              >
                <header.PopoverTrigger asChild>
                  <header.Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openFormat}
                    className="w-[210px] justify-between"
                  >
                    {valueFormat
                      ? noteFormat.find(
                          (format) => format.value === valueFormat
                        )?.label
                      : "Search format..."}
                    <header.ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </header.Button>
                </header.PopoverTrigger>
                <header.PopoverContent className="w-[210px] p-0 z">
                  <header.Command>
                    <header.CommandInput placeholder="Search format..." />
                    <header.CommandList>
                      <header.CommandEmpty>
                        No format found.
                      </header.CommandEmpty>
                      <header.CommandGroup>
                        {noteFormat.map((format) => (
                          <header.CommandItem
                            key={format.value}
                            value={format.value}
                            onSelect={(currentValue: string) => {
                              setValueFormat(
                                currentValue === valueFormat ? "" : currentValue
                              );
                              setFormData((prevData) => ({
                                ...prevData,
                                format: currentValue,
                              }));
                              setOpenFormat(false);
                            }}
                          >
                            <header.Check
                              className={header.cn(
                                "mr-2 h-4 w-4",
                                valueFormat === format.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {format.label}
                          </header.CommandItem>
                        ))}
                      </header.CommandGroup>
                    </header.CommandList>
                  </header.Command>
                </header.PopoverContent>
              </header.Popover>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-6 items-center gap-4">
              <header.Label htmlFor="Category" className="text-right">
                Category
              </header.Label>
              <header.Popover open={open} onOpenChange={setOpen} modal={true}>
                <header.PopoverTrigger asChild>
                  <header.Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[210px] justify-between"
                  >
                    {value
                      ? data?.find((category) => category.title === value)
                          ?.title
                      : "Select Category..."}
                    <header.ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </header.Button>
                </header.PopoverTrigger>
                <header.PopoverContent className="w-[210px] p-0">
                  <header.Command>
                    <header.CommandInput placeholder="Search framework..." />
                    <header.CommandList>
                      <header.CommandEmpty>
                        No category found.
                      </header.CommandEmpty>
                      <header.CommandGroup>
                        {data?.map((category) => (
                          <header.CommandItem
                            aria-required
                            key={category.id}
                            value={category.title}
                            onSelect={(currentValue) => {
                              setValue(
                                currentValue === value ? "" : currentValue
                              );
                              setFormData((prevData) => ({
                                ...prevData,
                                category: currentValue,
                              }));
                              setOpen(false);
                            }}
                          >
                            <header.Check
                              className={header.cn(
                                "mr-2 h-4 w-4",
                                value === category.title
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {category.title}
                          </header.CommandItem>
                        ))}
                      </header.CommandGroup>
                    </header.CommandList>
                  </header.Command>
                </header.PopoverContent>
              </header.Popover>
            </div>
            <div className="grid row-span-4 md:row-span-9">
              <header.Textarea
                placeholder="Type your message here."
                id="message"
                name="message"
                className="resize-none"
                onChange={HandleChange}
              />
            </div>
            <header.DialogFooter>
              <header.Button>Save changes</header.Button>
            </header.DialogFooter>
          </form>
        </header.DialogContent>
      </header.Dialog>
    </>
  );
}
