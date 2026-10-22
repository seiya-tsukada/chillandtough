import { ReleaseSeason } from '../types/catalog';

/** Reference to a catalog product, falling back to a list position when the code is missing. */
export interface LookProductRef {
  code: string;
  fallbackIndex: number;
}

export interface Look {
  id: string;
  titleEn: string;
  titleJp: string;
  season: ReleaseSeason;
  location: string;
  primary: LookProductRef;
  secondary: LookProductRef;
  notes: string;
}

export const LOOKBOOK_TITLE = 'EDITORIAL LOOKBOOK';
export const LOOKBOOK_SUBTITLE = 'ARCHIVE VOLUME 01 · PHOTOGRAPHED IN TOKYO, JAPAN';

export const LOOKS: Look[] = [
  {
    id: 'look-01',
    titleEn: 'LOOK 01 — TECHNICAL NYLON ENSEMBLE',
    titleJp: 'LOOK 01 — テクニカルナイロン セットアップ',
    season: '2026 S/S',
    location: 'SHIBUYA / AOYAMA, TOKYO',
    primary: { code: 'AT-JK01', fallbackIndex: 0 },
    secondary: { code: 'AT-PT04', fallbackIndex: 3 },
    notes: 'Matte Taslan nylon shell jacket paired with relaxed tapered easy pants. Lightweight breathability engineered for Tokyo mid-season weather.',
  },
  {
    id: 'look-02',
    titleEn: 'LOOK 02 — VINTAGE LOOPWHEEL & COTTON JERSEY',
    titleJp: 'LOOK 02 — 吊り編み裏毛 & 度詰めボーダー',
    season: '2026 S/S',
    location: 'NAKAMEGURO, TOKYO',
    primary: { code: 'AT-HD02', fallbackIndex: 1 },
    secondary: { code: 'AT-CS03', fallbackIndex: 2 },
    notes: '14.5 oz Wakayama loopwheel fleece layered over compact open-end cotton horizontal border tee.',
  },
  {
    id: 'look-03',
    titleEn: 'LOOK 03 — GIZA ROYAL OXFORD & CREW SWEAT',
    titleJp: 'LOOK 03 — ギザオックスフォード & クルースウェット',
    season: '2025 F/W',
    location: 'DAIKANYAMA, TOKYO',
    primary: { code: 'AT-SH06', fallbackIndex: 5 },
    secondary: { code: 'AT-SW05', fallbackIndex: 4 },
    notes: 'Oversized tailored royal oxford shirt anchored beneath heavy Japanese French terry crewneck with athletic side ribbing.',
  },
  {
    id: 'look-04',
    titleEn: 'LOOK 04 — EVERYDAY ESSENTIALS PACK',
    titleJp: 'LOOK 04 — デイリーエッセンシャルズ',
    season: '2026 S/S',
    location: 'GINZA / TSUKIJI, TOKYO',
    primary: { code: 'AT-BG07', fallbackIndex: 6 },
    secondary: { code: 'AT-AC08', fallbackIndex: 7 },
    notes: 'Kurashiki #6 heavy duck canvas shoulder tote alongside bio-washed 6-panel cap and Nara-knitted athletic crew socks.',
  },
];
