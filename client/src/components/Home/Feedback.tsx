import React, { useState } from "react";
import { feedbackUi } from ".";
import { useTheme } from "../theme-provider";
import WhiteWave from "./white_wave.svg?react";
import BlackWave from "./black_wave.svg?react";
import { useCustomMutation } from "@/hooks/useCustomMutation";
import { fetchNote } from "@/api/notes";
import { feedbackFormType } from "@/types";

export default function Feedback() {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const { theme } = useTheme();
  const [formData, setFormData] = useState<feedbackFormType>({
    title: "Feedback",
    name: "Anonymous",
    email: "CodeNotes@gmail.com",
    message: "",
    feedback: "",
  });

  const postMutation = useCustomMutation<feedbackFormType>({
    func: fetchNote,
    queryKey: ["email"],
    formData: formData,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);

    postMutation.mutate({
      url: `${import.meta.env.VITE_URL}/email`,
      method: "POST",
      formData: formData,
    });

    setIsSubmitted(false);
    e.currentTarget.reset();
  };

  return (
    <div className="my-12 relative">
      <feedbackUi.Card className="w-full  md:max-w-xl mx-auto">
        <feedbackUi.CardHeader>
          <feedbackUi.CardTitle>Feedback Form</feedbackUi.CardTitle>
          <feedbackUi.CardDescription>
            We value your opinion. Please share your thoughts with us.
          </feedbackUi.CardDescription>
        </feedbackUi.CardHeader>
        <form onSubmit={handleSubmit}>
          <feedbackUi.CardContent className="space-y-4">
            <div className="space-y-2">
              <feedbackUi.Label htmlFor="name">Name</feedbackUi.Label>
              <feedbackUi.Input
                id="name"
                placeholder="Enter your name"
                name="name"
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <feedbackUi.Label htmlFor="email">Email</feedbackUi.Label>
              <feedbackUi.Input
                id="email"
                type="email"
                name="email"
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>
            <div className="space-y-2">
              <feedbackUi.Label>Rating</feedbackUi.Label>
              <feedbackUi.RadioGroup className="flex space-x-2" required>
                {[1, 2, 3, 4, 5].map((value) => (
                  <div key={value} className="flex items-center space-x-2">
                    <feedbackUi.RadioGroupItem
                      value={value.toString()}
                      id={`rating-${value}`}
                      onClick={(e) =>
                        setFormData({
                          ...formData,
                          feedback: (e.target as HTMLInputElement).value,
                        })
                      }
                    />
                    <feedbackUi.Label htmlFor={`rating-${value}`}>
                      {value}
                    </feedbackUi.Label>
                  </div>
                ))}
              </feedbackUi.RadioGroup>
            </div>
            <div className="space-y-2">
              <feedbackUi.Label htmlFor="message">Feedback</feedbackUi.Label>
              <feedbackUi.Textarea
                className="h-36"
                id="message"
                name="message"
                onChange={handleChange}
                placeholder="Please enter your feedback here"
                required
              />
            </div>
          </feedbackUi.CardContent>
          <feedbackUi.CardFooter>
            <feedbackUi.Button
              type="submit"
              className="w-full"
              disabled={isSubmitted}
            >
              {isSubmitted ? "Submitting..." : "Submit Feedback"}
            </feedbackUi.Button>
          </feedbackUi.CardFooter>
        </form>
      </feedbackUi.Card>
      {theme === "dark" ? (
        <WhiteWave className="w-[300px] md:w-[600px] absolute  right-0 translate-y-5 translate-x-1/2" />
      ) : (
        <BlackWave className="w-[300px] md:w-[600px] absolute  right-0 translate-y-5 translate-x-1/2" />
      )}
    </div>
  );
}
