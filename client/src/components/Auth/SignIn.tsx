import { ChangeEvent, useEffect, useState } from "react";
import { signInUI } from "@/components/Auth/index";
import { Link, useNavigate } from "react-router-dom";
import {
  doSignInWithEmailAndPassword,
  getMessageFromCode,
} from "@/firebase/auth";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/firebase/firebase";

export default function SignIn() {
  const navigate = useNavigate();
  const [err, setErr] = useState<string | undefined>("");
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

  // Functions
  function HandleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }

  async function HandleSubmit(e: ChangeEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      const { user } = await doSignInWithEmailAndPassword(
        formData.email,
        formData.password
      );
      navigate(`/Notes/${user.email}`);
    } catch (error: any) {
      setErr(getMessageFromCode(error.message));

      console.error(error);
    }
  }

  return (
    <div className="w-full lg:grid lg:min-h-[100vh] lg:grid-cols-2 xl:min-h-[100vh] dark:bg-black">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          {err && (
            <signInUI.Alert variant="destructive">
              <signInUI.TriangleAlert className="h-4 w-4" />
              <signInUI.AlertTitle>Error</signInUI.AlertTitle>
              <signInUI.AlertDescription>{err}</signInUI.AlertDescription>
            </signInUI.Alert>
          )}
          <form className="grid gap-4" onSubmit={HandleSubmit}>
            <div className="grid gap-2">
              <signInUI.Label htmlFor="email">Email</signInUI.Label>
              <signInUI.Input
                id="email"
                type="email"
                name="email"
                onChange={HandleChange}
                placeholder="earleustacio@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <signInUI.Label htmlFor="Password">Password</signInUI.Label>
              <signInUI.Input
                id="password"
                type="password"
                name="password"
                required
                onChange={HandleChange}
              />
            </div>
            <div className="grid gap-2 text-xs">
              <Link
                to="/Forgot-password"
                className="ml-auto inline-block text-sm underline"
              >
                Forgot your password?
              </Link>
            </div>

            <signInUI.Button type="submit" className="w-full">
              Login
            </signInUI.Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link to={"/SignUp"} className="underline">
              Sign up
            </Link>
            <div>
              Continue as a guest?{" "}
              <Link to={"/Notes"} className="underline">
                Home
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src={"/login.jpg"}
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
