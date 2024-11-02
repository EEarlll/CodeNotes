import React from "react";
import { Book, Code, Users, Zap } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";

function FeatureCard({ icon, title, description }: featureCardType) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">About CodeNotes</h1>

      <div className="max-w-3xl mx-auto space-y-6">
        <p className="text-lg text-center mb-12">
          CodeNotes is your digital companion for learning and mastering
          programming. We provide a platform for developers of all levels to
          create, share, and explore coding notes, snippets, and tutorials.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureCard
            icon={<Book className="h-8 w-8" />}
            title="Comprehensive Learning"
            description="Access a wide range of programming topics and languages."
          />
          <FeatureCard
            icon={<Code className="h-8 w-8" />}
            title="Accessible Notes"
            description="Browse notes and use snippets for future use."
          />
          <FeatureCard
            icon={<Users className="h-8 w-8" />}
            title="Community-Driven"
            description="Join a thriving community of developers. Share your knowledge and learn from others."
          />
          <FeatureCard
            icon={<Zap className="h-8 w-8" />}
            title="Always Up-to-Date"
            description="Stay current with the latest programming trends, best practices, and industry standards."
          />
        </div>

        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Purpose of This Site</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              I created this site to enhance my note-taking experience. I often
              found Google Notes lacking in functionality, and while I
              appreciated GitHub’s approach to displaying code snippets,
              navigating through files just to find one was inconvenient. This
              project draws inspiration from platforms like CodePen and was
              crafted specifically to suit my needs. If you're here, I’d
              appreciate your feedback on the user experience. Thank you for
              taking the time to explore this site! 😊
            </p>
          </CardContent>
        </Card>

        <div className="text-center mt-12">
          <h2 className="text-2xl font-semibold mb-4">Join Us Today</h2>
          <p className="mb-6">Become a part of our growing community.</p>
          <Link
            to="/signUp"
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-md text-lg font-medium"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}

type featureCardType = {
  title: string;
  description: string;
  icon: React.ReactNode;
};
