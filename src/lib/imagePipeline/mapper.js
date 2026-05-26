import { getGeneratedLiveBindingIds } from "../../data/contentAssetBindings.js";

function isPlaceholderGeneratedAsset(path) {
  return typeof path === "string" && path.startsWith("/images/generated/") && path.endsWith(".svg");
}

function choosePrimaryAsset(generatedAsset, fallbackAsset) {
  if (!generatedAsset || isPlaceholderGeneratedAsset(generatedAsset)) {
    return fallbackAsset;
  }
  return generatedAsset;
}

function resolveGeneratedAssets(experience, manifest = {}) {
  for (const id of getGeneratedLiveBindingIds(experience)) {
    if (manifest[id]) {
      return { assets: manifest[id], bindingId: id };
    }
  }

  return { assets: undefined, bindingId: undefined };
}

export function mapGeneratedAssetsToExperience(experience, manifest = {}) {
  const { assets: generated, bindingId } = resolveGeneratedAssets(experience, manifest);
  if (!generated) return experience;
  const poster = choosePrimaryAsset(generated.poster, undefined);
  const hero = choosePrimaryAsset(generated.hero, undefined);
  const thumbnail = choosePrimaryAsset(generated.thumbnail, undefined);
  const rail = choosePrimaryAsset(generated.rail, undefined);
  const story = choosePrimaryAsset(generated.story, undefined);
  const creatorbanner = choosePrimaryAsset(generated.creatorbanner, undefined);
  const primaryVisual = poster || thumbnail || rail || story || creatorbanner || hero || experience.image;
  const heroVisual = hero || creatorbanner || rail || thumbnail || poster || experience.heroImage || primaryVisual;
  const thumbnailVisual = thumbnail || rail || poster || story || creatorbanner || experience.thumbnailImage || primaryVisual;

  return {
    ...experience,
    generatedAssetBindingId: bindingId,
    generatedImages: {
      ...generated,
      poster: poster || generated.poster,
      hero: hero || generated.hero,
      thumbnail: thumbnail || generated.thumbnail,
      rail: rail || generated.rail,
      story: story || generated.story,
      creatorbanner: creatorbanner || generated.creatorbanner,
    },
    image: primaryVisual,
    heroImage: heroVisual,
    thumbnailImage: thumbnailVisual,
  };
}

export function mapGeneratedAssetsToExperiences(experiences = [], manifest = {}) {
  return experiences.map(experience => mapGeneratedAssetsToExperience(experience, manifest));
}
