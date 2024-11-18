import { noteType } from "@/types";
import SkeletonLoader from "./SkeletonLoader";
import NoteCardForm from "./NoteCardForm";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getNotes, getPinList } from "@/api/notes";
import { useAuth } from "../Auth/AuthContextProvider";
import { useLocalStorage } from "@/hooks/useLocalStorageState";

export default function NotesContent({
  user,
  category,
  search,
}: {
  user: string | undefined;
  category: string | undefined;
  search: string | null;
}) {
  const { ref, inView } = useInView();
  const { currentUser } = useAuth();
  const [token, setToken] = useState<string>("");
  const [pinList] = useLocalStorage<number[]>("pinList", []);
  const { isSuccess, fetchNextPage, data, isLoading } = useInfiniteQuery({
    queryKey: ["notes", user, category, search],
    queryFn: getNotes,
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.length === 0) return undefined;
      return lastPageParam + 25;
    },
  });

  const pinnedNotes = useQuery({
    queryKey: ["notes", token],
    queryFn: getPinList,
    enabled: !!token,
  });

  useEffect(() => {
    if (currentUser) {
      setToken(currentUser?.ID_TOKEN);
    }
  }, [currentUser]);

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);
  return (
    <>
      <p className="pl-8 pt-4">Pinned Items</p>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        {currentUser &&
          token &&
          pinnedNotes.isSuccess &&
          pinnedNotes.data &&
          pinnedNotes?.data.map((note: noteType, index: number) => {
            return (
              <React.Fragment key={index}>
                {<NoteCardForm note={note} key={note.id} pin={true} />}
              </React.Fragment>
            );
          })}
        {isSuccess &&
          !currentUser &&
          data?.pages.flat().map((note: noteType, index: number) => {
            return (
              <React.Fragment key={index}>
                {pinList.includes(note.id) && (
                  <NoteCardForm note={note} key={note.id} pin={true} />
                )}
              </React.Fragment>
            );
          })}
      </div>
      <p className="pl-8">Others</p>

      <div className="columns-1 md:columns-3 lg:columns-4 justify-center">
        {isLoading && <SkeletonLoader />}
        {isSuccess &&
          currentUser &&
          token &&
          !pinnedNotes.isLoading &&
          pinnedNotes.data &&
          data?.pages
            .flat()
            .filter(
              (note: noteType) =>
                !pinnedNotes.data.some(
                  (pinnedNote: noteType) => pinnedNote.id === note.id
                )
            )
            .map((note: noteType) => (
              <React.Fragment key={note.id}>
                <NoteCardForm note={note} />
              </React.Fragment>
            ))}

        {isSuccess &&
          !currentUser &&
          data?.pages.flat().map((note: noteType, index: number) => {
            return (
              <React.Fragment key={index}>
                {<NoteCardForm note={note} key={note.id} />}
              </React.Fragment>
            );
          })}
      </div>
      <div ref={ref}></div>
    </>
  );
}
