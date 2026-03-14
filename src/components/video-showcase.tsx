"use client";

import { useState } from "react";

const HOMEPAGE_VIDEO_PATH = "/homepage-demo.mp4";

export function VideoShowcase() {
  const [hasError, setHasError] = useState(false);

  return (
    <section className="video-card">
      <div className="video-card__copy">
        <p className="eyebrow">Homepage video</p>
        <h3>See how teams move from freight search to booking and execution in one flow.</h3>
        <p>
          Watch the platform walkthrough to understand how rate comparison, procurement control,
          and shipment visibility come together in a single digital freight experience.
        </p>
        <span className="video-card__name">Platform walkthrough</span>
      </div>
      <div className="video-card__player">
        {hasError ? (
          <div className="video-card__placeholder">
            <strong>Video file not found</strong>
            <p>
              Place <code>homepage-demo.mp4</code> inside the <code>public/</code> folder.
            </p>
          </div>
        ) : (
          <video
            autoPlay
            controls
            loop
            muted
            playsInline
            preload="metadata"
            src={HOMEPAGE_VIDEO_PATH}
            onError={() => setHasError(true)}
          />
        )}
      </div>
    </section>
  );
}
