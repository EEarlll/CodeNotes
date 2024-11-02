import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Github, Mail, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t mt-12">
      <div className="container flex flex-col sm:flex-row items-center justify-between py-8 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <Link to="mailto:earleustacio@gmail.com">
            <Button variant="ghost" size="icon" aria-label="Email">
              <Mail className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="https://discord.com/users/349837652830191618">
            <Button variant="ghost" size="icon" aria-label="Discord">
              <MessageCircle className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="https://github.com/EEarlll">
            <Button variant="ghost" size="icon" aria-label="GitHub">
              <Github className="h-5 w-5" />
            </Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} CodeNotes. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
