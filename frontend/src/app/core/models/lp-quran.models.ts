export interface Surah {
  id: number;
  number: string;
  name: string;
  translatedName: string;
  revelationPlace: string;
  revelationOrder: number;
  totalAyahs: number;
  type: string;
  bismillah: string;
  hizbBegin: number;
  hizbEnd: number;
  juzBegin: number;
  juzEnd: number;
  ruqyah: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
  ayahs?: Ayah[];
}

export interface Ayah {
  id: number;
  surahId: number;
  verseNumber: number;
  text: string;
  translation: string;
  transliteration: string;
  footnote: string;
  ruku: string;
  sajda: string;
  ayaNumber: number;
  juz: string;
  hizbQuarter: string;
  createdAt: string;
  updatedAt: string;
}

export interface TajweedRule {
  id: number;
  ruleCode: string;
  name: string;
  description: string;
  exampleText: string;
  ruleLevel: number;
  affectedRecitationType: string;
  guidelines: string;
  surahId: number;
  ayahNumber: number;
  createdAt: string;
  updatedAt: string;
}

export interface RecitationLevel {
  id: number;
  levelNumber: number;
  name: string;
  description: string;
  criteria: string;
  colorCode: string;
  pointsRequired: number;
  estimatedWeeks: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuranCurriculum {
  id: number;
  title: string;
  description: string;
  language: string;
  startSurah: number;
  endSurah: number;
  totalAyahs: number;
  estimatedDays: number;
  difficultyLevel: string;
  learningObjectives: string;
  teacherId: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuranStudentProgress {
  id: number;
  studentId: number;
  surahId: number;
  ayahNumber: number;
  surahProgress: number;
  totalSurahs: number;
  percentage: number;
  progressDate: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  surah?: Surah;
}

// ===== Persian Literature =====

