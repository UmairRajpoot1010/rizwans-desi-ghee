// AnnouncementBar
// A reusable, continuously scrolling announcement strip that sits directly
// under the main navbar. Uses pure CSS keyframes (defined in tailwind.css)
// to create a smooth, seamless right‑to‑left marquee effect.

const MESSAGE =
  '*100% Purity Guarantee:* Agar aap mutmain nahi, toh paisa wapis';

function AnnouncementItem() {
  return (
    <div className="flex items-center gap-3">
      <span className="whitespace-nowrap text-xs sm:text-sm font-medium text-white">
        {MESSAGE}
      </span>
      {/* Visual divider dot between repeated items */}
      <span
        aria-hidden="true"
        className="inline-block h-1 w-1 rounded-full bg-white/80"
      />
    </div>
  );
}

export function AnnouncementBar() {
  return (
    <div className="w-full border-y border-black/20 bg-black">
      {/* Height ~44px on desktop, slightly smaller on mobile */}
      <div className="group relative mx-auto flex h-10 sm:h-11 max-w-full items-center overflow-hidden">
        {/* The inner track holds two identical sequences of text.
            We animate the entire track from translateX(0) to translateX(-50%).
            Because the content is duplicated, when the first half slides out,
            the second half is already in place, giving a seamless loop. */}
        <div className="flex w-max items-center gap-6 pr-6 animate-announcement-marquee group-hover:[animation-play-state:paused]">
          {/* First sequence */}
          <AnnouncementItem />
          <AnnouncementItem />
          <AnnouncementItem />
          <AnnouncementItem />

          {/* Duplicate sequence for seamless infinite scrolling */}
          <AnnouncementItem />
          <AnnouncementItem />
          <AnnouncementItem />
          <AnnouncementItem />
        </div>
      </div>
    </div>
  );
}

