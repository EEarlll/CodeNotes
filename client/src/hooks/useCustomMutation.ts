import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useToast } from "./use-toast";
import { categoryType, noteType, HTTPmethods, feedbackFormType } from "@/types";

export function useCustomMutation<T>({
  func,
  queryKey,
  formData,
}: customMutationProp<T>) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: func,
    onSuccess: (data) => {
      queryKey.forEach((key) =>
        queryClient.invalidateQueries({ queryKey: [key] })
      );

      toast({
        title: `${formData ? formData.title : "Message:"}`,
        description: `${data}`,
      });
    },
  });
}

type customMutationProp<T> = {
  func: (args: {
    url: string;
    method: HTTPmethods;
    formData: noteType | categoryType | feedbackFormType;
    token?: string | Promise<string>;
  }) => Promise<T>;
  queryKey: string[];
  formData: noteType | categoryType | feedbackFormType | undefined;
};
