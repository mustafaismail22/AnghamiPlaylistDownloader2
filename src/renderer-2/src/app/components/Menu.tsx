import classNames from "classnames";
import * as React from "react";

type MenuWrapperProps = {
  open: boolean;
};

const MenuWrapper = ({
  children,
  open,
  className,
  ...rest
}: React.HTMLProps<HTMLDivElement> & MenuWrapperProps) => (
  <div
    {...rest}
    className={classNames(
      "absolute top-[140%] right-0 z-50 w-44 rounded shadow-2xl transition-all duration-100",
      open
        ? "visible translate-y-0 opacity-100"
        : "invisible translate-y-4 opacity-0",
      className
    )}
  >
    <div className="flex flex-col gap-1">{children}</div>
    <div className="absolute -inset-1 -z-10 rounded bg-white bg-opacity-20 backdrop-blur-sm after:absolute after:top-0 after:right-[14.5px]  after:block after:-translate-y-full after:border-[8px] after:border-transparent after:border-b-white after:opacity-20 dark:bg-black dark:bg-opacity-30 dark:after:border-b-black dark:after:opacity-30"></div>
  </div>
);

export const MenuItem = (props: React.HTMLProps<HTMLButtonElement>) => (
  <button
    {...props}
    type="button"
    className="flex items-center gap-2 rounded bg-white bg-opacity-10 px-3 py-2 text-sm uppercase text-white text-opacity-80 transition-all hover:bg-opacity-20 active:opacity-80 dark:bg-black dark:bg-opacity-20 dark:hover:bg-opacity-30"
  />
);

export const Menu = ({
  open = false,
  children,
  ...rest
}: { open: boolean } & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) => {
  return (
    <MenuWrapper open={open} {...rest}>
      {children}
    </MenuWrapper>
  );
};

export function useMenu(): [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>,
  React.RefObject<HTMLDivElement>
] {
  const [isOpen, toggleMenu] = React.useState<boolean>(false);
  const refNode = React.useRef<HTMLDivElement>(null);
  const toggleMenuCallback = React.useCallback(
    () => toggleMenu(false),
    [toggleMenu]
  );

  useOnClickOutside(refNode, toggleMenuCallback);
  return [isOpen, toggleMenu, refNode];
}

function useOnClickOutside(
  ref: React.RefObject<HTMLElement>,
  handler: (event: MouseEvent) => any
) {
  React.useEffect(() => {
    const listener = (event: MouseEvent) => {
      const current = ref && ref.current;
      if (!current || current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
    };
  }, [ref, handler]);
}
