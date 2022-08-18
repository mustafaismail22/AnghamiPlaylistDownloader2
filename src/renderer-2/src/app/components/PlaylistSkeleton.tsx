import * as React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { IconReport } from "./Icons";
import {
  PlaylistRoot,
  PlaylistTrack,
  TrackImage,
  TrackTitle,
} from "./Playlist";
import { Scrollbars } from "./Scrollbars";

export function PlaylistSkeleton() {
  return (
    <Scrollbars>
      <PlaylistRoot>
        <SkeletonTheme
          baseColor="rgba(0,0,0,0.1)"
          highlightColor="rgba(0,0,0,0.2)"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <PlaylistTrack
              className="skeleton cursor-auto !bg-black !bg-opacity-20"
              key={i}
            >
              <TrackImage skeleton />
              <TrackTitle className="leading-[0px]">
                <Skeleton className="mb-1" height={15} />
                <div className="flex gap-2">
                  <Skeleton inline height={10} width={100} />
                  <Skeleton inline height={10} width={60} />
                </div>
              </TrackTitle>
            </PlaylistTrack>
          ))}
        </SkeletonTheme>
      </PlaylistRoot>
    </Scrollbars>
  );
}

export function PlayListError() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2">
      <IconReport className="h-12 w-12 fill-black opacity-20" />
      <p className="text-lg">Oops! Something went wrong.</p>
    </div>
  );
}
