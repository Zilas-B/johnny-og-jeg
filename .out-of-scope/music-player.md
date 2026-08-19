# Fungerende musikafspiller ("Cash Radio")

**Decision:** Rejected. The site will not play music. The Cash Radio UI is being removed entirely.

**Reason:**

Playing Johnny Cash recordings requires clearing two separate copyrights — the
composition (Koda/NCB) and the master recording (the label, mostly Sony/Legacy).
Neither is realistically obtainable for a small editorial site, and there is no
short-excerpt exception in Danish or EU copyright law.

The compliant alternatives all fail on their own terms:

- **YouTube IFrame API** — legal via embedding (Svensson/BestWater/GS Media), but
  YouTube's API Services Terms require the player to stay visible and unobscured
  (min. 200×200px). A hidden audio-only player driven by our own vinyl chrome is
  a ToS violation. Keeping the player visible means a video panel that does not
  belong in the design.
- **Spotify embed** — legal, but renders Spotify's own un-restylable chrome and
  serves only 30-second previews to logged-out visitors. The Cash Radio design
  does not survive it.
- **Self-hosted audio** — needs the licences above. Not viable.

Note: Cash's Sun-era recordings (1955–1962) are likely public domain *as sound
recordings* in the EU, since the 2011 term extension only revived recordings
still protected on 1 Nov 2013. This does not help — the *compositions* run until
2073 (Cash died in 2003), so even those tracks cannot be self-hosted freely.

A link-out-only player (chips linking to YouTube/Spotify) was considered and also
rejected: it keeps a large piece of fixed page chrome that no longer does
anything, on every page, for the sake of three outbound links that belong in the
article text instead.

**Prior requests:**

- [#1 — Music player](https://github.com/Zilas-B/johnny-og-jeg/issues/1)
- [#7 — Forsiden](https://github.com/Zilas-B/johnny-og-jeg/issues/7), first bullet
  ("Få lyden i bunden til at virke, sæt op med enten Spotify eller Youtube")

**If this is ever revisited:** the only design that clears both the law and the
platform terms is a visible YouTube embed presented as a video, not as a radio.
That is a different feature with a different design, not a revival of Cash Radio.
