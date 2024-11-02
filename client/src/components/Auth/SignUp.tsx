import { signUpUI } from "@/components/Auth/index";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChangeEvent } from "react";
import {
  doCreateUserWithEmailAndPassword,
  getMessageFromCode,
} from "@/firebase/auth";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/firebase/firebase";

export default function SignUp() {
  const navigate = useNavigate();
  const [err, setErr] = useState<string | undefined>("");
  const [msg, setMsg] = useState<string>("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  // Check if user is loggedin
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        navigate(`/Notes/${user.email}`);
      }
    });
    return unsubscribe;
  }, []);

  // Function
  function HandleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }

  async function HandleSubmit(e: ChangeEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      await doCreateUserWithEmailAndPassword(formData.email, formData.password);
      setMsg("Successfully Created Account");
      navigate("/SignIn");
    } catch (error: any) {
      setErr(getMessageFromCode(error.message));

      console.error(error);
    }
  }
  return (
    <div className="min-h-[100vh] w-full">
      <signUpUI.Card className="mx-auto max-w-sm relative top-[50%] translate-y-[25%]">
        <signUpUI.CardHeader>
          <signUpUI.CardTitle className="text-xl">Sign Up</signUpUI.CardTitle>
          <signUpUI.CardDescription>
            Enter your information to create an account
          </signUpUI.CardDescription>
        </signUpUI.CardHeader>
        <signUpUI.CardContent>
          {msg && (
            <signUpUI.Alert>
              <signUpUI.TriangleAlert className="h-4 w-4" />
              <signUpUI.AlertTitle>Message</signUpUI.AlertTitle>
              <signUpUI.AlertDescription>{msg}</signUpUI.AlertDescription>
            </signUpUI.Alert>
          )}
          {err && (
            <signUpUI.Alert variant="destructive">
              <signUpUI.TriangleAlert className="h-4 w-4" />
              <signUpUI.AlertTitle>Error</signUpUI.AlertTitle>
              <signUpUI.AlertDescription>{err}</signUpUI.AlertDescription>
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
              <div className="grid gap-2">
                <signUpUI.Label htmlFor="password">Password</signUpUI.Label>
                <signUpUI.Input
                  id="password"
                  type="password"
                  name="password"
                  required
                  onChange={HandleChange}
                />
              </div>
              <signUpUI.Button type="submit" className="w-full">
                Create an account
              </signUpUI.Button>
              {/* <signUpUI.Button variant="outline" className="w-full">
              Sign up with GitHub
            </signUpUI.Button> */}
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to={"/SignIn"} className="underline">
                Sign in
              </Link>
              <div>
                Continue as a guest?{" "}
                <Link to={"/Notes/"} className="underline">
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
