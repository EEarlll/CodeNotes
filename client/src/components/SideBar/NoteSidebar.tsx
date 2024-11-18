import { noteSidebarUI } from "@/components/SideBar/index";
import { categoryType } from "@/types";
import { useState, ChangeEvent, useEffect } from "react";
import { useAuth } from "../Auth/AuthContextProvider";
import { useMenu } from "./ContextMenuProvider";
import NoteCategoryForm from "./NoteCategoryForm";
import { Link } from "react-router-dom";
import { useCustomMutation } from "@/hooks/useCustomMutation";
import { base_url, fetchNote } from "@/api/notes";
import { useQuery } from "@tanstack/react-query";

export default function NotesSidebar({
  title = "userCategories",
  setOpenSheet,
}: {
  title?: string;
  setOpenSheet?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [open, setOpen] = useState<boolean>(true);
  const { categoryState, setCategoryState } = useMenu();
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState<categoryType>({
    id: 0,
    title: "",
    user: currentUser?.email || "guest",
  });

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      user: currentUser?.email || "guest",
    }));
  }, [currentUser]);

  useEffect(() => {
    if (!categoryState) {
      const timer = setTimeout(() => {
        document.body.style.pointerEvents = "";
      }, 0);

      return () => clearTimeout(timer);
    } else {
      document.body.style.pointerEvents = "auto";
    }
  }, [categoryState]);

  // HTTP REQUEST
  const { isSuccess, data } = useQuery({
    queryKey: [title],
    queryFn: async () => {
      const response = await fetch(
        `${base_url}/Notes/categorylist/${
          title != "All" && currentUser?.email ? currentUser.email : ""
        }`
      );
      return response.json();
    },
  });

  const postMutation = useCustomMutation<categoryType>({
    func: fetchNote,
    queryKey: ["userCategories", "All", "headerCategories"],
    formData: formData,
  });

  // Functions
  function HandleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }

  async function HandleSubmit(e: ChangeEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      postMutation.mutate({
        url: `${base_url}/Notes/create/category/${
          formData.title
        }`,
        method: "POST",
        formData: formData,
        token: currentUser?.ID_TOKEN,
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <noteSidebarUI.Collapsible open={open} onOpenChange={setOpen}>
      <noteSidebarUI.CollapsibleTrigger className="w-full">
        <div className="flex justify-between h-14 py-4">
          <div className="flex gap-2">
            <noteSidebarUI.Library className="h-6 w-6" />
            <span className="my-auto">
              {title === "All" ? "All" : "My Note"}
            </span>
          </div>
          <div className="flex gap-2">
            <noteSidebarUI.ChevronDown className="h-6 w-6" />
          </div>
        </div>
      </noteSidebarUI.CollapsibleTrigger>

      <noteSidebarUI.CollapsibleContent>
        {/* Category add Dialog */}
        {title != "All" && (
          <noteSidebarUI.Dialog
            open={categoryState}
            onOpenChange={setCategoryState}
          >
            <noteSidebarUI.DialogTrigger className="w-full">
              <div className="flex justify-between px-4 py-1 cursor-pointer bg-secondary rounded-md mb-1">
                <div className="flex gap-2">
                  <span>Add Category</span>
                </div>
                <div className="flex gap-2">
                  <noteSidebarUI.Plus className="h-6 w-6 rounded-full" />
                </div>
              </div>
            </noteSidebarUI.DialogTrigger>
            <noteSidebarUI.DialogContent className="sm:max-w-[425px]">
              <noteSidebarUI.DialogHeader>
                <noteSidebarUI.DialogTitle>
                  Add category
                </noteSidebarUI.DialogTitle>
                <noteSidebarUI.DialogDescription className="pt-2">
                  Add category to your library here. Click save when you're
                  done.
                </noteSidebarUI.DialogDescription>
              </noteSidebarUI.DialogHeader>
              <form className="grid gap-4 py-4" onSubmit={HandleSubmit}>
                <div className="grid grid-cols-4 items-center gap-4">
                  <noteSidebarUI.Label htmlFor="title" className="text-right">
                    Category
                  </noteSidebarUI.Label>
                  <noteSidebarUI.Input
                    id="title"
                    name="title"
                    placeholder="Category"
                    className="col-span-3"
                    onChange={HandleChange}
                    value={formData.title}
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <noteSidebarUI.Label htmlFor="user" className="text-right">
                    User
                  </noteSidebarUI.Label>
                  <noteSidebarUI.Input
                    id="user"
                    name="user"
                    placeholder="@user"
                    className="col-span-3"
                    onChange={HandleChange}
                    value={formData.user}
                    disabled
                  />
                </div>
                <noteSidebarUI.DialogFooter>
                  <noteSidebarUI.DialogClose
                    className={noteSidebarUI.buttonVariants()}
                    onClick={() => {
                      postMutation.mutate({
                        url: `${
                          base_url
                        }/Notes/create/category/${formData.title}`,
                        method: "POST",
                        formData,
                        token: currentUser?.ID_TOKEN,
                      });
                    }}
                  >
                    Save changes
                  </noteSidebarUI.DialogClose>
                </noteSidebarUI.DialogFooter>
              </form>
            </noteSidebarUI.DialogContent>
          </noteSidebarUI.Dialog>
        )}

        {/* Category items */}
        <div className="flex w-full flex-row py-1 px-4 rounded-md hover:bg-accent hover:cursor-pointer group">
          <Link
            to={`/Notes/${title != "All" ? currentUser?.email : ""}`}
            className="basis-[89%]"
            onClick={() => setOpenSheet && setOpenSheet((prev) => !prev)}
          >
            <span className="">All</span>
          </Link>
        </div>
        {isSuccess &&
          data.map((category: categoryType) => (
            <NoteCategoryForm
              category={category}
              key={category.id}
              currentUser={currentUser}
              title={title}
              setOpenSheet={setOpenSheet}
            />
          ))}
      </noteSidebarUI.CollapsibleContent>
    </noteSidebarUI.Collapsible>
  );
}
