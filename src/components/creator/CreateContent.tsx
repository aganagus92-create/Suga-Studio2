import React, { useState } from 'react';
import {
  Clapperboard,
  Sparkles,
  Copy,
  Download,
  Lightbulb,
  History,
  Trash2,
  Check,
  X,
  ChevronDown,
  FileText,
  Megaphone,
  Video,
  Image as ImageIcon,
  Edit2,
  LayoutGrid,
  Hash,
  CheckCircle2,
  Share2
} from 'lucide-react';

interface CreateContentProps {
  initialSubView?: 'content-animasi' | 'content-ide';
  onDeductCredits: (amount: number) => boolean;
  onShowToast: (msg: string) => void;
  onAddHistory: (type: string, title: string) => void;
}

export interface StoryboardScene {
  sceneNum: number;
  narration: string;
  t2i: string;
  i2v: string;
}

export interface ProjectHistoryItem {
  id: string;
  title: string;
  summary: string;
  topic: string;
  tema: string;
  style: string;
  sceneCount: number;
  language: string;
  narrationMode: string;
  consistentCharacter: string;
  characterDesc?: string;
  fullNarasi: string;
  konsepAlur: string;
  scenes: StoryboardScene[];
  date: string;
}

interface ViralIdea {
  id: number;
  headline: string;
  hook: string;
  audience: string;
  format: string;
}

// ============================================================================
// EXACT SPMB SMK ISLAM AN-NUURU TIRTOYUDO 2 DATA (FROM USER SCREENSHOTS)
// ============================================================================
export const SPMB_ANNUURU_FULL_NARASI =
  'Pernah bingung mau lanjut sekolah ke mana setelah SMP? Apalagi kalau ingin langsung siap kerja dan punya bekal ilmu agama yang kuat? Nah, di SMK Islam An-Nuur Tirtayudo, kami punya jawabannya! Kami siap mewujudkan impianmu jadi pribadi Islami, kompeten, dan berdaya saing. Kami punya empat jurusan keren: Desain Komunikasi Visual, Akuntansi, Teknik Otomotif, dan D-P-I-B. Semua siap cetak lulusan yang siap kerja! Di sini, kamu nggak cuma dapat ilmu, tapi juga dibentuk jadi pribadi yang santun dan mandiri. Keterampilan itu penting, tapi akhlak lebih utama. Kami juga dorong kreativitasmu lewat berbagai kegiatan dan proyek. Jadilah generasi hebat yang siap bersaing di dunia kerja! SMK Islam An-Nuur Tirtayudo: Islami, Kompeten, dan Berdaya Saing. Kami bukan sekadar sekolah, tapi tempatmu bertumbuh jadi pribadi unggul. Siap kerja? Kami siap melatihmu! Lulusan kami banyak yang sudah sukses di berbagai bidang industri. Ini bukan janji, tapi bukti nyata. Punya mimpi besar? Mari wujudkan bersama di sini. Kami tunggu kehadiranmu untuk menjadi bagian dari keluarga besar An-Nuur Tirtayudo! Ayo, jangan ragu lagi! Daftarkan dirimu sekarang dan raih masa depan cerah bersama kami. SMK Islam An-Nuur Tirtayudo, siap membekali dan memberdayakanmu! Info pendaftaran lengkap ada di bio kami ya! Klik linknya, jangan sampai ketinggalan kesempatan emas ini. Sampai jumpa di An-Nuur Tirtayudo!';

export const SPMB_ANNUURU_KONSEP_ALUR =
  'Video promosi SMK Islam An-Nuur Tirtayudo ini menampilkan dua siswa/siswi sebagai narator utama yang berdialog langsung dengan penonton. Dimulai dengan pertanyaan retoris yang menggugah rasa ingin tahu tentang pilihan sekolah pasca-SMP, video ini kemudian memperkenalkan SMK An-Nuur Tirtayudo sebagai solusi yang menawarkan pendidikan Islami, kompeten, dan berdaya saing. Keempat jurusannya (DKV, Akuntansi, Teknik Otomotif, D-P-I-B) disajikan sebagai jalur siap kerja. Penekanan diberikan pada pembentukan karakter santun dan mandiri, serta pengembangan kreativitas. Video ini membangun citra sekolah sebagai tempat bertumbuh menjadi pribadi unggul dan siap bersaing, didukung oleh bukti kesuksesan alumni. Ajakan untuk mendaftar ditekankan di akhir, dengan informasi pendaftaran yang mudah diakses. Tone keseluruhan ceria, informatif, dan menginspirasi.';

export const SPMB_ANNUURU_10_SCENES: StoryboardScene[] = [
  {
    sceneNum: 1,
    narration:
      'Pernah bingung mau lanjut sekolah ke mana setelah SMP? Apalagi kalau ingin langsung siap kerja dan punya bekal ilmu agama yang kuat?',
    t2i: '3D realistic cinematic style, vibrant earth tones and primary colors, highly detailed textures, professional studio render, evoking a sense of competence and aspiration. The main character, a young Indonesian schoolboy, looks directly at the camera with a curious and slightly questioning expression, one hand gesturing slightly as if posing a question. He stands against a clean, bright studio background with subtle volumetric light. Soft, diffused lighting. Color palette dominated by yellows and browns. Medium shot, eye-level camera angle, 50mm lens, shallow depth of field. Ultra-detailed, 8K, photorealistic.',
    i2v: '3D realistic cinematic style, vibrant earth tones and primary colors, highly detailed textures, professional studio render, evoking a sense of competence and aspiration. Following the medium shot, the camera performs a slow dolly in towards the subject. The subject\'s head tilts slightly, maintaining eye contact, as if considering the question. Subtle ambient particles drift in the light. The mood is inquisitive and inviting. dialog: "Pernah bingung mau lanjut sekolah ke mana setelah SMP? Apalagi kalau ingin langsung siap kerja dan punya bekal ilmu agama yang kuat?", voice: "young male voice around 16 years old, clear and inquisitive"'
  },
  {
    sceneNum: 2,
    narration:
      'Nah, di SMK Islam An-Nuur Tirtayudo, kami punya jawabannya! Kami siap mewujudkan impianmu jadi pribadi Islami, kompeten, dan berdaya saing.',
    t2i: '3D realistic cinematic style, vibrant earth tones and primary colors, highly detailed textures, professional studio render, evoking a sense of competence and aspiration. The main character, a young Indonesian schoolgirl, smiles warmly, holding a blue book, and gestures towards an unseen point with confidence. She stands against a clean, bright studio background with subtle volumetric light. Soft, diffused lighting. Color palette includes reds and yellows. Medium close-up shot, slightly low angle camera, 85mm lens, shallow depth of field. Ultra-detailed, 8K, photorealistic.',
    i2v: '3D realistic cinematic style, vibrant earth tones and primary colors, highly detailed textures, professional studio render, evoking a sense of competence and aspiration. Starting from the medium close-up, the camera subtly orbits around the subject as she speaks. Her smile widens slightly, and she turns the blue book to show a subtle emblem (generic, not specific). The lighting remains soft and even. The mood is reassuring and informative. dialog: "Nah, di SMK Islam An-Nuuru Tirtayudo, kami punya jawabannya! Kami siap mewujudkan impianmu jadi pribadi Islami, kompeten, dan berdaya saing.", voice: "young female voice around 16 years old, warm and confident"'
  },
  {
    sceneNum: 3,
    narration:
      'Kami punya empat jurusan keren: Desain Komunikasi Visual, Akuntansi, Teknik Otomotif, dan D-P-I-B. Semua siap cetak lulusan yang siap kerja!',
    t2i: '3D realistic cinematic style, vibrant earth tones and primary colors, highly detailed textures, professional studio render, evoking a sense of competence and aspiration. Both main characters, the schoolboy and schoolgirl, stand side-by-side, looking forward with determined expressions. The schoolboy points forward with one hand, the schoolgirl holds up the blue book. They are positioned in front of a subtly textured, clean studio backdrop. Bright, even studio lighting. Color palette features yellows, reds, and browns. Wide shot, eye-level camera, 35mm lens, moderate depth of field. Ultra-detailed, 8K, photorealistic.',
    i2v: '3D realistic cinematic style, vibrant earth tones and primary colors, highly detailed textures, professional studio render, evoking a sense of competence and aspiration. From the wide shot, the camera performs a gentle push-in towards the two subjects. As the camera moves, subtle graphic overlays appear momentarily near each character, hinting at the four departments (e.g., a stylized pen for Dkv, calculator for Ak, wrench for TO, blueprint for Dpib). Their expressions remain focused and professional. dialog: "Kami punya empat jurusan keren: Desain Komunikasi Visual, Akuntansi, Teknik Otomotif, dan DPIB / Arsitektur. Semua siap cetak lulusan yang siap kerja!", voice: "young male voice around 16 years old, clear and confident"'
  },
  {
    sceneNum: 4,
    narration:
      'Di sini, kamu nggak cuma dapat ilmu, tapi juga dibentuk jadi pribadi yang santun dan mandiri. Keterampilan itu penting, tapi akhlak lebih utama.',
    t2i: '3D realistic cinematic style, vibrant earth tones and primary colors, highly detailed textures, professional studio render, evoking a sense of competence and aspiration. The schoolgirl is shown in a slightly closer shot, her expression serene and thoughtful, hands clasped gently in front of her. She stands against a clean, bright studio background with soft, diffused lighting. Color palette emphasizes soft browns and yellows. Medium shot, eye-level camera, 50mm lens, shallow depth of field. Ultra-detailed, 8K, photorealistic.',
    i2v: '3D realistic cinematic style, vibrant earth tones and primary colors, highly detailed textures, professional studio render, evoking a sense of competence and aspiration. The camera slowly tracks to the left, focusing on the schoolgirl. As she speaks, she looks down briefly with a humble expression, then back up with gentle conviction. Subtle light rays emanate from behind her. The mood is reflective and principled. dialog: "Di sini, kamu nggak cuma dapat ilmu, tapi juga dibentuk jadi pribadi yang santun dan mandiri. Keterampilan itu penting, tapi akhlak lebih utama.", voice: "young female voice around 16 years old, gentle and sincere"'
  },
  {
    sceneNum: 5,
    narration:
      'Kami juga dorong kreativitasmu lewat berbagai kegiatan dan proyek. Jadilah generasi hebat yang siap bersaing di dunia kerja!',
    t2i: '3D realistic cinematic style, vibrant earth tones and primary colors, highly detailed textures, professional studio render, evoking a sense of competence and aspiration. The schoolboy is shown with a more dynamic pose, one hand raised slightly as if presenting an idea, a spark of creativity in his eyes. He stands against a clean, bright studio background. Bright, energetic studio lighting. Color palette features bold yellows and reds. Medium close-up shot, slightly high angle camera, 85mm lens, shallow depth of field. Ultra-detailed, 8K, photorealistic.',
    i2v: '3D realistic cinematic style, vibrant earth tones and primary colors, highly detailed textures, professional studio render, evoking a sense of competence and aspiration. Starting from the medium close-up, the camera performs a quick zoom out to a medium shot. The schoolboy makes a confident gesture, his expression bright and enthusiastic. Subtle animated light streaks appear around his hand. The mood is inspiring and forward-looking. dialog: "Kami juga dorong kreativitasmu lewat berbagai kegiatan dan proyek. Jadilah generasi hebat yang siap bersaing di dunia kerja!", voice: "young male voice around 16 years old, energetic and inspiring"'
  },
  {
    sceneNum: 6,
    narration:
      'SMK Islam An-Nuur Tirtayudo: Islami, Kompeten, dan Berdaya Saing. Kami bukan sekadar sekolah, tapi tempatmu bertumbuh jadi pribadi unggul.',
    t2i: '3D realistic cinematic style, vibrant earth tones and primary colors, highly detailed textures, professional studio render, evoking a sense of competence and aspiration. Both main characters stand together again, looking directly at the camera with confident, proud smiles. The schoolboy gives a thumbs-up, the schoolgirl holds her book with a determined look. They are centered against a clean, bright studio backdrop. Even, soft studio lighting. Color palette is balanced with yellows, reds, and browns. Wide shot, eye-level camera, 35mm lens, moderate depth of field. Ultra-detailed, 8K, photorealistic.',
    i2v: '3D realistic cinematic style, vibrant earth tones and primary colors, highly detailed textures, professional studio render, evoking a sense of competence and aspiration. From the wide shot, the camera slowly pans across the faces of the two subjects, emphasizing their confident expressions. As the camera pans, the text "SMK BISA HEBAT" appears briefly and subtly above them. The lighting remains consistent and flattering. dialog: "SMK Islam An-Nuuru Tirtayudo: Islami, Kompeten, dan Berdaya Saing. Kami bukan sekadar sekolah, tapi tempatmu bertumbuh jadi pribadi unggul.", voice: "young male voice around 16 years old, warm and authoritative"'
  },
  {
    sceneNum: 7,
    narration:
      'Siap kerja? Kami siap melatihmu! Lulusan kami banyak yang sudah sukses di berbagai bidang industri. Ini bukan janji, tapi bukti nyata.',
    t2i: '3D realistic cinematic style, vibrant earth tones and primary colors, highly detailed textures, professional studio render, evoking a sense of competence and aspiration. The schoolboy is shown in a dynamic pose, looking off to the side with a determined gaze, as if looking towards future opportunities. He stands against a clean, bright studio background. Bright, directional lighting casting subtle shadows. Color palette features strong yellows and blacks. Medium shot, slightly low angle camera, 50mm lens, shallow depth of field. Ultra-detailed, 8K, photorealistic.',
    i2v: '3D realistic cinematic style, vibrant earth tones and primary colors, highly detailed textures, professional studio render, evoking a sense of competence and aspiration. The camera performs a quick dolly out from the medium shot, revealing more of the clean studio environment. The schoolboy turns his head back towards the camera with a confident nod. Subtle lens flare appears. The mood is assured and results-oriented. dialog: "Siap kerja? Kami siap melatihmu! Lulusan kami banyak yang sudah sukses di berbagai bidang industri. Ini bukan janji, tapi bukti nyata.", voice: "young male voice around 16 years old, confident and direct"'
  },
  {
    sceneNum: 8,
    narration:
      'Punya mimpi besar? Mari wujudkan bersama di sini. Kami tunggu kehadiranmu untuk menjadi bagian dari keluarga besar An-Nuur Tirtayudo!',
    t2i: '3D realistic cinematic style, vibrant earth tones and primary colors, highly detailed textures, professional studio render, evoking a sense of competence and aspiration. The schoolgirl is shown with an open, inviting gesture, her expression warm and welcoming. She stands against a clean, bright studio background. Soft, diffused lighting. Color palette emphasizes warm browns and gentle reds. Medium close-up shot, eye-level camera, 85mm lens, shallow depth of field. Ultra-detailed, 8K, photorealistic.',
    i2v: '3D realistic cinematic style, vibrant earth tones and primary colors, highly detailed textures, professional studio render, evoking a sense of competence and aspiration. Starting from the medium close-up, the camera slowly zooms out to a medium shot. The schoolgirl extends her hand slightly towards the viewer in a welcoming gesture. Subtle light particles emanate from her hand. The mood is inviting and familial. dialog: "Punya mimpi besar? Mari wujudkan bersama di sini. Kami tunggu kehadiranmu untuk menjadi bagian dari keluarga besar An-Nuuru Tirtayudo!", voice: "young female voice around 16 years old, warm and inviting"'
  },
  {
    sceneNum: 9,
    narration:
      'Ayo, jangan ragu lagi! Daftarkan dirimu sekarang dan raih masa depan cerah bersama kami. SMK Islam An-Nuur Tirtayudo, siap membekali dan memberdayakanmu!',
    t2i: '3D realistic cinematic style, vibrant earth tones and primary colors, highly detailed textures, professional studio render, evoking a sense of competence and aspiration. Both main characters are shown together, looking enthusiastically towards the viewer, perhaps with a subtle hint of a school building or logo in the background (stylized, not literal). They are in a slightly wider shot, conveying a sense of community. Bright, uplifting studio lighting. Color palette is vibrant and optimistic. Wide shot, eye-level camera, 35mm lens, moderate depth of field. Ultra-detailed, 8K, photorealistic.',
    i2v: '3D realistic cinematic style, vibrant earth tones and primary colors, highly detailed textures, professional studio render, evoking a sense of competence and aspiration. From the wide shot, the camera performs a rapid, exciting orbit around the two subjects. As the camera moves, the schoolboy and schoolgirl both point forward energetically, encouraging the viewer. The lighting becomes slightly more dynamic. The mood is energetic and action-oriented. dialog: "Ayo, jangan ragu lagi! Daftarkan dirimu sekarang dan raih masa depan cerah bersama kami. SMK Islam An-Nuuru Tirtayudo, siap membekali dan memberdayakanmu!", voice: "young male voice around 16 years old, enthusiastic and encouraging"'
  },
  {
    sceneNum: 10,
    narration:
      'Info pendaftaran lengkap ada di bio kami ya! Klik linknya, jangan sampai ketinggalan kesempatan emas ini. Sampai jumpa di An-Nuur Tirtayudo!',
    t2i: '3D realistic cinematic style, vibrant earth tones and primary colors, highly detailed textures, professional studio render, evoking a sense of competence and aspiration. The main character, the schoolgirl, is shown looking directly at the camera with a friendly smile, holding up a finger as if reminding the viewer. A subtle graphic element indicating a \'link in bio\' or \'click here\' appears near her. Clean, bright studio background. Soft, diffused lighting. Color palette focuses on warm reds and yellows. Medium shot, eye-level camera, 50mm lens, shallow depth of field. Ultra-detailed, 8K, photorealistic.',
    i2v: '3D realistic cinematic style, vibrant earth tones and primary colors, highly detailed textures, professional studio render, evoking a sense of competence and aspiration. The camera holds on a medium shot of the schoolgirl. She gives a final, warm smile and a small wave. The \'link in bio\' graphic becomes more prominent and animates slightly. The lighting gently fades out. The mood is friendly and conclusive. dialog: "Info pendaftaran lengkap ada di bio kami ya! Klik linknya, jangan sampai ketinggalan kesempatan emas ini. Sampai jumpa di An-Nuur Tirtayudo!", voice: "young female voice around 16 years old, friendly and conclusive"'
  }
];

export const CreateContent: React.FC<CreateContentProps> = ({
  initialSubView = 'content-animasi',
  onDeductCredits,
  onShowToast,
  onAddHistory
}) => {
  const [activeTab, setActiveTab] = useState<'content-animasi' | 'content-ide'>(initialSubView);

  // Default presets
  const defaultTemaList = [
    'Promosi Sekolah',
    'Fakta unik',
    'Edukasi',
    'Cerita / Dongeng',
    'Motivasi',
    'Sejarah',
    'Sains',
    'Komedi',
    'Horror / Misteri',
    'Tips & Trik',
    'Lifehack / DIY',
    'Tutorial / How-To',
    'Storytelling / Pengalaman Pribadi',
    'Review Produk',
    'Unboxing',
    'Resep & Kuliner / Food',
    'Travel & Wisata',
    'Kesehatan & Kebugaran',
    'Teknologi & Gadget',
    'Bisnis & Karier',
    'Quotes & Kata-kata'
  ];

  const defaultGayaList = [
    '3D Realistic / Cinematic',
    '3D Animation (Pixar Style)',
    '2D Animation / Cartoon',
    'Anime',
    'Anime (Studio Ghibli Style)',
    'Realistic Photography',
    'Claymation',
    'Watercolor Illustration',
    'Comic Book / Graphic Novel',
    'Cyberpunk / Neon',
    'Line Art / Sketch',
    'Minimalist / Flat Design'
  ];

  const bahasaList = ['Indonesia', 'English', 'Jawa', 'Sunda', 'Arab', 'Jepang'];
  const modeNarasiList = ['Dialog (karakter bicara)', 'Narator (voice-over)'];

  const [temaList, setTemaList] = useState<string[]>(defaultTemaList);
  const [gayaList, setGayaList] = useState<string[]>(defaultGayaList);

  // Form State - Preloaded with SPMB SMK ISLAM AN-NUURU TIRTOYUDO 2 as requested
  const [animasiTitle, setAnimasiTitle] = useState('SPMB SMK ISLAM AN-NUURU TIRTOYUDO 2');
  const [selectedTema, setSelectedTema] = useState('Promosi Sekolah');
  const [animasiTopic, setAnimasiTopic] = useState(
    'SPMB SMK Islam An-Nuur Tirtoyudo: Islami, Kompeten, dan Berdaya Saing. 4 Jurusan: DKV, Akuntansi, Teknik Otomotif, DPIB.'
  );
  const [animasiStyle, setAnimasiStyle] = useState('3D Realistic / Cinematic');
  const [scenesCount, setScenesCount] = useState<number>(10);
  const [selectedLanguage, setSelectedLanguage] = useState('Indonesia');
  const [selectedNarasiMode, setSelectedNarasiMode] = useState('Dialog (karakter bicara)');
  const [consistentCharacter, setConsistentCharacter] = useState<'Tidak' | 'Ya'>('Ya');
  const [characterDescription, setCharacterDescription] = useState(
    'Dua siswa/siswi SMA/SMK Indonesia (siswa laki-laki dan siswi berhijab rapi, ramah, dan berkarakter)'
  );

  // Generated Scenes State - Preloaded with the exact 10 scenes
  const [generatedScenes, setGeneratedScenes] = useState<StoryboardScene[] | null>(SPMB_ANNUURU_10_SCENES);
  const [activeProjectTitle, setActiveProjectTitle] = useState<string>('SPMB SMK ISLAM AN-NUURU TIRTOYUDO 2');
  const [fullNarasi, setFullNarasi] = useState<string>(SPMB_ANNUURU_FULL_NARASI);
  const [konsepAlur, setKonsepAlur] = useState<string>(SPMB_ANNUURU_KONSEP_ALUR);

  // Modals & UI Controls
  const [showHistory, setShowHistory] = useState(true);
  const [showCaptionModal, setShowCaptionModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingScene, setEditingScene] = useState<{
    sceneNum: number;
    field: 'narration' | 't2i' | 'i2v';
    value: string;
  } | null>(null);

  // Project History
  const [projectHistory, setProjectHistory] = useState<ProjectHistoryItem[]>([
    {
      id: 'proj-spmb-2',
      title: 'SPMB SMK ISLAM AN-NUURU TIRTOYUDO 2',
      summary:
        'SPMB SMK Islam An-Nuur Tirtoyudo - 10 scene - 3D Realistic / Cinematic (Dialog 2 Karakter)',
      topic:
        'SPMB SMK Islam An-Nuur Tirtoyudo: Islami, Kompeten, dan Berdaya Saing. 4 Jurusan: DKV, Akuntansi, Teknik Otomotif, DPIB.',
      tema: 'Promosi Sekolah',
      style: '3D Realistic / Cinematic',
      sceneCount: 10,
      language: 'Indonesia',
      narrationMode: 'Dialog (karakter bicara)',
      consistentCharacter: 'Ya',
      characterDesc:
        'Dua siswa/siswi SMA/SMK Indonesia (siswa laki-laki dan siswi berhijab rapi, santun, dan mandiri)',
      fullNarasi: SPMB_ANNUURU_FULL_NARASI,
      konsepAlur: SPMB_ANNUURU_KONSEP_ALUR,
      scenes: SPMB_ANNUURU_10_SCENES,
      date: 'Hari ini'
    }
  ]);

  // Ide Konten State
  const [ideKategori, setIdeKategori] = useState('Fakta Unik');
  const [ideKeyword, setIdeKeyword] = useState('SMK Siap Kerja & Masa Depan Vokasi');
  const [ideGaya, setIdeGaya] = useState('Storytelling');
  const [ideAudience, setIdeAudience] = useState('Remaja & Mahasiswa');
  const [ideCount, setIdeCount] = useState<number>(5);
  const [generatedIdeas, setGeneratedIdeas] = useState<ViralIdea[] | null>(null);

  // Single Text Copy
  const copySingleText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    onShowToast(`${label} berhasil disalin!`);
  };

  // Helper to generate context-adaptive scenes for any topic
  const generateContextualStory = (
    title: string,
    topic: string,
    tema: string,
    style: string,
    count: number,
    lang: string,
    narasiMode: string,
    charDesc: string
  ) => {
    const isDialog = narasiMode.includes('Dialog');
    const isSchool =
      topic.toLowerCase().includes('smk') ||
      topic.toLowerCase().includes('sekolah') ||
      topic.toLowerCase().includes('spmb') ||
      tema === 'Promosi Sekolah';

    // If it is An-Nuur Tirtoyudo topic and 10 scenes, return the authentic exact scenes!
    if (
      (topic.toLowerCase().includes('an-nuur') ||
        topic.toLowerCase().includes('annuuru') ||
        title.toLowerCase().includes('annuuru') ||
        title.toLowerCase().includes('an-nuur')) &&
      count === 10
    ) {
      return {
        scenes: SPMB_ANNUURU_10_SCENES,
        fullNarasi: SPMB_ANNUURU_FULL_NARASI,
        konsepAlur: SPMB_ANNUURU_KONSEP_ALUR
      };
    }

    const scenes: StoryboardScene[] = [];
    const narrationList: string[] = [];

    // Shot templates for varied cinematic progression
    const shotConfigs = [
      {
        shot: 'Medium shot, eye-level camera angle, 50mm lens, shallow depth of field',
        camera: 'slow dolly in towards the subject maintaining eye contact',
        mood: 'inquisitive and inviting',
        voice: 'young male voice around 16 years old, clear and inquisitive'
      },
      {
        shot: 'Medium close-up shot, slightly low angle camera, 85mm lens, shallow depth of field',
        camera: 'subtly orbits around the subject as she speaks with warm conviction',
        mood: 'reassuring and confident',
        voice: 'young female voice around 16 years old, warm and confident'
      },
      {
        shot: 'Wide shot, eye-level camera, 35mm lens, moderate depth of field',
        camera: 'performs a gentle push-in towards the subjects with subtle atmospheric lighting',
        mood: 'focused and professional',
        voice: 'young male voice around 16 years old, clear and confident'
      },
      {
        shot: 'Medium shot, eye-level camera, 50mm lens, shallow depth of field',
        camera: 'slowly tracks to the left, focusing on thoughtful expressions with subtle light rays',
        mood: 'reflective and principled',
        voice: 'young female voice around 16 years old, gentle and sincere'
      },
      {
        shot: 'Medium close-up shot, slightly high angle camera, 85mm lens, shallow depth of field',
        camera: 'performs a quick zoom out to a medium shot as enthusiastic gestures occur',
        mood: 'inspiring and forward-looking',
        voice: 'young male voice around 16 years old, energetic and inspiring'
      },
      {
        shot: 'Wide shot, eye-level camera, 35mm lens, moderate depth of field',
        camera: 'slowly pans across the subjects emphasizing their proud, confident expressions',
        mood: 'warm and authoritative',
        voice: 'young male voice around 16 years old, warm and authoritative'
      },
      {
        shot: 'Medium shot, slightly low angle camera, 50mm lens, shallow depth of field',
        camera: 'quick dolly out from medium shot revealing modern ambient background',
        mood: 'assured and results-oriented',
        voice: 'young male voice around 16 years old, confident and direct'
      },
      {
        shot: 'Medium close-up shot, eye-level camera, 85mm lens, shallow depth of field',
        camera: 'slowly zooms out to a medium shot with welcoming arm gesture',
        mood: 'inviting and familial',
        voice: 'young female voice around 16 years old, warm and inviting'
      },
      {
        shot: 'Wide shot, eye-level camera, 35mm lens, moderate depth of field',
        camera: 'performs a rapid, exciting orbit around the subjects pointing forward enthusiastically',
        mood: 'energetic and action-oriented',
        voice: 'young male voice around 16 years old, enthusiastic and encouraging'
      },
      {
        shot: 'Medium shot, eye-level camera, 50mm lens, shallow depth of field',
        camera: 'holds on a medium shot with a friendly smile, gentle wave, and lighting fade',
        mood: 'friendly and conclusive',
        voice: 'young female voice around 16 years old, friendly and conclusive'
      }
    ];

    for (let i = 1; i <= count; i++) {
      const cfg = shotConfigs[(i - 1) % shotConfigs.length];
      let sceneNarasi = '';

      if (i === 1) {
        sceneNarasi = isSchool
          ? `Pernah bingung mau lanjut ke mana setelah lulus? Apalagi kalau ingin langsung siap kerja dan punya kompetensi yang kuat?`
          : `Tahukah kamu rahasia terbesar di balik ${topic}? Hal yang jarang disadari banyak orang tapi mengubah segalanya!`;
      } else if (i === 2) {
        sceneNarasi = isSchool
          ? `Nah, di sini kami punya jawabannya! Kami siap mewujudkan impianmu jadi pribadi unggul, kompeten, dan berdaya saing tinggi.`
          : `Mari kita telusuri fakta mengejutkan ini langsung dari akarnya bersama bukti yang nyata!`;
      } else if (i === count) {
        sceneNarasi = `Info selengkapnya ada di bio kami ya! Klik link sekarang, jangan sampai ketinggalan kesempatan emas ini. Sampai jumpa!`;
      } else if (i === count - 1) {
        sceneNarasi = `Ayo, jangan ragu lagi! Ambil langkah pertamamu hari ini dan raih masa depan cerah bersama kami!`;
      } else {
        sceneNarasi = isDialog
          ? `Di tahap ke-${i} ini, keterampilan dan pemahaman mendalam tentang ${topic} dibentuk secara konsisten dan terarah.`
          : `Menariknya pada bagian ke-${i}, setiap detail dieksekusi dengan standar tinggi demi menghasilkan hasil yang maksimal.`;
      }

      narrationList.push(sceneNarasi);

      const charString =
        charDesc ||
        (isSchool
          ? 'The main character, a young Indonesian student in neat modern uniform'
          : 'The central character, an expressive Indonesian creator');

      const t2iPrompt = `${style} style, vibrant earth tones and primary colors, highly detailed textures, professional studio render, evoking a sense of competence and aspiration. ${charString}, positioned in frame with dynamic gesture matching scene context. Clean, bright studio background with subtle volumetric light. Soft, diffused lighting. ${cfg.shot}. Ultra-detailed, 8K, photorealistic.`;

      const i2vPrompt = `${style} style, vibrant earth tones and primary colors, highly detailed textures, professional studio render, evoking a sense of competence and aspiration. The camera ${cfg.camera}. Subtle ambient particles drift in the light. The mood is ${cfg.mood}. dialog: "${sceneNarasi}", voice: "${cfg.voice}"`;

      scenes.push({
        sceneNum: i,
        narration: sceneNarasi,
        t2i: t2iPrompt,
        i2v: i2vPrompt
      });
    }

    const compiledNarasi = narrationList.join(' ');
    const compiledKonsep = `Video promosi bertema "${tema}" ini menyajikan alur narasi ${isDialog ? 'dialog interaktif' : 'narasi terstruktur'} yang menghubungkan penonton langsung dengan topik "${topic}". Dibuka dengan hook pertanyaan retoris yang menggugah penasaran, dilanjutkan elaborasi pilar utama, pembuktian nilai unggul, hingga ajakan Call-To-Action (CTA) di adegan penutup. Visual diproduksi dalam gaya ${style} dengan pencahayaan sinematik studio dan akting vokal natural.`;

    return {
      scenes,
      fullNarasi: compiledNarasi,
      konsepAlur: compiledKonsep
    };
  };

  // Generate Story Prompts Handler
  const handleGenerateAnimasi = () => {
    if (!onDeductCredits(5)) return;

    const count = Math.min(Math.max(Number(scenesCount) || 1, 1), 50);
    const finalTitle = animasiTitle.trim() || animasiTopic.trim() || `Project Storyboard ${selectedTema}`;

    const generated = generateContextualStory(
      finalTitle,
      animasiTopic,
      selectedTema,
      animasiStyle,
      count,
      selectedLanguage,
      selectedNarasiMode,
      characterDescription
    );

    setGeneratedScenes(generated.scenes);
    setFullNarasi(generated.fullNarasi);
    setKonsepAlur(generated.konsepAlur);
    setActiveProjectTitle(finalTitle);

    // Save to Project History
    const newHistoryItem: ProjectHistoryItem = {
      id: `proj-${Date.now()}`,
      title: finalTitle,
      summary: `${finalTitle} - ${count} scene - ${selectedTema} (${animasiStyle})`,
      topic: animasiTopic,
      tema: selectedTema,
      style: animasiStyle,
      sceneCount: count,
      language: selectedLanguage,
      narrationMode: selectedNarasiMode,
      consistentCharacter: consistentCharacter,
      characterDesc: characterDescription,
      fullNarasi: generated.fullNarasi,
      konsepAlur: generated.konsepAlur,
      scenes: generated.scenes,
      date: 'Hari ini'
    };

    setProjectHistory((prev) => [newHistoryItem, ...prev]);
    onShowToast(`Berhasil men-generate ${count} scene Story Prompts (-5 kredit)!`);
    onAddHistory('Story Prompt Generator', `${finalTitle} (${count} Scene)`);
  };

  // Open Project from History
  const handleOpenProject = (item: ProjectHistoryItem) => {
    setAnimasiTitle(item.title);
    setAnimasiTopic(item.topic);
    setSelectedTema(item.tema);
    setAnimasiStyle(item.style);
    setScenesCount(item.sceneCount);
    setSelectedLanguage(item.language);
    setSelectedNarasiMode(item.narrationMode);
    setConsistentCharacter(item.consistentCharacter as 'Tidak' | 'Ya');
    if (item.characterDesc) setCharacterDescription(item.characterDesc);
    setGeneratedScenes(item.scenes);
    setFullNarasi(item.fullNarasi || SPMB_ANNUURU_FULL_NARASI);
    setKonsepAlur(item.konsepAlur || SPMB_ANNUURU_KONSEP_ALUR);
    setActiveProjectTitle(item.title);
    onShowToast(`Project "${item.title}" dimuat!`);
  };

  // Delete Project from History
  const handleDeleteHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setProjectHistory((prev) => prev.filter((p) => p.id !== id));
    onShowToast('Project riwayat dihapus.');
  };

  // Save Edit to Scene Prompt
  const handleSaveEdit = () => {
    if (!editingScene || !generatedScenes) return;
    setGeneratedScenes((prev) => {
      if (!prev) return prev;
      return prev.map((s) => {
        if (s.sceneNum === editingScene.sceneNum) {
          return {
            ...s,
            [editingScene.field]: editingScene.value
          };
        }
        return s;
      });
    });
    setShowEditModal(false);
    onShowToast(`Scene ${editingScene.sceneNum} berhasil diperbarui!`);
  };

  // Copy All Scenes as Master Text
  const copyAllScenes = () => {
    if (!generatedScenes) return;
    const title = activeProjectTitle || animasiTitle || 'Storyboard Animasi';
    let fullText = `=== ANIMASI — STORY PROMPT GENERATOR: ${title} ===\nTema: ${selectedTema}\nTopik: ${animasiTopic}\nGaya Visual: ${animasiStyle}\nTotal Scene: ${generatedScenes.length}\n\nNARASI LENGKAP:\n${fullNarasi}\n\nKONSEP & ALUR:\n${konsepAlur}\n\n`;

    generatedScenes.forEach((s) => {
      fullText += `===============================\nSCENE ${s.sceneNum}\n===============================\n[NARASI]:\n${s.narration}\n\n[PROMPT IMAGE]:\n${s.t2i}\n\n[PROMPT VIDEO]:\n${s.i2v}\n\n`;
    });

    navigator.clipboard.writeText(fullText);
    onShowToast('Seluruh storyboard berhasil disalin ke clipboard!');
  };

  // Download Scenes as .TXT
  const downloadScenesTXT = () => {
    if (!generatedScenes) return;
    const title = activeProjectTitle || animasiTitle || 'Storyboard_Animasi';
    let fullText = `=== ANIMASI — STORY PROMPT GENERATOR: ${title} ===\nTema: ${selectedTema}\nTopik: ${animasiTopic}\nGaya Visual: ${animasiStyle}\nTotal Scene: ${generatedScenes.length}\n\nNARASI LENGKAP:\n${fullNarasi}\n\nKONSEP & ALUR:\n${konsepAlur}\n\n`;

    generatedScenes.forEach((s) => {
      fullText += `===============================\nSCENE ${s.sceneNum}\n===============================\n[NARASI]:\n${s.narration}\n\n[PROMPT IMAGE]:\n${s.t2i}\n\n[PROMPT VIDEO]:\n${s.i2v}\n\n`;
    });

    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}_Storyboard.txt`;
    a.click();
    onShowToast('File storyboard .TXT berhasil diunduh!');
  };

  // Generate Viral Ideas
  const handleGenerateIde = () => {
    if (!onDeductCredits(2)) return;
    const sampleIdeas: ViralIdea[] = [
      {
        id: 1,
        headline: `3 Rahasia Mengapa Lulusan SMK Ini Selalu Diburu Perusahaan Besar`,
        hook: `Jangan kaget, ternyata ini alasan siswa SMK punya gaji awal setara sarjana!`,
        audience: ideAudience,
        format: 'Video Reels / TikTok (60s)'
      },
      {
        id: 2,
        headline: `Fakta Mengejutkan Jurusan DKV & Otomotif yang Jarang Dibahas`,
        hook: `Pernah mikir jurusan ini cuma gambar dan bengkel? Kalian salah besar!`,
        audience: ideAudience,
        format: 'Carousel Edukasi'
      },
      {
        id: 3,
        headline: `Kenapa Sekolah Berbasis Karakter Islami Lebih Sukses di Dunia Kerja?`,
        hook: `Keahlian tanpa akhlak itu rapuh. Tapi kalau digabung? Tak terkalahkan!`,
        audience: ideAudience,
        format: 'Storytelling Inspiratif'
      }
    ];
    setGeneratedIdeas(sampleIdeas);
    onShowToast('Berhasil menghasilkan 3 ide konten viral (-2 kredit)!');
    onAddHistory('Ide Konten Viral', ideKeyword);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Nav Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('content-animasi')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'content-animasi'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/40'
              : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Clapperboard className="w-4 h-4" />
          <span>Animasi Storyboard (Story Prompt Generator)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('content-ide')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'content-ide'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/40'
              : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          <span>Ide Konten Viral</span>
        </button>
      </div>

      {/* TAB 1: ANIMASI STORYBOARD GENERATOR */}
      {activeTab === 'content-animasi' && (
        <div className="space-y-6">
          {/* Main Form Input Panel */}
          <div className="p-6 rounded-3xl bg-[#070e1d]/90 border border-slate-800 space-y-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div>
                <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
                  <Clapperboard className="w-4 h-4 text-blue-400" />
                  <span>Studio Animasi — Story Prompt Generator</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Buat struktur prompt animasi per-scene (narasi, gambar, video) yang disesuaikan secara otomatis.
                </p>
              </div>

              {/* Toggle History Button */}
              <button
                type="button"
                onClick={() => setShowHistory(!showHistory)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-semibold hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <History className="w-3.5 h-3.5 text-blue-400" />
                <span>Riwayat ({projectHistory.length})</span>
                {showHistory ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5 -rotate-90" />}
              </button>
            </div>

            {/* Riwayat Projects Dropdown / Drawer */}
            {showHistory && projectHistory.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-[#050b16] border border-blue-900/40 space-y-2 text-xs">
                <span className="font-bold text-slate-300 text-[11px] block uppercase tracking-wider">
                  Riwayat Project Storyboard:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {projectHistory.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleOpenProject(item)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        activeProjectTitle === item.title
                          ? 'bg-blue-950/60 border-blue-500/70 shadow-md shadow-blue-950/40 text-white'
                          : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold truncate text-xs">{item.title}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono shrink-0">
                            {item.sceneCount} Scene
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">{item.summary}</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteHistory(item.id, e)}
                        className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                        title="Hapus riwayat"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Input Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Judul Project */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-300">Judul Project Story</label>
                <input
                  type="text"
                  value={animasiTitle}
                  onChange={(e) => setAnimasiTitle(e.target.value)}
                  placeholder="mis. SPMB SMK ISLAM AN-NUURU TIRTOYUDO 2"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050b16] border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Tema Cerita */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-300">Tema Cerita</label>
                <div className="relative">
                  <select
                    value={selectedTema}
                    onChange={(e) => setSelectedTema(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#050b16] border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500 cursor-pointer appearance-none"
                  >
                    {temaList.map((t) => (
                      <option key={t} value={t} className="bg-slate-900 text-white">
                        {t}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Topik / Ide Cerita */}
            <div className="space-y-1.5 text-xs">
              <label className="block font-semibold text-slate-300">Topik / Ide Utama Cerita</label>
              <textarea
                rows={2}
                value={animasiTopic}
                onChange={(e) => setAnimasiTopic(e.target.value)}
                placeholder="mis. SPMB SMK Islam An-Nuur Tirtoyudo: Islami, Kompeten, dan Berdaya Saing dengan 4 Jurusan: DKV, Akuntansi, Teknik Otomotif, DPIB."
                className="w-full px-3.5 py-2 rounded-xl bg-[#050b16] border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500 resize-none font-sans leading-relaxed"
              />
            </div>

            {/* Gaya Visual, Jumlah Scene, Mode Narasi */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-300">Gaya Visual</label>
                <div className="relative">
                  <select
                    value={animasiStyle}
                    onChange={(e) => setAnimasiStyle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#050b16] border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500 cursor-pointer appearance-none"
                  >
                    {gayaList.map((g) => (
                      <option key={g} value={g} className="bg-slate-900 text-white">
                        {g}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-300">Jumlah Scene (1 - 50)</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={scenesCount}
                  onChange={(e) => setScenesCount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050b16] border border-slate-800 text-white text-xs font-mono font-bold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-300">Mode Narasi</label>
                <div className="relative">
                  <select
                    value={selectedNarasiMode}
                    onChange={(e) => setSelectedNarasiMode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#050b16] border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500 cursor-pointer appearance-none"
                  >
                    {modeNarasiList.map((m) => (
                      <option key={m} value={m} className="bg-slate-900 text-white">
                        {m}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Karakter Konsisten */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-300">Karakter Utama Konsisten</label>
                <button
                  type="button"
                  onClick={() => setConsistentCharacter(consistentCharacter === 'Ya' ? 'Tidak' : 'Ya')}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
                    consistentCharacter === 'Ya'
                      ? 'bg-blue-600/30 text-blue-300 border-blue-500/50'
                      : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}
                >
                  {consistentCharacter === 'Ya' ? 'Aktif (Ya)' : 'Non-aktif (Tidak)'}
                </button>
              </div>
              {consistentCharacter === 'Ya' && (
                <input
                  type="text"
                  value={characterDescription}
                  onChange={(e) => setCharacterDescription(e.target.value)}
                  placeholder="Dua siswa/siswi SMA/SMK Indonesia (siswa laki-laki dan siswi berhijab rapi, ramah, dan berkarakter)"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#050b16] border border-blue-900/60 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
                />
              )}
            </div>

            {/* Generate Action Button */}
            <button
              type="button"
              id="generate-story-prompts-button"
              onClick={handleGenerateAnimasi}
              className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-blue-950/50 cursor-pointer transition-all active:scale-[0.99]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Story Prompts (5 Kredit)</span>
            </button>
          </div>

          {/* ================================================================ */}
          {/* GENERATED STORYBOARD OUTPUT DISPLAY (MATCHING EXACT SCREENSHOTS) */}
          {/* ================================================================ */}
          {generatedScenes && (
            <div className="space-y-4 pt-2 animate-in fade-in duration-200">
              {/* TOP BANNER: CAPTION & HASHTAG SOSMED */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#071329] border border-blue-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                    <Megaphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-wide">
                      Caption & Hashtag Sosmed
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed max-w-2xl">
                      Otomatis buat caption pendek (TikTok/Reels), caption panjang (Instagram/Facebook), deskripsi YouTube, plus paket hashtag yang relevan — dari konteks story yang barusan dibuat.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 sm:self-center">
                  <button
                    type="button"
                    id="open-caption-generator-btn"
                    onClick={() => setShowCaptionModal(!showCaptionModal)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-950/40 cursor-pointer flex items-center gap-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Buat Caption & Hashtag</span>
                  </button>
                </div>
              </div>

              {/* CAPTION & HASHTAG MODAL / DRAWER */}
              {showCaptionModal && (
                <div className="p-5 rounded-2xl bg-[#050c18] border border-blue-500/40 space-y-4 text-xs shadow-2xl animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <span className="font-bold text-sm text-white flex items-center gap-2">
                      <Hash className="w-4 h-4 text-cyan-400" />
                      <span>Paket Caption & Hashtag Sosmed Siap Pakai</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowCaptionModal(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* TikTok / Reels Short Caption */}
                    <div className="p-3.5 rounded-xl bg-[#081326] border border-slate-800 space-y-2 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-pink-400 text-xs">TikTok / Reels</span>
                          <button
                            type="button"
                            onClick={() =>
                              copySingleText(
                                `Lulus SMP bingung mau ke mana? 🤔 Di SMK Islam An-Nuur Tirtoyudo, kamu disiapkan jadi lulusan Islami, kompeten & langsung siap kerja dengan 4 jurusan keren: DKV, Akuntansi, Teknik Otomotif, & DPIB! 🚀\n\nLink pendaftaran di bio ya! 🔥\n#SMKBisa #SMKHebat #AnNuurTirtoyudo #SPMB2026`,
                                'Caption TikTok / Reels'
                              )
                            }
                            className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Salin</span>
                          </button>
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          Lulus SMP bingung mau ke mana? 🤔 Di SMK Islam An-Nuur Tirtoyudo, kamu disiapkan jadi lulusan Islami, kompeten & langsung siap kerja dengan 4 jurusan keren: DKV, Akuntansi, Teknik Otomotif, & DPIB! 🚀
                        </p>
                      </div>
                      <span className="text-[10px] text-pink-300/80 font-mono">
                        #SMKBisa #AnNuurTirtoyudo #SPMB2026
                      </span>
                    </div>

                    {/* Instagram / Facebook Long Caption */}
                    <div className="p-3.5 rounded-xl bg-[#081326] border border-slate-800 space-y-2 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-blue-400 text-xs">Instagram / Facebook</span>
                          <button
                            type="button"
                            onClick={() =>
                              copySingleText(
                                `✨ WUJUDKAN MASA DEPAN CERAH BERSAMA SMK ISLAM AN-NUUR TIRTOYUDO ✨\n\nPernah bingung mau lanjut sekolah ke mana setelah SMP? SMK Islam An-Nuur Tirtoyudo hadir dengan komitmen mendidik generasi yang Islami, Kompeten, dan Berdaya Saing!\n\n4 Pilihan Jurusan Unggulan:\n1. Desain Komunikasi Visual (DKV)\n2. Akuntansi & Keuangan Lembaga\n3. Teknik Otomotif (TO)\n4. Desain Pemodelan & Informasi Bangunan (DPIB)\n\n📍 Kuota terbatas! Pendaftaran online mudah langsung klik link di bio profil kami.\n\n#SMKIslamAnNuur #SMKBisaHebat #VokasiKuat #SPMB2026 #TirtoyudoMalang`,
                                'Caption Instagram / Facebook'
                              )
                            }
                            className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Salin</span>
                          </button>
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          ✨ WUJUDKAN MASA DEPAN CERAH BERSAMA SMK ISLAM AN-NUUR TIRTOYUDO ✨ Keterampilan itu penting, tapi akhlak lebih utama. 4 Jurusan siap cetak lulusan kerja!
                        </p>
                      </div>
                      <span className="text-[10px] text-blue-300/80 font-mono">
                        #VokasiKuat #SMKBisaHebat #SPMB
                      </span>
                    </div>

                    {/* YouTube Description */}
                    <div className="p-3.5 rounded-xl bg-[#081326] border border-slate-800 space-y-2 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-red-400 text-xs">Deskripsi YouTube</span>
                          <button
                            type="button"
                            onClick={() =>
                              copySingleText(
                                `Official Video Profil & SPMB SMK Islam An-Nuur Tirtoyudo\n\nSelamat datang di channel resmi SMK Islam An-Nuur Tirtoyudo. Tonton video ini untuk mengetahui keunggulan, fasilitas bengkel, studio DKV, serta program pembentukan karakter santun dan mandiri.\n\nInformasi & Pendaftaran: https://smkannuurtirtoyudo.sch.id\nWhatsApp Hotline: 0812-XXXX-XXXX`,
                                'Deskripsi YouTube'
                              )
                            }
                            className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Salin</span>
                          </button>
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          Official Video Profil & SPMB SMK Islam An-Nuur Tirtoyudo. Tonton video ini untuk melihat fasilitas 4 jurusan unggulan dan testimoni alumni sukses.
                        </p>
                      </div>
                      <span className="text-[10px] text-red-300/80 font-mono">
                        Link Pendaftaran di Deskripsi Video
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* CARD: NARASI LENGKAP */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#071329] border border-blue-900/40 space-y-3 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-400" />
                    <h4 className="text-sm font-bold text-white tracking-wide">
                      Narasi Lengkap
                    </h4>
                  </div>
                  <button
                    type="button"
                    id="copy-narasi-lengkap-btn"
                    onClick={() => copySingleText(fullNarasi, 'Narasi Lengkap')}
                    className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/80 hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-blue-400" />
                    <span>Salin Narasi</span>
                  </button>
                </div>
                <p className="text-xs sm:text-[13px] text-slate-200 leading-relaxed font-sans text-justify sm:text-left">
                  {fullNarasi}
                </p>
              </div>

              {/* HEADER: OUTPUT PROMPT PER SCENE + C4TTIR LOGO */}
              <div className="flex items-center justify-between px-1 pt-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    Output Prompt per Scene
                  </h3>
                </div>

                {/* Stylized C4TTIR Logo Badge */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 font-black text-xs font-mono tracking-widest px-3 py-1 rounded-xl bg-[#061126] border border-cyan-500/40 text-cyan-300 shadow-md shadow-cyan-950/40">
                    <span className="text-white">C</span>
                    <span className="text-cyan-400 animate-pulse font-extrabold">⚡</span>
                    <span className="text-white">TTIR</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={copyAllScenes}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700/80 flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Salin seluruh scene"
                    >
                      <Copy className="w-3.5 h-3.5 text-blue-400" />
                      <span className="hidden sm:inline">Salin Semua</span>
                    </button>
                    <button
                      type="button"
                      onClick={downloadScenesTXT}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                      title="Unduh file .TXT"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Unduh .TXT</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* LIST OF SCENE CARDS (SCENE 1 TO N) */}
              <div className="space-y-4">
                {generatedScenes.map((s) => (
                  <div
                    key={s.sceneNum}
                    id={`scene-card-${s.sceneNum}`}
                    className="p-5 sm:p-6 rounded-2xl bg-[#071022] border border-slate-800 space-y-4 shadow-xl text-xs"
                  >
                    {/* Scene Number Header */}
                    <div className="flex items-center gap-2.5 border-b border-slate-800/80 pb-3">
                      <div className="w-6 h-6 rounded-lg bg-blue-600/30 border border-blue-500/50 flex items-center justify-center font-bold text-blue-300 font-mono text-xs">
                        {s.sceneNum}
                      </div>
                      <span className="font-bold text-sm text-white font-heading">
                        Scene {s.sceneNum}
                      </span>
                    </div>

                    {/* Section: NARASI */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase font-mono">
                          NARASI
                        </span>
                        <button
                          type="button"
                          onClick={() => copySingleText(s.narration, `Narasi Scene ${s.sceneNum}`)}
                          className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Salin</span>
                        </button>
                      </div>
                      <p className="text-slate-200 text-xs sm:text-[13px] leading-relaxed font-sans">
                        {s.narration}
                      </p>
                    </div>

                    {/* Section: PROMPT IMAGE */}
                    <div className="p-3.5 sm:p-4 rounded-xl bg-[#040914] border border-slate-800/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-[11px] tracking-wide uppercase">
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>PROMPT IMAGE</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copySingleText(s.t2i, `Prompt Image Scene ${s.sceneNum}`)}
                          className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Salin</span>
                        </button>
                      </div>
                      <p className="text-slate-300 text-xs font-mono leading-relaxed select-all">
                        {s.t2i}
                      </p>
                    </div>

                    {/* Section: PROMPT VIDEO */}
                    <div className="p-3.5 sm:p-4 rounded-xl bg-[#040914] border border-slate-800/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-blue-400 font-bold text-[11px] tracking-wide uppercase">
                          <Video className="w-3.5 h-3.5" />
                          <span>PROMPT VIDEO</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingScene({
                                sceneNum: s.sceneNum,
                                field: 'i2v',
                                value: s.i2v
                              });
                              setShowEditModal(true);
                            }}
                            className="text-[11px] text-slate-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => copySingleText(s.i2v, `Prompt Video Scene ${s.sceneNum}`)}
                            className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Salin</span>
                          </button>
                        </div>
                      </div>
                      <p className="text-slate-300 text-xs font-mono leading-relaxed select-all">
                        {s.i2v}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CARD: FULL ADEGAN — KONSEP & ALUR */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#071329] border border-blue-900/40 space-y-3 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4 text-blue-400" />
                    <h4 className="text-sm font-bold text-white tracking-wide">
                      Full Adegan — Konsep & Alur
                    </h4>
                  </div>
                  <button
                    type="button"
                    id="copy-konsep-alur-btn"
                    onClick={() => copySingleText(konsepAlur, 'Konsep & Alur')}
                    className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/80 hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-blue-400" />
                    <span>Salin Konsep</span>
                  </button>
                </div>
                <p className="text-xs sm:text-[13px] text-slate-200 leading-relaxed font-sans text-justify sm:text-left">
                  {konsepAlur}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* EDIT PROMPT MODAL */}
      {showEditModal && editingScene && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl rounded-2xl bg-[#081021] border border-slate-700 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-400" />
                <span>
                  Edit Prompt Video — Scene {editingScene.sceneNum}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="block text-slate-300 font-semibold">Isi Prompt Video</label>
              <textarea
                rows={6}
                value={editingScene.value}
                onChange={(e) =>
                  setEditingScene({
                    ...editingScene,
                    value: e.target.value
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-blue-500 leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: IDE KONTEN VIRAL */}
      {activeTab === 'content-ide' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#070e1d]/90 border border-slate-800 space-y-6 max-w-3xl mx-auto shadow-xl">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-400" />
              <span>Ide Konten — AI Viral Content Ideas</span>
            </h3>
            <p className="text-xs text-slate-400">
              Hasilkan sudut pandang unik, formula hook, dan judul konten berpotensi FYP tinggi
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Kategori Konten</label>
              <select
                value={ideKategori}
                onChange={(e) => setIdeKategori(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white cursor-pointer"
              >
                <option value="Promosi Sekolah & Edukasi">Promosi Sekolah & Edukasi</option>
                <option value="Fakta Unik">Fakta Unik</option>
                <option value="Misteri / Horor">Misteri / Horor</option>
                <option value="Bisnis & Keuangan">Bisnis & Keuangan</option>
                <option value="Teknologi & AI">Teknologi & AI</option>
                <option value="Motivasi">Motivasi</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-300 mb-1">Keyword / Topik Inti</label>
              <input
                type="text"
                value={ideKeyword}
                onChange={(e) => setIdeKeyword(e.target.value)}
                placeholder="mis. SPMB SMK Islam An-Nuur, Lulusan Siap Kerja..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Gaya Penulisan</label>
              <select
                value={ideGaya}
                onChange={(e) => setIdeGaya(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white cursor-pointer"
              >
                <option value="Clickbait">Clickbait (Penasaran Tinggi)</option>
                <option value="Storytelling">Storytelling (Bercerita)</option>
                <option value="Educational">Educational (Informatif)</option>
                <option value="Funny / Lucu">Funny / Humor</option>
                <option value="Documentary">Documentary (Sinematik)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-300 mb-1">Target Audience</label>
              <select
                value={ideAudience}
                onChange={(e) => setIdeAudience(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white cursor-pointer"
              >
                <option value="Semua Umur">Semua Umur</option>
                <option value="Remaja & Mahasiswa">Remaja & Mahasiswa</option>
                <option value="Dewasa & Pekerja">Dewasa & Pekerja</option>
                <option value="Pebisnis / Creator">Pebisnis / Creator</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-300 mb-1">Jumlah Ide (1 - 10)</label>
              <input
                type="number"
                min={1}
                max={10}
                value={ideCount}
                onChange={(e) => setIdeCount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerateIde}
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-lg cursor-pointer transition-all active:scale-[0.99]"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Ide Konten Viral — 2 Kredit</span>
          </button>

          {generatedIdeas && (
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-blue-300 font-mono">
                {generatedIdeas.length} Ide Hook Viral Terkurasi:
              </span>
              <div className="space-y-3">
                {generatedIdeas.map((idea) => (
                  <div
                    key={idea.id}
                    className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold text-pink-400">
                      <span>
                        Ide #{idea.id} [{ideKategori} • {ideGaya}]
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setAnimasiTitle(idea.headline);
                            setAnimasiTopic(`${idea.headline}. Hook: ${idea.hook}`);
                            setActiveTab('content-animasi');
                            onShowToast(`Ide #${idea.id} dimuat ke Storyboard Animasi!`);
                          }}
                          className="text-[10px] px-2 py-0.5 rounded bg-blue-600/80 hover:bg-blue-500 text-white font-semibold transition-colors cursor-pointer"
                        >
                          Pakai di Storyboard
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            copySingleText(
                              `Judul: ${idea.headline}\nHook: ${idea.hook}\nTarget: ${idea.audience}`,
                              `Ide #${idea.id}`
                            )
                          }
                          className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Salin</span>
                        </button>
                      </div>
                    </div>
                    <p className="font-bold text-white text-sm">{idea.headline}</p>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1">
                      <span className="text-[10px] text-amber-400 font-bold uppercase block">
                        Hook 3 Detik Pertama:
                      </span>
                      <p className="text-slate-300 italic font-sans">"{idea.hook}"</p>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Target: {idea.audience} • Rekomendasi Format: {idea.format}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
