import classNames from "classnames";
import React from "react";
import ReactLoading from "react-loading";
import { Button } from "./Form";
import { IconArrowBack } from "./Icons";

export const Page = (props: {
  title: string;
  children: React.ReactNode;
  loading?: boolean;
  fullScreen?: boolean;
  goBack?: () => any;
}) => {
  return (
    <div className={classNames("py-4", props.fullScreen && "h-full pb-2")}>
      <div
        className={classNames(
          "relative rounded border border-black border-opacity-30 px-2 pt-4 pb-2 dark:border-opacity-20",
          props.fullScreen && "h-full pb-4"
        )}
      >
        <div className="page-title absolute top-0 z-30 flex -translate-y-1/2 gap-2 rounded border border-black border-opacity-30 px-2 py-1 font-bold dark:border-opacity-20">
          {props.goBack ? (
            <Button
              type="button"
              className="flex h-6 w-6 items-center justify-center rounded-full px-0 py-0"
            >
              <IconArrowBack width={18} height={18} onClick={props.goBack} />{" "}
            </Button>
          ) : null}
          {props.title}
        </div>
        {props.loading ? (
          <div className="absolute inset-0 z-20 m-1 flex items-center justify-center rounded bg-black bg-opacity-40 backdrop-blur-[2px]">
            <ReactLoading type="spin" className="!h-8 !w-8" />
          </div>
        ) : null}

        <div className="mt-2 h-full flex-1">{props.children}</div>
      </div>
    </div>
  );
};
