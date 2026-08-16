/**
 * Single place where bundled media is referenced.
 * A CMS adapter replaces these with remote URLs — nothing else changes.
 */

const logoMarkUrl = "/assets/logo-mark.png";
const logoFullUrl = "/assets/logo-full.png";
const heroUrl = "/assets/hero-page-Naadbyte.png";
const flagshipStudioUrl = "/assets/flagship-studio-bg.png";
const nebulaUrl = "/assets/Nebula.png";
const latestReleaseSunriseUrl = "/assets/latest-release-sunrise.png";
const musicWorldsBackdropUrl = "/assets/music-worlds-backdrop.png";

import albumShiva from "@/assets/album-shiva-within.jpg";
import albumEchoes from "@/assets/album-echoes.jpg";
import albumNeon from "@/assets/album-neon-mantra.jpg";
import albumRise from "@/assets/album-rise.jpg";
import genreDevotional from "@/assets/genre-devotional.jpg";
import genreMotivation from "@/assets/genre-motivation.jpg";
import genreCinematic from "@/assets/genre-cinematic.jpg";
import genreEdm from "@/assets/genre-edm.jpg";
import genreEnglish from "@/assets/genre-english.jpg";
import genreHindi from "@/assets/genre-hindi.jpg";
import genrePunjabi from "@/assets/genre-punjabi.jpg";
import genreMeditation from "@/assets/genre-meditation.jpg";

export const brandAssets = {
  logo: logoMarkUrl,
  logoFull: logoFullUrl,
  logoAlt: "NaadByte logo — a golden eye formed by sound waves",
  heroBackground: heroUrl,
  heroBackgroundAlt:
    "Cinematic golden sound portal glowing above a still lake between a temple and a city skyline",
  flagshipStudioBackground: flagshipStudioUrl,
  nebulaBackground: nebulaUrl,
  latestReleaseSunrise: latestReleaseSunriseUrl,
  musicWorldsBackdrop: musicWorldsBackdropUrl,
};

export const albumArt = {
  shiva: albumShiva,
  echoes: albumEchoes,
  neon: albumNeon,
  rise: albumRise,
};

export const genreArt = {
  devotional: genreDevotional,
  motivation: genreMotivation,
  cinematic: genreCinematic,
  edm: genreEdm,
  english: genreEnglish,
  hindi: genreHindi,
  punjabi: genrePunjabi,
  meditation: genreMeditation,
};
