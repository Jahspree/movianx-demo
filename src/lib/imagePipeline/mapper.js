function isPlaceholderGeneratedAsset(path) {
  return typeof path === "string" && path.startsWith("/images/generated/") && path.endsWith(".svg");
}

function choosePrimaryAsset(generatedAsset, fallbackAsset) {
  if (!generatedAsset || isPlaceholderGeneratedAsset(generatedAsset)) {
    return fallbackAsset;
  }
  return generatedAsset;
}

export function mapGeneratedAssetsToExperience(experience, manifest = {}) {
  const generated = manifest[experience.id] || manifest[experience.storyId] || manifest[experience.title];
  if (!generated) return experience;
  const poster = choosePrimaryAsset(generated.poster, experience.image);
  const hero = choosePrimaryAsset(generated.hero, experience.heroImage || poster || experience.image);
  const thumbnail = choosePrimaryAsset(generated.thumbnail, experience.thumbnailImage || poster || experience.image);

  return {
    ...experience,
    generatedImages: generated,
    image: poster || thumbnail || hero || experience.image,
    heroImage: hero || experience.heroImage || poster || experience.image,
    thumbnailImage: thumbnail || poster || experience.thumbnailImage || experience.image,
  };
}

export function mapGeneratedAssetsToExperiences(experiences = [], manifest = {}) {
  return experiences.map(experience => mapGeneratedAssetsToExperience(experience, manifest));
}
