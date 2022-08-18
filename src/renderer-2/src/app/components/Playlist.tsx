import classNames from "classnames";
import React from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import ReactLoading from "react-loading";
import Skeleton from "react-loading-skeleton";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  downloadPlaylist,
  selectAllTracks,
  selectDownloadCount,
  selectIsActive,
  selectIsStopping,
  selectSelectedTracksCount,
  stopDownloadingPlaylist,
  tracksSelectors,
} from "../slices/playlistSlice";
import { Button } from "./Form";
import {
  IconCheckbox,
  IconCheckboxBlank,
  IconOffline,
  IconReport,
  IconTimer,
} from "./Icons";
import Img from "./Img";

export const PlaylistRoot = (props: React.HTMLProps<HTMLUListElement>) => (
  <ul {...props} className="my-px flex flex-col gap-2"></ul>
);

export const PlaylistTrack = React.forwardRef(
  (
    props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
      selected?: boolean;
      downloaded?: boolean;
    },
    ref: any
  ) => (
    <button
      {...props}
      ref={ref}
      className={classNames(
        "flex cursor-pointer items-center gap-2 rounded border border-black border-opacity-40 bg-opacity-10 px-2 py-1 text-left transition-all hover:bg-opacity-20 dark:border-opacity-20 dark:bg-opacity-5 dark:hover:bg-opacity-10",
        {
          "bg-black": !(props.downloaded || props.selected),
          "border-dashed bg-black ": props.selected && !props.downloaded,
          "border-dashed border-primary border-opacity-20 bg-primary dark:border-opacity-60":
            props.downloaded,
        },
        props.className
      )}
    />
  )
);

export const TrackImage = (props: {
  src?: string;
  skeleton?: boolean;
  bg?: string;
}) => (
  <figure
    style={{ ...(props.bg ? { backgroundColor: props.bg } : {}) }}
    className="relative h-9 w-9 shrink-0 overflow-hidden rounded bg-black bg-opacity-20 leading-none"
  >
    {props.skeleton ? (
      <Skeleton className="absolute inset-0 !h-full !w-full  !bg-transparent" />
    ) : (
      <Img
        src={props.src}
        loading="lazy"
        className="h-full w-full object-cover"
      />
    )}
  </figure>
);

export const TrackTitle = (props: React.HTMLProps<HTMLDivElement>) => {
  return (
    <div className={classNames("flex flex-grow flex-col", props.className)}>
      {props.children}
    </div>
  );
};

export const TrackActions = (props: {
  id: number;
  active: boolean;
  stopping: boolean;
  selected: boolean;
}) => {
  const trackState = useAppSelector(
    (state) => tracksSelectors.selectById(state, props.id)?.state
  );

  const trackProgress = useAppSelector(
    (state) => tracksSelectors.selectById(state, props.id)?.progress
  );

  const type = trackProgress?.type || "";
  const convert = ["convert-mp3", "convert"].includes(type);

  return (
    <div className="flex items-center justify-center gap-2">
      {trackState == "downloaded" ? (
        <IconOffline className="!h-6 !w-6 fill-primary" />
      ) : null}
      {trackState == "error" ? (
        <IconReport className="!h-6 !w-6 fill-white dark:fill-black  dark:opacity-80" />
      ) : null}
      {trackState == "waiting" ? (
        <IconTimer className="!h-6 !w-6 dark:fill-black dark:opacity-80" />
      ) : null}

      {trackState == "downloading" ? (
        <div className="flex items-center gap-2">
          <div
            className={classNames(
              "rounded p-1 px-2 text-xs text-white text-opacity-80 transition-all",
              convert ? "bg-yellow-700" : "bg-primary"
            )}
          >
            {convert ? "Converting" : "Downloading"}
          </div>
          {["song", "convert-mp3"].includes(type) ? (
            <div className="!h-5 !w-5">
              <CircularProgressbar
                value={trackProgress ? trackProgress.percent : 0}
                maxValue={100}
                strokeWidth={12}
                key={props.id + "-progress"}
                styles={buildStyles({
                  pathColor: convert
                    ? "var(--bg-yellow-700)"
                    : "var(--primary-color)",
                  trailColor: convert
                    ? "rgba(var(--bg-yellow-700-rgb), 0.25)"
                    : "rgba(var(--primary-color-rgb), 0.25)",
                  pathTransitionDuration: 0.3,
                })}
              />
            </div>
          ) : (
            <ReactLoading
              type="spin"
              color={convert ? "var(--bg-yellow-700)" : "var(--primary-color)"}
              className="!h-5 !w-5"
            />
          )}
        </div>
      ) : null}

      {!(props.active || trackState == "downloaded" || props.stopping) ? (
        props.selected ? (
          <IconCheckbox className="!h-6 !w-6 dark:fill-black dark:opacity-80" />
        ) : (
          <IconCheckboxBlank className="!h-6 !w-6 dark:fill-black dark:opacity-80" />
        )
      ) : null}
    </div>
  );
};

export const PlaylistFooter = (props: React.HTMLProps<HTMLDivElement>) => {
  const active = useAppSelector(selectIsActive);
  const stopping = useAppSelector(selectIsStopping);
  const selectedCount = useAppSelector((state) =>
    selectSelectedTracksCount(state)
  );

  const dispatch = useAppDispatch();

  return (
    <div {...props} className="flex gap-4">
      <Button
        type="button"
        onClick={() => {
          dispatch(downloadPlaylist());
        }}
        className="w-3/4"
        disabled={active || stopping || !selectedCount}
        loading={active}
      >
        Download
      </Button>
      <Button
        type="button"
        onClick={() => {
          dispatch(stopDownloadingPlaylist());
        }}
        className="w-1/4 bg-yellow-700"
        disabled={!active || stopping}
        loading={stopping}
      >
        Stop
      </Button>
    </div>
  );
};

export const PlaylistActions = () => {
  const dispatch = useAppDispatch();
  const selectedCount = useAppSelector((state) =>
    selectSelectedTracksCount(state)
  );
  const downloadCount = useAppSelector(selectDownloadCount);

  const active = useAppSelector(selectIsActive);
  const stopping = useAppSelector(selectIsStopping);

  return (
    <div className="flex justify-between gap-4 rounded bg-black bg-opacity-20 p-2 px-2 text-xs text-white text-opacity-80 dark:bg-opacity-5 dark:text-black dark:text-opacity-80">
      {(active || stopping) && (
        <div>
          {downloadCount} / {selectedCount} Downloaded
        </div>
      )}

      {!active && !stopping && (
        <>
          <div>
            {`${selectedCount} item${selectedCount > 1 ? "s" : ""} selected`}
          </div>
          <div>
            <button
              className="hover:text-primary"
              onClick={(e) => {
                e.preventDefault();
                dispatch(selectAllTracks(true));
              }}
            >
              Select All
            </button>{" "}
            /{" "}
            <button
              className="hover:text-primary"
              onClick={(e) => {
                e.preventDefault();
                dispatch(selectAllTracks(false));
              }}
            >
              Deselect All
            </button>
          </div>
        </>
      )}
    </div>
  );
};
