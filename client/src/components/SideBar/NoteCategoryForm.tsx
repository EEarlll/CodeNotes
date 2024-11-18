import { categoryType } from "@/types";
import { categoryFormUI } from "@/components/SideBar/index";
import { Link } from "react-router-dom";
import { useCustomMutation } from "@/hooks/useCustomMutation";
import { base_url, fetchNote } from "@/api/notes";

export default function NoteCategoryForm({
  category,
  currentUser,
  title,
  setOpenSheet,
}: {
  category: categoryType;
  currentUser?: any;
  title?: string;
  setOpenSheet?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const deleteMutation = useCustomMutation<categoryType>({
    func: fetchNote,
    queryKey: ["userCategories", "All", "headerCategories"],
    formData: category,
  });

  return (
    <div className="flex w-full flex-row py-1 px-4 rounded-md hover:bg-accent hover:cursor-pointer group">
      <Link
        to={`/Notes/${
          currentUser?.email && title != "All"
            ? `${currentUser?.email}/${category?.title}`
            : `All/${category?.title}`
        }`}
        onClick={() => setOpenSheet && setOpenSheet((prev) => !prev)}
        className="basis-[89%]"
      >
        <span className="">{category ? category.title : "All"}</span>
      </Link>

      <categoryFormUI.AlertDialog>
        <categoryFormUI.AlertDialogTrigger asChild>
          {currentUser?.email == category?.user && category && (
            <div className=" hover:bg-red-600 hover:border h-6 rounded-full basis-[11%] opacity-0 group-hover:opacity-100">
              <categoryFormUI.X />
            </div>
          )}
        </categoryFormUI.AlertDialogTrigger>
        <categoryFormUI.AlertDialogContent>
          <categoryFormUI.AlertDialogHeader>
            <categoryFormUI.AlertDialogTitle>
              Are you absolutely sure?
            </categoryFormUI.AlertDialogTitle>
            <categoryFormUI.AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              item and remove it from our servers.
            </categoryFormUI.AlertDialogDescription>
          </categoryFormUI.AlertDialogHeader>
          <categoryFormUI.AlertDialogFooter>
            <categoryFormUI.AlertDialogCancel>
              Cancel
            </categoryFormUI.AlertDialogCancel>
            <categoryFormUI.AlertDialogAction
              onClick={async () => {
                deleteMutation.mutate({
                  url: `${base_url}/Notes/${
                    category?.id
                  }/delete/${category?.title}`,
                  method: "delete",
                  formData: category,
                  token: currentUser?.ID_TOKEN,
                });
              }}
            >
              Continue
            </categoryFormUI.AlertDialogAction>
          </categoryFormUI.AlertDialogFooter>
        </categoryFormUI.AlertDialogContent>
      </categoryFormUI.AlertDialog>
    </div>
  );
}
