import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function SkeletonLoader({
  skeletonNumber = 50,
}: {
  skeletonNumber?: number;
}) {
  return (
    <>
      {Array.from({ length: skeletonNumber }).map((_, index) => (
        <React.Fragment key={index}>
          <Skeleton>
            <div className="min-h-[350px] max-w-[250px] m-2 relative -z-50 overflow-hidden bg-transparent border-none">
            </div>
          </Skeleton>
        </React.Fragment>
      ))}
    </>
  );
}
