import { STORIES, getChapters } from "./stories";
import { analyzeAudioScene } from "../lib/AudioSceneAnalyzer";

export const AUDIO_SCENE_PROFILES = STORIES.flatMap(story =>
  getChapters(story.id).map((chapter, chapterId) => ({
    ...analyzeAudioScene({
      storyId: story.id,
      chapterId,
      pageId: chapterId,
      title: chapter.title,
      text: chapter.text,
      emotion: chapter.emotion || chapter.choice?.emotion || "",
      genre: story.genre,
    }),
  }))
);

export function getAudioSceneProfile(storyId, chapterId, chapter = {}, story = {}) {
  const existing = AUDIO_SCENE_PROFILES.find(profile => profile.storyId === storyId && profile.chapterId === chapterId);
  if (existing) return existing;
  return analyzeAudioScene({
    storyId,
    chapterId,
    pageId: chapterId,
    title: chapter.title,
    text: chapter.text,
    emotion: chapter.emotion || chapter.choice?.emotion || "",
    genre: story.genre,
  });
}
