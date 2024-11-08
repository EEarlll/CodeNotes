import { useParams, useSearchParams } from "react-router-dom";
import NotesHeader from "@/components/Notes/NotesHeader";
import NotesContent from "@/components/Notes/NotesContent";
import { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function Notes() {
  const { user, category } = useParams<string>();
  const [_, setDataKey] = useState<number>(0);
  let [searchParams] = useSearchParams();
  const [search, setSearch] = useState<string | null>("");
  
  useEffect(() => {
    if (searchParams.get("search")) {
      setSearch(searchParams.get("search"));
    } else {
      setSearch("");
    }
  }, [searchParams]);

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold md:text-2xl">
          <Breadcrumb className="pl-8">
            <BreadcrumbList>
              <BreadcrumbItem>
                {user && <BreadcrumbLink>{user}</BreadcrumbLink>}
              </BreadcrumbItem>
              {user && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                <BreadcrumbLink>{category ? category : "All"}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Notes</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <NotesHeader setDataKey={setDataKey} />
      </div>
      <div
        className="rounded-lg  shadow-sm md:12 w-full"
        x-chunk="dashboard-02-chunk-1"
      >
        <NotesContent user={user} category={category} search={search} />
      </div>
    </>
  );
}
