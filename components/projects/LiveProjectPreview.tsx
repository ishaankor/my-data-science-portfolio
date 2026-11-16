'use client';

import React, { useState, useEffect, useRef } from 'react';

const VIRTUAL_DESKTOP_WIDTH = 1440;

// Hosts that send `X-Frame-Options: DENY` use their live HTML+CSS mirror in /previews/
const MIRRORED_HOSTS: Record<string, string> = {
  'rigscouter.ishaankoradia.com': '/previews/rigscouter.html',
};

function getMirroredHostPath(url: string): string | null {
  try {
    const parsed = new URL(url);
    return MIRRORED_HOSTS[parsed.hostname] || null;
  } catch {
    return null;
  }
}

function transformHtmlForSrcDoc(rawHtml: string, originUrl: string): string {
  const withoutScripts = rawHtml.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  const baseInjection = `<head><base href="${originUrl}/"><style>html,body{overflow:hidden !important;}</style>`;
  return withoutScripts.replace(/<head>/i, baseInjection);
}

interface LiveProjectPreviewProps {
  liveUrl: string;
  title: string;
  fallbackImage?: string;
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
  const [liveSrcDoc, setLiveSrcDoc] = useState<string | null>(null);

  const mirroredPath = getMirroredHostPath(liveUrl);

  useEffect(() => {
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

  // For X-Frame-Options blocked hosts, silently fetch live HTML on every visit
  useEffect(() => {
    if (!mirroredPath || !isTopWindow) return;
    let cancelled = false;

    const origin = new URL(liveUrl).origin;
    fetch(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(liveUrl)}`)
      .then((res) => (res.ok ? res.text() : Promise.reject(new Error('Proxy error'))))
      .then((html) => {
        if (!cancelled && html && html.includes('<html')) {
          setLiveSrcDoc(transformHtmlForSrcDoc(html, origin));
        }
      })
      .catch(() => {
        // Prebuild mirror in /previews/rigscouter.html stays active if proxy is rate-limited
      });

    return () => {
      cancelled = true;
    };
  }, [mirroredPath, isTopWindow, liveUrl]);

  return (
    <div ref={viewportRef} className="project-live-viewport">
      {isTopWindow && (
        <iframe
          src={liveSrcDoc ? undefined : mirroredPath || liveUrl}
          srcDoc={liveSrcDoc || undefined}
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
