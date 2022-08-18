import classNames from "classnames";
import * as React from "react";
import ReactLoading from "react-loading";

export const Button = ({
  loading = false,
  children,
  className,
  ...rest
}: { loading?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={classNames(
        "relative overflow-hidden rounded bg-primary px-2 py-1 uppercase text-white transition hover:bg-opacity-80 active:bg-opacity-70 disabled:bg-opacity-100 disabled:opacity-60",
        className
      )}
      {...rest}
    >
      {children}
      {loading ? (
        <div className="absolute inset-0 m-px flex items-center justify-center rounded bg-black bg-opacity-60 backdrop-blur-[2px]">
          <ReactLoading width={18} height={18} type="spin" />
        </div>
      ) : null}
    </button>
  );
};

export const TextInput = (
  props: React.InputHTMLAttributes<HTMLInputElement>
) => (
  <input
    {...props}
    className={classNames(
      "rounded border border-black border-opacity-30 bg-black bg-opacity-20 px-2 py-1 transition placeholder:text-white placeholder:text-opacity-40 focus:outline-none disabled:opacity-60 dark:border-opacity-10 dark:bg-opacity-5 dark:placeholder:text-black dark:placeholder:text-opacity-40",
      props.className
    )}
  />
);

export const CheckBoxInput = (
  props: React.InputHTMLAttributes<HTMLInputElement>
) => (
  <input
    {...props}
    className={classNames(
      "form-check-input mt-1 mr-2 h-4 w-4 cursor-pointer appearance-none rounded border border-black border-opacity-30 bg-black bg-opacity-20 bg-contain bg-center bg-no-repeat align-top transition checked:border-primary checked:bg-primary focus:outline-none",
      props.className
    )}
    type="checkbox"
  />
);
