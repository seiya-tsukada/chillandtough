import {
  ExperientialPost,
  Product,
  ExperientialStory,
  AdCampaign,
  AnalyticsKPIs,
  OrderRecord
} from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_pants_01',
    name: 'リラックス リネン ワイドトラウザー',
    brand: 'AURA Mobility & Wear',
    price: 18700,
    currency: 'JPY',
    description: 'フレンチノルマンディ産リネン100%のナチュラルスラブ生地。長時間のドライブや移動でもストレスのないイージーウエスト仕様と、美しい落ち感のワイドストレートシルエット。',
    inventoryCount: 24,
    sku: 'AURA-PNT-01',
    tags: ['パンツ', 'アパレル', 'リネン', 'ボトムス'],
    imageUrl: '/src/assets/images/card_pants_sideline_cheering_1792551140173.jpg',
    rating: 4.9,
    reviewCount: 42
  },
  {
    id: 'prod_sweat_02',
    name: 'ヘビーウェイト ループバックスウェット',
    brand: 'Kenji Workshop',
    price: 15400,
    currency: 'JPY',
    description: '和歌山の吊り編み機で限界まで度目を詰めた500GSMのオーガニックコットン裏毛スウェット。型崩れせず、親子の外遊びや車移動での温度調整に最適なタフネスを備えています。',
    inventoryCount: 19,
    sku: 'KNJ-SWT-02',
    tags: ['スウェット', 'アパレル', 'コットン', 'トップス'],
    imageUrl: '/src/assets/images/card_sweat_matchday_morning_1792551139398.jpg',
    rating: 4.8,
    reviewCount: 35
  },
  {
    id: 'prod_polo_03',
    name: 'ファインニット メリノポロシャツ',
    brand: 'AURA Mobility & Wear',
    price: 16800,
    currency: 'JPY',
    description: '18.5ミクロンの極細オーストラリアンメリノウールを使用したハイゲージニットポロ。吸湿速乾と天然の消臭効果で、車内でのくつろぎから旅先のレストランまで一枚で上品に決まります。',
    inventoryCount: 16,
    sku: 'AURA-POL-03',
    tags: ['ポロシャツ', 'アパレル', 'ニット', 'トップス'],
    imageUrl: '/src/assets/images/card_polo_sunlit_sideline_1792551140149.jpg',
    rating: 4.9,
    reviewCount: 28
  },
  {
    id: 'prod_tee_04',
    name: 'ボックスフィット ヘビーウェイトTシャツ',
    brand: 'AURA Mobility & Wear',
    price: 8900,
    currency: 'JPY',
    description: '9.0オンスの肉厚オープンエンド天竺コットン。一枚着で透けず、洗い込むほどに肌馴染みが増すボックスシルエット。首元はバインダーネックでタフに仕上げています。',
    inventoryCount: 38,
    sku: 'AURA-TEE-04',
    tags: ['Tシャツ', 'アパレル', 'オーガニックコットン', 'トップス'],
    imageUrl: '/src/assets/images/card_tee_trunk_gear_load_1792551140515.jpg',
    rating: 4.9,
    reviewCount: 64
  }
];

export const INITIAL_POSTS: ExperientialPost[] = [
  {
    id: 'post_pants_01',
    author: {
      id: 'usr_elena',
      username: 'elena.style',
      displayName: 'Elena Rostova',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isVerified: true,
      followerCount: 142000,
      bio: 'Architectural minimalism & active wardrobe curation.'
    },
    caption: '休日の早朝、子供のサッカーの試合へ車で向かう日のリネンワイドトラウザー。車内の長時間の座り姿勢やグラウンドのベンチ観戦でも締め付け感がなく、風を心地よく通すシルエット。サイドラインでも上品に決まります。',
    location: 'グラウンドサイド · ドライブウェイ',
    experienceRating: 4.9,
    category: 'パンツ',
    slides: [
      {
        id: 'slide_p_1',
        type: 'image',
        url: '/src/assets/images/card_pants_sideline_cheering_1792551140173.jpg',
        caption: 'サイドラインで子供を応援しながら、ゆったりと過ごせるリラックストラウザー。',
        hotspots: [
          {
            id: 'hs_p_1',
            xPercent: 52,
            yPercent: 68,
            productId: 'prod_pants_01',
            productName: 'リラックス リネン ワイドトラウザー',
            price: 18700,
            note: 'サイズ M · オリーブカーキ'
          }
        ]
      }
    ],
    likesCount: 1420,
    commentsCount: 38,
    savesCount: 612,
    isLiked: false,
    isSaved: false,
    tags: ['パンツ', '観戦コーデ', 'ドライブウェア', 'サイドラインスタイル'],
    createdAt: '本日',
    comments: [
      {
        id: 'c1',
        username: 'daiki_travel',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
        text: '長距離運転やアウトドアチェアに座りっぱなしでも快適ですか？',
        createdAt: '1時間前',
        likes: 4
      },
      {
        id: 'c2',
        username: 'elena.style',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        text: '@daiki_travel ウエストが柔らかくリネン特有のこなれた落ち感があるので、折りたたみ椅子でも驚くほど楽です！',
        createdAt: '30分前',
        likes: 9
      }
    ]
  },
  {
    id: 'post_sweat_02',
    author: {
      id: 'usr_kenji',
      username: 'kenji_raw',
      displayName: 'Kenji Shibuya',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      isVerified: true,
      followerCount: 89000,
      bio: 'Street tailor & youth sports supporter.'
    },
    caption: '朝一番のキックオフ。まだ空気の冷たいグラウンドで応援するときに頼れる500GSMの極厚度詰め裏毛スウェット。車のトランクに常備しておけば、試合前後のウォームアップから帰り道まで安心の温もり。',
    location: 'リバーサイドサッカー場',
    experienceRating: 4.8,
    category: 'スウェット',
    isSponsored: true,
    sponsorInfo: {
      brandName: 'Kenji Workshop × AURA',
      campaignId: 'cmp_sweat_01',
      ctaText: 'スウェット詳細を見る',
      targetUrl: '/collection/sweat',
      badgeLabel: 'Sponsored'
    },
    slides: [
      {
        id: 'slide_sw_1',
        type: 'image',
        url: '/src/assets/images/card_sweat_matchday_morning_1792551139398.jpg',
        caption: '500GSMの極厚度詰め裏毛。洗うほどに身体のラインに馴染む設計。',
        hotspots: [
          {
            id: 'hs_sw_1',
            xPercent: 66,
            yPercent: 48,
            productId: 'prod_sweat_02',
            productName: 'ヘビーウェイト ループバックスウェット',
            price: 15400,
            note: 'サイズ L · エクリュホワイト'
          }
        ]
      }
    ],
    likesCount: 2890,
    commentsCount: 52,
    savesCount: 1140,
    isLiked: true,
    isSaved: true,
    tags: ['スウェット', '度詰めコットン', '応援スタイル', '週末スポーツ'],
    createdAt: '本日'
  },
  {
    id: 'post_polo_03',
    author: {
      id: 'usr_chloe',
      username: 'chloe.atelier',
      displayName: 'Chloé Dupuis',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      isVerified: true,
      followerCount: 120500,
      bio: 'Lifestyle designer & weekend soccer mom.'
    },
    caption: '日差しの強い午後のグラウンド観戦から、試合帰りに家族で立ち寄るカフェまで一枚で。メリノウールが汗冷えや車内のエアコン冷えを防ぎ、観戦スタイルを端正に格上げしてくれます。',
    location: 'スポーツパーク · サイドライン',
    experienceRating: 5.0,
    category: 'ポロシャツ',
    slides: [
      {
        id: 'slide_po_1',
        type: 'image',
        url: '/src/assets/images/card_polo_sunlit_sideline_1792551140149.jpg',
        caption: '18.5ミクロン メリノウールの極上ファインニット。',
        hotspots: [
          {
            id: 'hs_po_1',
            xPercent: 45,
            yPercent: 42,
            productId: 'prod_polo_03',
            productName: 'ファインニット メリノポロシャツ',
            price: 16800,
            note: 'ハイゲージ · サンドベージュ'
          }
        ]
      }
    ],
    likesCount: 3410,
    commentsCount: 64,
    savesCount: 1840,
    isLiked: false,
    isSaved: false,
    tags: ['ポロシャツ', 'メリノウール', '上品観戦', 'ママコーデ'],
    createdAt: '本日'
  },
  {
    id: 'post_tee_04',
    author: {
      id: 'usr_maya',
      username: 'maya.journey',
      displayName: 'Maya Tanaka',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isVerified: true,
      followerCount: 94000,
      bio: 'Family sports creator & active weekend supporter.'
    },
    caption: '車の荷室からクーラーボックスや応援チェアを降ろす時も安心のタフな9オンス天竺Tシャツ。子供のハイタッチや全力応援で汗をかいても透けず、頼れる週末のユニフォーム。',
    location: 'スタジアム外周 · パーキング',
    experienceRating: 4.9,
    category: 'Tシャツ',
    slides: [
      {
        id: 'slide_te_1',
        type: 'image',
        url: '/src/assets/images/card_tee_trunk_gear_load_1792551140515.jpg',
        caption: '9.0oz ヘビーウェイト天竺。首元がよれないバインダーネック。',
        hotspots: [
          {
            id: 'hs_te_1',
            xPercent: 52,
            yPercent: 42,
            productId: 'prod_tee_04',
            productName: 'ボックスフィット ヘビーウェイトTシャツ',
            price: 8900,
            note: '9.0oz オーガニック天竺 · オフホワイト'
          }
        ]
      }
    ],
    likesCount: 4120,
    commentsCount: 78,
    savesCount: 2280,
    isLiked: false,
    isSaved: false,
    tags: ['Tシャツ', 'ヘビーウェイト', '応援ウェア', '週末パパママ'],
    createdAt: '本日'
  }
];

export const INITIAL_STORIES: ExperientialStory[] = [
  {
    id: 'story_01',
    authorName: 'AURA Mobility',
    authorHandle: 'aura.wear',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'トラウザー',
    coverImage: '/src/assets/images/card_pants_sideline_cheering_1792551140173.jpg',
    slides: [
      {
        id: 'st_s1',
        url: '/src/assets/images/card_pants_sideline_cheering_1792551140173.jpg',
        caption: 'リラックス リネン ワイドトラウザー。車移動を快適にする機能美。',
        productId: 'prod_pants_01'
      }
    ]
  },
  {
    id: 'story_02',
    authorName: 'Kenji Workshop',
    authorHandle: 'kenji_raw',
    authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    title: 'スウェット',
    coverImage: '/src/assets/images/card_sweat_matchday_morning_1792551139398.jpg',
    slides: [
      {
        id: 'st_s2',
        url: '/src/assets/images/card_sweat_matchday_morning_1792551139398.jpg',
        caption: '500GSM 吊り編み極厚ループバックスウェット。',
        productId: 'prod_sweat_02'
      }
    ]
  },
  {
    id: 'story_03',
    authorName: 'Chloé Dupuis',
    authorHandle: 'chloe.atelier',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    title: 'ポロシャツ',
    coverImage: '/src/assets/images/card_polo_sunlit_sideline_1792551140149.jpg',
    slides: [
      {
        id: 'st_s3',
        url: '/src/assets/images/card_polo_sunlit_sideline_1792551140149.jpg',
        caption: 'ファインニット メリノポロシャツ。温度調節と上品な佇まい。',
        productId: 'prod_polo_03'
      }
    ]
  },
  {
    id: 'story_04',
    authorName: 'Maya Tanaka',
    authorHandle: 'maya.journey',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Tシャツ',
    coverImage: '/src/assets/images/card_tee_trunk_gear_load_1792551140515.jpg',
    slides: [
      {
        id: 'st_s4',
        url: '/src/assets/images/card_tee_trunk_gear_load_1792551140515.jpg',
        caption: '9.0oz ヘビーウェイト天竺 ボックスフィットTシャツ。',
        productId: 'prod_tee_04'
      }
    ]
  }
];

export const INITIAL_CAMPAIGNS: AdCampaign[] = [
  {
    id: 'cmp_family_01',
    campaignName: 'Family Mobility & Roadtrip Wear 2026',
    advertiser: 'AURA Mobility',
    status: 'active',
    dailyBudgetJpy: 40000,
    totalSpentJpy: 312000,
    impressions: 168400,
    clicks: 7210,
    ctrPercent: 4.28,
    roasMultiplier: 5.12,
    cpcJpy: 43.27,
    utmSource: 'instagram',
    utmMedium: 'carousel_ads',
    utmCampaign: 'family_mobility_2026',
    targetDemographics: {
      ages: '26-45',
      interests: ['Family Travel', 'SUV Roadtrip', 'Minimal Wear']
    },
    createdAt: '2026-03-01'
  },
  {
    id: 'cmp_sweat_01',
    campaignName: 'Heavyweight Loopback Capsule Drop',
    advertiser: 'Kenji Workshop',
    status: 'active',
    dailyBudgetJpy: 25000,
    totalSpentJpy: 185000,
    impressions: 94200,
    clicks: 4120,
    ctrPercent: 4.37,
    roasMultiplier: 4.88,
    cpcJpy: 44.90,
    utmSource: 'tiktok',
    utmMedium: 'creator_reels',
    utmCampaign: 'loopback_sweat_vol1',
    targetDemographics: {
      ages: '20-40',
      interests: ['Streetwear', 'Apparel', 'Camping']
    },
    createdAt: '2026-03-10'
  }
];

export const INITIAL_KPI: AnalyticsKPIs = {
  grossMerchandiseValueJpy: 9240000,
  ordersCount: 412,
  averageOrderValueJpy: 22427,
  totalImpressions: 512000,
  feedCtrPercent: 4.12,
  roasOverall: 4.98,
  activeAdCampaigns: 2,
  conversionRatePercent: 3.14,
  topPerformingCreators: [
    { username: '@elena.style', salesJpy: 3420000, conversionRate: '4.1%' },
    { username: '@maya.journey', salesJpy: 2680000, conversionRate: '3.8%' },
    { username: '@kenji_raw', salesJpy: 1980000, conversionRate: '3.6%' },
    { username: '@chloe.atelier', salesJpy: 1160000, conversionRate: '3.9%' }
  ],
  salesByChannel: [
    { channel: 'Instagram Carousel Feed', sharePercent: 58 },
    { channel: 'Story Experience Links', sharePercent: 24 },
    { channel: 'Promoted Ad Slots', sharePercent: 12 },
    { channel: 'Direct / Concept Store', sharePercent: 6 }
  ]
};

export const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: 'ord_1092',
    customerName: '佐藤 健一 (Kenichi Sato)',
    customerEmail: 'k.sato@example.jp',
    items: [
      { productName: 'リラックス リネン ワイドトラウザー', quantity: 1, price: 18700 },
      { productName: 'ボックスフィット ヘビーウェイトTシャツ', quantity: 1, price: 8900 }
    ],
    totalAmountJpy: 27600,
    status: 'paid',
    createdAt: '10分前',
    utmAttribution: 'utm_source=instagram&utm_campaign=family_mobility_2026'
  },
  {
    id: 'ord_1091',
    customerName: '高橋 奈緒 (Nao Takahashi)',
    customerEmail: 'nao.t@example.jp',
    items: [
      { productName: 'ファインニット メリノポロシャツ', quantity: 1, price: 16800 }
    ],
    totalAmountJpy: 16800,
    status: 'fulfilled',
    createdAt: '45分前',
    utmAttribution: 'creator=@chloe.atelier'
  },
  {
    id: 'ord_1090',
    customerName: '松本 蓮 (Ren Matsumoto)',
    customerEmail: 'ren.m@example.jp',
    items: [
      { productName: 'ヘビーウェイト ループバックスウェット', quantity: 2, price: 15400 }
    ],
    totalAmountJpy: 30800,
    status: 'paid',
    createdAt: '2時間前',
    utmAttribution: 'utm_source=tiktok&utm_campaign=loopback_sweat_vol1'
  }
];
