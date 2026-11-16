'use client';

import React, { useState, useEffect, useRef } from 'react';

const VIRTUAL_DESKTOP_WIDTH = 1440;

interface LiveProjectPreviewProps {
  liveUrl: string;
  title: string;
  aspectRatio?: '16/9' | '16/10';
}

export default function LiveProjectPreview({
  liveUrl,
  title,
  aspectRatio = '16/10',
}: LiveProjectPreviewProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const defaultHeight = aspectRatio === '16/9' ? 810 : 900;
  const [scale, setScale] = useState(0.36);
  const [virtualHeight, setVirtualHeight] = useState(defaultHeight);
  const [isTopWindow, setIsTopWindow] = useState(true);

  useEffect(() => {
    // Prevent recursive nesting if portfolio is ever viewed inside an iframe
    if (typeof window !== 'undefined' && window.self !== window.top) {
      setIsTopWindow(false);
      return;
    }

    const el = viewportRef.current;
    if (!el) return;

    const updateDimensions = () => {
      if (el.clientWidth > 0 && el.clientHeight > 0) {
        const nextScale = el.clientWidth / VIRTUAL_DESKTOP_WIDTH;
        const nextHeight = Math.round(el.clientHeight / nextScale);
        setScale(nextScale);
        setVirtualHeight(nextHeight);
      }
    };
    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(el);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div ref={viewportRef} className="project-live-viewport">
      {isTopWindow && (
        <iframe
          src={liveUrl}
          title={title}
          loading="eager"
          tabIndex={-1}
          aria-hidden="true"
          className="project-live-iframe-ready"
          style={{
            width: `${VIRTUAL_DESKTOP_WIDTH}px`,
            height: `${virtualHeight}px`,
            transform: `scale(${scale})`,
          }}
        />
      )}
    </div>
  );
}
