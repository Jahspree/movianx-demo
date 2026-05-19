export function mapGeneratedAssetsToExperience(experience, manifest = {}) {
  const generated = manifest[experience.id] || manifest[experience.storyId] || manifest[experience.title];
  if (!generated) return experience;
  return {
    ...experience,
    generatedImages: generated,
    image: generated.poster || generated.thumbnail || generated.hero || experience.image,
    heroImage: generated.hero || experience.heroImage || generated.poster || experience.image,
    thumbnailImage: generated.thumbnail || generated.poster || experience.thumbnailImage || experience.image,
  };
}

export function mapGeneratedAssetsToExperiences(experiences = [], manifest = {}) {
  return experiences.map(experience => mapGeneratedAssetsToExperience(experience, manifest));
}
