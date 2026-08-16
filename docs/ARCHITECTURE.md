# NaadByte — Project Architecture

The homepage design, layout, colors, typography and animations are **locked**.
This document describes the data/architecture layer that sits behind it.

## Layer model

```text
        UI (locked design)
  src/components/{layout,sections,cards,common}
                 |
                 v  consumes only typed data
        Service layer (ports)
  src/services/content-service.ts   -> select.* (sync) + contentService (async)
  src/services/song-request-service.ts
                 |
                 v  provider implementation
        Provider (swappable)
  src/services/providers/local-content-provider.ts        (mock data / fallback)
  src/services/providers/wordpress/wordpress-content-provider.ts (CMS)
  src/services/providers/fallback-content-provider.ts     (WP -> local safety net)
                 |
                 v
        Data source
  src/data/*.ts  (typed mock records)   |  WP REST API / any headless CMS
```

Types (`src/types`) are the contract shared by every layer.

## Folder structure

```text
src/
  types/          Domain models — the CMS-agnostic contract
    common.ts       ID, Slug, ImageRef, LinkRef, PublishStatus, Paginated…
    site.ts         SiteConfig, NavItem, section copy types
    platform.ts     Platform, PlatformKey, StreamingLink
    song.ts         Song
    album.ts        Album, FeaturedRelease
    genre.ts        Genre
    video.ts        Video
    artist.ts       Artist            (future-ready)
    testimonial.ts  Testimonial       (future-ready)
    blog.ts         BlogPost
    social.ts       SocialPost        (Instagram / Reels)
    audio.ts        AudioTrack, AudioPlayerState, AudioPlayerControls
    song-request.ts SongRequest       ("Create Your Song")
  data/           Mock records implementing those models
    assets.ts       All bundled media references in one place
    site.ts, platforms.ts, genres.ts, albums.ts, songs.ts, videos.ts,
    artists.ts, testimonials.ts, blog.ts, song-requests.ts
  content/
    sections.ts     Editorial copy for every homepage section
  services/
    content-service.ts        Active provider + synchronous selectors
    song-request-service.ts   Submission port for bespoke song requests
    providers/
      content-provider.ts        The ContentProvider interface
      local-content-provider.ts  Mock-data implementation
      fallback-content-provider.ts  Wraps a remote provider with a local fallback
      wordpress/config.ts        Env config + wpFetch (timeout, per_page, _embed)
      wordpress/mappers.ts       WP REST payloads -> domain models
      wordpress/wordpress-content-provider.ts  ContentProvider over WP REST
    audio-player.ts   Framework-agnostic audio store (play/pause/seek/queue)
  components/     Presentation only — no hardcoded copy or data
  routes/         TanStack Start routes
```

## Rules

1. **Components never hardcode content.** Copy comes from `@/content/sections`,
   catalogue data from `@/services` (`select.*`), media from `@/data/assets`.
2. **Only `src/services` knows where data comes from.** Components import
   `select` / `contentService`, never a provider or a raw `src/data` file
   (the one exception is `@/data/assets` and `@/data/site` for brand chrome).
3. **Types live in `src/types`** and are imported with `import type`.
4. **Nothing is computed at render time that can differ between server and
   client** (e.g. the copyright year is a static value in `data/site.ts`).
5. Editorial ordering is data, not code: `order` fields and the
   `featuredReleases` curation list drive what renders and in what sequence.

## Data relationships

```text
Artist 1─* Song *─1 Album
Album  *─* Genre       (Album.genreIds)
Song   *─* Genre       (Song.genreIds)
Video  *─1 Album/Song  (Video.albumId / Video.songId)
FeaturedRelease 1─1 Album  (curated homepage ordering)
Album/Song 1─* StreamingLink ─1 Platform (by PlatformKey)
```

## Adding content

- New album: add to `src/data/albums.ts`, its tracks to `src/data/songs.ts`,
  then add a `FeaturedRelease` entry if it should appear on the homepage.
- New genre / video / platform: append to the matching file in `src/data`.
- New copy: edit `src/content/sections.ts`.

No component edits are required in any of these cases.

## Migrating to WordPress or another headless CMS

1. Create `src/services/providers/wordpress-content-provider.ts` implementing
   the `ContentProvider` interface (`src/services/providers/content-provider.ts`),
   mapping WP REST payloads onto the types in `src/types`.
   Suggested mapping: `album`, `song`, `genre`, `video`, `artist`,
   `testimonial`, `song_request` custom post types; `post` → `BlogPost`;
   featured images → `ImageRef`; ACF repeaters → `streamingLinks`.
2. Point `contentService` in `src/services/content-service.ts` at the new
   provider (fetching should happen in a server function or route loader so
   credentials stay server-side).
3. Move sections that need remote data from the synchronous `select.*` helpers
   to a route `loader` + `useSuspenseQuery`, passing the same typed props into
   the same components.

Because the interface and the models do not change, **no component markup,
styling or animation changes are required**.

## Future-ready surfaces

`Testimonial`, `BlogPost`, `Artist` and `SongRequest` are fully modelled with
mock data and provider methods, but intentionally not rendered — no new pages
or sections were added. When those features are built they only need UI.

## Content management (WordPress)

WordPress is the **administration layer**; this React app is the presentation
layer. There is deliberately no custom admin UI inside the website.

```text
WordPress (editors)  --REST-->  wordpressContentProvider
                                        |
                                withFallback(local)
                                        |
                                  contentService  -->  UI
```

- Provider selection happens once in `src/services/content-service.ts`, driven by
  `VITE_CONTENT_PROVIDER` and `VITE_WORDPRESS_API_URL`.
- `withFallback` retries every read against the local catalogue when the CMS
  errors, times out or returns an empty collection, so the public site never
  breaks because of the CMS.
- Only published, public content is read from the browser. Writes (song requests)
  must go through a server function holding `WORDPRESS_APP_PASSWORD`.
- Featured placement is editorial data (`featured` / `featured_order` fields,
  mapped to `isFeatured` / `featuredOrder`), not a hardcoded array.

Field-by-field mapping and the editor workflow are documented in the README.

## Audio architecture

`src/services/audio-player.ts` holds a single module-level store wrapping one
`HTMLAudioElement`, exposed to React through `useSyncExternalStore` in
`src/hooks/useAudioPlayer.ts`. No provider needs to be mounted and the store is
SSR-safe.

- State: status, queue, index, currentTrack, currentTime, duration, volume,
  muted, error.
- Controls: play, playQueue, pause, toggle, stop, next, previous, seek,
  setVolume, setMuted.
- `songToTrack` / `songsToTracks` adapt catalogue `Song` records; songs without
  an `audioUrl` are skipped.
- Audio files are **never bundled** — `Song.audioUrl` points at WordPress media
  or any CDN. Player UI is intentionally not shipped yet.
