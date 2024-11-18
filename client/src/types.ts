import { LanguageName } from "@uiw/codemirror-extensions-langs";

export type HTTPmethods = "put" | "patch" | "get" | "POST" | "delete";

export type categoryType = {
  id: number;
  title: string;
  user: string;
  token?: string | Promise<string>;
};
export type noteType = {
  id: number;
  title: string;
  user: string;
  category: string;
  message: string;
  format: string | LanguageName;
  pin: number;
  DateCreated: string;
  token?: string | Promise<string>;
};

export type noteformatType = {
  value: string;
  label: string;
};

export type noteCardType = {
  note: noteType;
  pin?: boolean;
};

export type feedbackFormType = {
  title: string;
  message: string;
  email: string;
  name: string;
  feedback: string;
};

export type mutationType = {
  url: string;
  method: HTTPmethods;
  formData: noteType | categoryType | feedbackFormType;
  token?: string | Promise<string>;
};
