import classNames from "classnames";
import * as React from "react";

export default function Img(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [loading, setLoading] = React.useState(true);
  const lazy = props.loading == "lazy";
  const onLoad = React.useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <img
      {...props}
      onLoad={onLoad}
      onError={onLoad}
      className={classNames(
        lazy && "opacity-0 transition-opacity duration-200 ease-in-out",
        loading ? "loading" : "loaded opacity-100",
        props.className
      )}
    />
  );
}
