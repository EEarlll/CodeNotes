import { signUpUI } from "@/components/Auth/index";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChangeEvent } from "react";
import { doPasswordReset, getMessageFromCode } from "@/firebase/auth";

export default function ForgotPass() {
  const [err, setErr] = useState<string | undefined>("");
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Function
  function HandleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }

  async function HandleSubmit(e: ChangeEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      await doPasswordReset(formData.email);
      setMessage(
        "A password reset email has been sent to your registered email address. Please check your inbox (and spam folder) for further instructions."
      );
    } catch (error: any) {
      setErr(getMessageFromCode(error.message));

      console.error(error);
    }
  }
  return (
    <div className="min-h-[100vh] w-full">
      <signUpUI.Card className="mx-auto max-w-sm relative top-[50%] translate-y-[25%]">
        <signUpUI.CardHeader>
          <signUpUI.CardTitle className="text-xl">
            Forgot Password
          </signUpUI.CardTitle>
          <signUpUI.CardDescription>
            Enter your information to forgot Password
          </signUpUI.CardDescription>
        </signUpUI.CardHeader>
        <signUpUI.CardContent>
          {err && (
            <signUpUI.Alert variant="destructive">
              <signUpUI.TriangleAlert className="h-4 w-4" />
              <signUpUI.AlertTitle>Error</signUpUI.AlertTitle>
              <signUpUI.AlertDescription>{err}</signUpUI.AlertDescription>
            </signUpUI.Alert>
          )}
          {message && (
            <signUpUI.Alert className="mb-4 border-none">
              <signUpUI.RocketIcon className="h-4 w-4" />
              <signUpUI.AlertTitle>Heads up!</signUpUI.AlertTitle>
              <signUpUI.AlertDescription>{message}</signUpUI.AlertDescription>
            </signUpUI.Alert>
          )}
          <form action="" onSubmit={HandleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <signUpUI.Label htmlFor="email">Email</signUpUI.Label>
                <signUpUI.Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="earleustacio@example.com"
                  required
                  onChange={HandleChange}
                />
              </div>
              <signUpUI.Button type="submit" className="w-full">
                Forgot Password
              </signUpUI.Button>
              {/* <signUpUI.Button variant="outline" className="w-full">
              Sign up with GitHub
            </signUpUI.Button> */}
            </div>
            <div className="mt-4 text-center text-sm">
              Login to an existing account?{" "}
              <Link to={"/SignIn"} className="underline">
                Sign in
              </Link>
              <div>
                Continue as a guest?{" "}
                <Link to={"/"} className="underline">
                  Home
                </Link>
              </div>
            </div>
          </form>
        </signUpUI.CardContent>
      </signUpUI.Card>
    </div>
  );
}
