import * as React from "react";
import { Scrollbars as CustomScrollbars } from "react-custom-scrollbars";

export function Scrollbars({
  children,
}: React.ComponentProps<typeof CustomScrollbars>) {
  const shadowTop = React.useRef<HTMLDivElement>(null);
  const shadowBottom = React.useRef<HTMLDivElement>(null);
  const [showPadding, setShowPadding] = React.useState(false);
  const handleOnScroll = React.useCallback((values) => {
    const { scrollTop, scrollHeight, clientHeight } = values;
    const shadowTopOpacity = (1 / 20) * Math.min(scrollTop, 20);
    const bottomScrollTop = scrollHeight - clientHeight;
    const shadowBottomOpacity =
      (1 / 20) * (bottomScrollTop - Math.max(scrollTop, bottomScrollTop - 20));

    setShowPadding(!(clientHeight >= scrollHeight));

    if (shadowTop.current && shadowBottom.current) {
      shadowTop.current.style.opacity = shadowTopOpacity.toString();
      shadowBottom.current.style.opacity = shadowBottomOpacity.toString();
    }
  }, []);

  return (
    <div className="relative h-full">
      <div ref={shadowTop} className="scrollbars-shadow shadowTop" />
      <div ref={shadowBottom} className="scrollbars-shadow shadowBottom" />
      <CustomScrollbars
        onUpdate={handleOnScroll}
        hideTracksWhenNotNeeded={true}
        renderView={({ style }) => (
          <div
            style={{
              ...style,
              paddingRight:
                ((showPadding && Math.abs(style.marginRight)) || 0) * 0.8,
            }}
            className="view !my-0 !overflow-x-hidden"
          />
        )}
        renderThumbVertical={({ style }) => (
          <div {...{ style }} className="scrollbars-thumb" />
        )}
        renderTrackVertical={({ style }) => (
          <div {...{ style }} className="scrollbars-track" />
        )}
        renderThumbHorizontal={({ style }) => (
          <div {...{ style }} className="scrollbars-thumb horizontal" />
        )}
        renderTrackHorizontal={({ style }) => (
          <div {...{ style }} className="scrollbars-track horizontal" />
        )}
      >
        {children}
      </CustomScrollbars>
    </div>
  );
}
