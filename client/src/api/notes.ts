import { categoryType, mutationType } from "@/types";
import { QueryKey } from "@tanstack/react-query";

export const base_url = `/api`;

export async function getNotes({
  pageParam = 0,
  queryKey,
}: {
  pageParam: number;
  queryKey: QueryKey;
}) {
  const [_key, user, category, title] = queryKey;
  const userQuery = user ? user : "";
  const categoryQuery = category ? `/${category}` : "";
  const searchQuery = title ? `&search=${title}` : "";

  const response = await fetch(
    `${base_url}/Notes/category/${userQuery}${categoryQuery}?offset=${pageParam}${searchQuery}`
  );

  return response.json();
}

export async function getCategory(): Promise<categoryType[]> {
  const response = await fetch(`${base_url}/Notes/categorylist`);

  return response.json();
}

export async function getPinList({ queryKey }: { queryKey: QueryKey }) {
  const [_key, token] = queryKey;

  if (token) {
    const response = await fetch(`${base_url}/Notes/pinnedNotes/`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  }
  return Promise.reject("No token provided.");
}

export async function fetchNote<T>({
  url,
  method,
  formData,
  token = "undefined",
}: mutationType): Promise<T> {
  const response = await fetch(url, {
    method: method,
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });

  return response.json();
}
