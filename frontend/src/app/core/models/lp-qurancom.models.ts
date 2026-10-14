export interface QuranComChapter {
  id: number;
  name_simple: string;
  name_arabic: string;
  translated_name: { language_name: string; name: string };
  verses_count: number;
  revelation_place: string;
}

export interface QuranComTafsir {
  verseKey: string;
  tafsirId: number;
  text: string;
}

export interface QuranComSearchResult {
  verseKey: string;
  textUthmani: string;
  chapterId: number;
  translationText?: string;
}

export interface QuranComTranslation {
  resourceId: number;
  text: string;
  verseKey: string;
}


