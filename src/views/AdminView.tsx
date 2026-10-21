import React, { useState } from 'react';
import {
  BarChart3,
  Layers,
  Megaphone,
  Package,
  Code2,
  RefreshCw,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Tag,
  CheckCircle2,
  Eye,
  Sliders,
  Play,
  Pause,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';

type AdminTab = 'analytics' | 'feed_cms' | 'ad_manager' | 'inventory' | 'api_docs';

export const AdminView: React.FC = () => {
  const {
    kpi,
    campaigns,
    posts,
    products,
    orders,
    toggleCampaignStatus,
    addCampaign,
    addPost,
    addProduct,
    syncInstagramGraph,
    setCurrentAppMode
  } = useCommerce();

  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // New Post Form State
  const [newPostCaption, setNewPostCaption] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('Apparel');
  const [newPostAuthor, setNewPostAuthor] = useState('curator.collective');
  const [newPostImage, setNewPostImage] = useState('/src/assets/images/post_linen_coat_lifestyle_1792545471678.jpg');
  const [selectedProductIdForTag, setSelectedProductIdForTag] = useState(products[0]?.id || '');
  const [pinX, setPinX] = useState<number>(50);
  const [pinY, setPinY] = useState<number>(50);
  const [isPostSponsored, setIsPostSponsored] = useState(false);

  // New Campaign Form State
  const [newCampName, setNewCampName] = useState('');
  const [newCampAdvertiser, setNewCampAdvertiser] = useState('');
  const [newCampBudget, setNewCampBudget] = useState(30000);
  const [newCampUtm, setNewCampUtm] = useState('spring_curated_drop');

  // API Tester Simulation State
  const [selectedApiEndpoint, setSelectedApiEndpoint] = useState('/api/analytics/kpis');
  const [apiResponseJson, setApiResponseJson] = useState<string>('');
  const [isApiLoading, setIsApiLoading] = useState(false);

  const handleSyncInstagram = async () => {
    setIsSyncing(true);
    setSyncStatus('Instagram Graph API v19.0 とカタログ同期中...');
    try {
      const result = await syncInstagramGraph();
      setSyncStatus(`同期成功: ${result.count} 件の新規投稿・カタログタグを反映しました。`);
      setTimeout(() => setSyncStatus(null), 4000);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    const taggedProduct = products.find((p) => p.id === selectedProductIdForTag) || products[0];

    addPost({
      author: {
        id: `usr_${Date.now()}`,
        username: newPostAuthor,
        displayName: newPostAuthor.replace('.', ' ').toUpperCase(),
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        isVerified: true,
        followerCount: 24500
      },
      caption: newPostCaption || '新作コレクションのテクスチャとスタイリング。',
      category: newPostCategory,
      isSponsored: isPostSponsored,
      sponsorInfo: isPostSponsored
        ? {
            brandName: 'Brand Sponsor',
            campaignId: 'cmp_custom',
            ctaText: 'ショップを見る',
            targetUrl: '/collection'
          }
        : undefined,
      tags: ['Experiential', newPostCategory],
      slides: [
        {
          id: `sl_${Date.now()}`,
          type: 'image',
          url: newPostImage,
          caption: 'ルックブック詳細',
          hotspots: [
            {
              id: `hs_${Date.now()}`,
              xPercent: pinX,
              yPercent: pinY,
              productId: taggedProduct.id,
              productName: taggedProduct.name,
              price: taggedProduct.price,
              note: `${taggedProduct.brand} · タグ付け済み`
            }
          ]
        }
      ]
    });

    setNewPostCaption('');
    alert('新規投稿をフィードに公開しました！');
  };

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampName || !newCampAdvertiser) return;

    addCampaign({
      campaignName: newCampName,
      advertiser: newCampAdvertiser,
      status: 'active',
      dailyBudgetJpy: Number(newCampBudget),
      utmSource: 'instagram',
      utmMedium: 'carousel_feed',
      utmCampaign: newCampUtm,
      targetDemographics: {
        ages: '22-45',
        interests: ['Fashion', 'Minimal Design', 'Interior']
      }
    });

    setNewCampName('');
    setNewCampAdvertiser('');
    alert('新しい広告運用枠を出稿・有効化しました！');
  };

  const testApiCall = (endpoint: string) => {
    setSelectedApiEndpoint(endpoint);
    setIsApiLoading(true);
    setTimeout(() => {
      let data: unknown;
      if (endpoint === '/api/analytics/kpis') {
        data = kpi;
      } else if (endpoint === '/api/campaigns') {
        data = campaigns;
      } else if (endpoint === '/api/products') {
        data = products;
      } else if (endpoint === '/api/health') {
        data = {
          status: 'healthy',
          runtime: 'Python 3.12 (FastAPI 0.110+ on Vercel Serverless)',
          framework: 'FastAPI + Pydantic v2',
          memory_footprint: '48MB',
          region: 'hnd1 (Tokyo, Japan)'
        };
      }
      setApiResponseJson(JSON.stringify(data, null, 2));
      setIsApiLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 pb-16">
      {/* Top Admin Bar */}
      <div className="bg-neutral-950 border-b border-neutral-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-serif text-xl font-bold tracking-tight text-white">
                AURA
              </span>
              <span className="text-xs bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded font-mono">
                Python FastAPI Admin Engine
              </span>
              <span className="text-xs text-neutral-400 font-mono hidden sm:inline">
                Vercel Monorepo (api/index.py)
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              体験型EC運用・広告戦略・ショッパブル投稿管理・データ分析コンソール
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSyncInstagram}
              disabled={isSyncing}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 rounded-lg transition-colors cursor-pointer border border-neutral-700"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Instagram Graph同期</span>
            </button>

            <button
              onClick={() => setCurrentAppMode('store')}
              className="px-3.5 py-1.5 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
            >
              フロント画面へ戻る
            </button>
          </div>
        </div>

        {/* Sync notification message */}
        {syncStatus && (
          <div className="max-w-7xl mx-auto mt-3 p-2 bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs rounded flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{syncStatus}</span>
          </div>
        )}
      </div>

      {/* Main Tab Navigation */}
      <div className="bg-neutral-950/60 border-b border-neutral-800 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-neutral-800 text-white shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>戦略・データ分析 (Analytics)</span>
          </button>

          <button
            onClick={() => setActiveTab('feed_cms')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'feed_cms'
                ? 'bg-neutral-800 text-white shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>投稿・商品タグCMS (Feed Pins)</span>
          </button>

          <button
            onClick={() => setActiveTab('ad_manager')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'ad_manager'
                ? 'bg-neutral-800 text-white shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>広告運用枠 (Ad Manager & ROAS)</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'inventory'
                ? 'bg-neutral-800 text-white shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>商品・在庫管理 (Inventory)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('api_docs');
              if (!apiResponseJson) testApiCall('/api/analytics/kpis');
            }}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'api_docs'
                ? 'bg-neutral-800 text-white shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Pythonバックエンド仕様 (FastAPI Specs)</span>
          </button>
        </div>
      </div>

      {/* Main Container Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* TAB 1: ANALYTICS & STRATEGY */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-neutral-800/80 border border-neutral-700/80 rounded-xl p-5">
                <span className="text-xs text-neutral-400 font-medium">GMV（流通取引総額）</span>
                <div className="text-2xl font-bold text-white mt-1.5 tabular-nums">
                  ¥{kpi.grossMerchandiseValueJpy.toLocaleString()}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-2">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+18.4% 前月比成長</span>
                </div>
              </div>

              <div className="bg-neutral-800/80 border border-neutral-700/80 rounded-xl p-5">
                <span className="text-xs text-neutral-400 font-medium">受注件数 (Total Orders)</span>
                <div className="text-2xl font-bold text-white mt-1.5 tabular-nums">
                  {kpi.ordersCount} 件
                </div>
                <div className="text-[11px] text-neutral-400 mt-2">
                  客単価: <span className="text-white font-mono font-medium">¥{kpi.averageOrderValueJpy.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-neutral-800/80 border border-neutral-700/80 rounded-xl p-5">
                <span className="text-xs text-neutral-400 font-medium">総合ROAS（広告費用対効果）</span>
                <div className="text-2xl font-bold text-amber-400 mt-1.5 tabular-nums">
                  {kpi.roasOverall}x
                </div>
                <div className="text-[11px] text-neutral-400 mt-2">
                  出稿中キャンペーン: <span className="text-white font-medium">{kpi.activeAdCampaigns}件</span>
                </div>
              </div>

              <div className="bg-neutral-800/80 border border-neutral-700/80 rounded-xl p-5">
                <span className="text-xs text-neutral-400 font-medium">フィードCTR / 購買CVR</span>
                <div className="text-2xl font-bold text-white mt-1.5 tabular-nums">
                  {kpi.feedCtrPercent}% <span className="text-base text-neutral-400 font-normal">/ {kpi.conversionRatePercent}%</span>
                </div>
                <div className="text-[11px] text-neutral-400 mt-2">
                  総インプレッション: {kpi.totalImpressions.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Middle Grid: Channel Attribution & Creator Leaderboard */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Sales Channels Breakdown */}
              <div className="lg:col-span-5 bg-neutral-800/80 border border-neutral-700/80 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-white mb-4">
                  販売チャネル別シェア (Sales By Channel)
                </h3>
                <div className="space-y-3">
                  {kpi.salesByChannel.map((ch) => (
                    <div key={ch.channel}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-neutral-300">{ch.channel}</span>
                        <span className="font-semibold text-white tabular-nums">{ch.sharePercent}%</span>
                      </div>
                      <div className="w-full h-2 bg-neutral-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${ch.sharePercent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Creator Attribution Ranking */}
              <div className="lg:col-span-7 bg-neutral-800/80 border border-neutral-700/80 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-white mb-4">
                  トップクリエイター売上貢献度 (Creator Attribution)
                </h3>
                <div className="divide-y divide-neutral-700 text-xs">
                  {kpi.topPerformingCreators.map((creator, i) => (
                    <div key={creator.username} className="py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-5 text-neutral-400 font-mono font-bold">
                          0{i + 1}
                        </span>
                        <span className="font-semibold text-white">
                          {creator.username}
                        </span>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="text-neutral-400">
                          CVR: <span className="text-neutral-200">{creator.conversionRate}</span>
                        </span>
                        <span className="font-bold text-white tabular-nums">
                          ¥{creator.salesJpy.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Orders Live Table */}
            <div className="bg-neutral-800/80 border border-neutral-700/80 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-3">
                直近の決済・受注ログ (Realtime Orders)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-neutral-400 border-b border-neutral-700 pb-2">
                    <tr>
                      <th className="py-2 font-medium">注文ID</th>
                      <th className="py-2 font-medium">顧客</th>
                      <th className="py-2 font-medium">注文商品</th>
                      <th className="py-2 font-medium">合計金額</th>
                      <th className="py-2 font-medium">ステータス</th>
                      <th className="py-2 font-medium">流入元 (UTM)</th>
                      <th className="py-2 font-medium">時間</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-700/50">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-neutral-700/30">
                        <td className="py-2.5 font-mono text-neutral-300">{ord.id}</td>
                        <td className="py-2.5 font-medium text-white">{ord.customerName}</td>
                        <td className="py-2.5 text-neutral-300 max-w-xs truncate">
                          {ord.items.map((i) => `${i.productName} (${i.quantity})`).join(', ')}
                        </td>
                        <td className="py-2.5 font-bold text-white tabular-nums">
                          ¥{ord.totalAmountJpy.toLocaleString()}
                        </td>
                        <td className="py-2.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                            {ord.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-2.5 font-mono text-[11px] text-neutral-400 truncate max-w-[140px]">
                          {ord.utmAttribution || 'direct'}
                        </td>
                        <td className="py-2.5 text-neutral-400">{ord.createdAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FEED CMS & HOTSPOT PIN EDITOR */}
        {activeTab === 'feed_cms' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: New Post Form */}
            <div className="lg:col-span-6 bg-neutral-800/80 border border-neutral-700/80 rounded-xl p-6">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>新規体験型投稿の作成 (Create Shoppable Post)</span>
              </h3>

              <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
                <div>
                  <label className="block text-neutral-400 mb-1">投稿クリエイター名</label>
                  <input
                    type="text"
                    value={newPostAuthor}
                    onChange={(e) => setNewPostAuthor(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">カテゴリー</label>
                  <select
                    value={newPostCategory}
                    onChange={(e) => setNewPostCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white"
                  >
                    <option value="パンツ">パンツ</option>
                    <option value="スウェット">スウェット</option>
                    <option value="ポロシャツ">ポロシャツ</option>
                    <option value="Tシャツ">Tシャツ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">画像選択</label>
                  <select
                    value={newPostImage}
                    onChange={(e) => setNewPostImage(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white font-mono text-[11px]"
                  >
                    <option value="/src/assets/images/card_pants_sideline_cheering_1792551140173.jpg">
                      パンツ (サイドライン観戦・リラックストラウザー)
                    </option>
                    <option value="/src/assets/images/card_sweat_matchday_morning_1792551139398.jpg">
                      スウェット (SUVトランク・朝のキックオフ裏毛スウェット)
                    </option>
                    <option value="/src/assets/images/card_polo_sunlit_sideline_1792551140149.jpg">
                      ポロシャツ (グラウンドサイド・メリノニットポロ)
                    </option>
                    <option value="/src/assets/images/card_tee_trunk_gear_load_1792551140515.jpg">
                      Tシャツ (試合後ギア積載・ヘビーウェイトTシャツ)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">キャプション (ストーリー性のある体験テキスト)</label>
                  <textarea
                    rows={3}
                    value={newPostCaption}
                    onChange={(e) => setNewPostCaption(e.target.value)}
                    placeholder="着心地やクラフトマンシップ、日常の体験を記述..."
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500"
                  />
                </div>

                {/* Hotspot Tagging Settings */}
                <div className="p-3 bg-neutral-900/80 border border-neutral-700 rounded-lg space-y-3">
                  <p className="font-semibold text-neutral-300 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-amber-400" />
                    <span>写真上への商品タグ付け (Hotspot Pin)</span>
                  </p>

                  <div>
                    <label className="block text-neutral-400 mb-1">タグ付けする商品</label>
                    <select
                      value={selectedProductIdForTag}
                      onChange={(e) => setSelectedProductIdForTag(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-700 rounded text-white"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (¥{p.price.toLocaleString()})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-400 mb-1">X座標: {pinX}%</label>
                      <input
                        type="range"
                        min="10"
                        max="90"
                        value={pinX}
                        onChange={(e) => setPinX(Number(e.target.value))}
                        className="w-full accent-neutral-300"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 mb-1">Y座標: {pinY}%</label>
                      <input
                        type="range"
                        min="10"
                        max="90"
                        value={pinY}
                        onChange={(e) => setPinY(Number(e.target.value))}
                        className="w-full accent-neutral-300"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="is_sponsored"
                    checked={isPostSponsored}
                    onChange={(e) => setIsPostSponsored(e.target.checked)}
                    className="accent-indigo-500 rounded"
                  />
                  <label htmlFor="is_sponsored" className="text-neutral-300">
                    広告運用枠（Sponsored枠）として配信する
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  フィードへ公開
                </button>
              </form>
            </div>

            {/* Right: Live Interactive Pin Preview */}
            <div className="lg:col-span-6 bg-neutral-800/80 border border-neutral-700/80 rounded-xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white mb-2">
                  ピン配置プレビュー (Interactive Preview)
                </h3>
                <p className="text-xs text-neutral-400 mb-4">
                  画像をクリックしてピンのX・Y座標を直接指定できます。
                </p>

                <div
                  className="relative aspect-4/3 rounded-xl overflow-hidden bg-black border border-neutral-700 cursor-crosshair select-none"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
                    setPinX(x);
                    setPinY(y);
                  }}
                >
                  <img
                    src={newPostImage}
                    alt="Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />

                  {/* The interactive pin marker */}
                  <div
                    style={{ left: `${pinX}%`, top: `${pinY}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                  >
                    <div className="w-6 h-6 rounded-full bg-white text-neutral-900 flex items-center justify-center shadow-lg ring-2 ring-emerald-500 animate-bounce">
                      <Tag className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-neutral-900 border border-neutral-700 rounded-lg text-xs">
                <span className="text-neutral-400">現在公開中の投稿総数: </span>
                <span className="font-bold text-white tabular-nums">{posts.length} 件</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AD MANAGER & SPONSORED SLOTS */}
        {activeTab === 'ad_manager' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white">
                  広告運用・マーケティング枠管理 (Ad Manager)
                </h3>
                <p className="text-xs text-neutral-400">
                  Instagramフィード広告・カルーセル枠・ストーリータイアップの予算とROASを監視
                </p>
              </div>
            </div>

            {/* Campaign Table */}
            <div className="bg-neutral-800/80 border border-neutral-700/80 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-neutral-900 text-neutral-400 border-b border-neutral-700">
                  <tr>
                    <th className="px-4 py-3 font-semibold">キャンペーン名</th>
                    <th className="px-4 py-3 font-semibold">出稿主 (Advertiser)</th>
                    <th className="px-4 py-3 font-semibold">ステータス</th>
                    <th className="px-4 py-3 font-semibold">日次予算</th>
                    <th className="px-4 py-3 font-semibold">消化金額</th>
                    <th className="px-4 py-3 font-semibold">CTR</th>
                    <th className="px-4 py-3 font-semibold">CPC</th>
                    <th className="px-4 py-3 font-semibold">ROAS</th>
                    <th className="px-4 py-3 font-semibold text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-700/60">
                  {campaigns.map((camp) => (
                    <tr key={camp.id} className="hover:bg-neutral-700/20">
                      <td className="px-4 py-3 font-semibold text-white">
                        {camp.campaignName}
                        <div className="text-[10px] text-neutral-400 font-mono">
                          {camp.utmCampaign}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-neutral-300">{camp.advertiser}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            camp.status === 'active'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-neutral-900 text-neutral-400 border border-neutral-700'
                          }`}
                        >
                          {camp.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 tabular-nums text-white">
                        ¥{camp.dailyBudgetJpy.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 tabular-nums text-neutral-300">
                        ¥{camp.totalSpentJpy.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 tabular-nums text-white">
                        {camp.ctrPercent}%
                      </td>
                      <td className="px-4 py-3 tabular-nums text-neutral-300">
                        ¥{camp.cpcJpy.toFixed(1)}
                      </td>
                      <td className="px-4 py-3 tabular-nums font-bold text-amber-400">
                        {camp.roasMultiplier}x
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => toggleCampaignStatus(camp.id)}
                          className="px-2.5 py-1 text-[11px] font-medium bg-neutral-700 hover:bg-neutral-600 rounded text-white transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          {camp.status === 'active' ? (
                            <>
                              <Pause className="w-3 h-3" />
                              <span>一時停止</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3" />
                              <span>再開</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Launch New Campaign Form */}
            <div className="bg-neutral-800/80 border border-neutral-700/80 rounded-xl p-5">
              <h4 className="text-sm font-semibold text-white mb-3">
                新規マーケティング出稿枠の作成 (Deploy New Campaign)
              </h4>
              <form onSubmit={handleCreateCampaign} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="block text-neutral-400 mb-1">キャンペーン名称</label>
                  <input
                    type="text"
                    required
                    placeholder="例: Summer Linen Capsule"
                    value={newCampName}
                    onChange={(e) => setNewCampName(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">出稿ブランド / 広告主</label>
                  <input
                    type="text"
                    required
                    placeholder="例: AURA Atelier"
                    value={newCampAdvertiser}
                    onChange={(e) => setNewCampAdvertiser(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">日次予算 (JPY)</label>
                  <input
                    type="number"
                    step="5000"
                    value={newCampBudget}
                    onChange={(e) => setNewCampBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">UTM Campaign コード</label>
                  <input
                    type="text"
                    value={newCampUtm}
                    onChange={(e) => setNewCampUtm(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white font-mono text-[11px]"
                  />
                </div>
                <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-neutral-100 hover:bg-white text-neutral-950 font-bold rounded-lg transition-colors cursor-pointer text-xs"
                  >
                    キャンペーンを出稿
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 4: INVENTORY & CATALOG */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-white">
              商品カタログ・在庫管理 (Product Catalog & Inventory)
            </h3>

            <div className="bg-neutral-800/80 border border-neutral-700/80 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-neutral-900 text-neutral-400 border-b border-neutral-700">
                  <tr>
                    <th className="px-4 py-3 font-semibold">SKU</th>
                    <th className="px-4 py-3 font-semibold">商品</th>
                    <th className="px-4 py-3 font-semibold">ブランド</th>
                    <th className="px-4 py-3 font-semibold">価格 (JPY)</th>
                    <th className="px-4 py-3 font-semibold">在庫数</th>
                    <th className="px-4 py-3 font-semibold">在庫ステータス</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-700/60">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-neutral-700/20">
                      <td className="px-4 py-3 font-mono text-neutral-400">{p.sku}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-8 h-8 rounded object-cover border border-neutral-700"
                          />
                          <span className="font-semibold text-white">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-neutral-300">{p.brand}</td>
                      <td className="px-4 py-3 font-bold text-white tabular-nums">
                        ¥{p.price.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-mono text-neutral-200 tabular-nums">
                        {p.inventoryCount}
                      </td>
                      <td className="px-4 py-3">
                        {p.inventoryCount > 15 ? (
                          <span className="text-emerald-400 text-[11px] font-medium">在庫潤沢</span>
                        ) : (
                          <span className="text-amber-400 text-[11px] font-medium">要補充（残少）</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: PYTHON BACKEND SPECS & API TESTER */}
        {activeTab === 'api_docs' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Architecture & Monorepo Spec */}
              <div className="lg:col-span-5 bg-neutral-800/80 border border-neutral-700/80 rounded-xl p-5">
                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-indigo-400" />
                  <span>Vercel Monorepo ディレクトリ構造</span>
                </h3>
                <p className="text-xs text-neutral-400 mb-4">
                  同一Gitレポジトリ内で、フロントエンド (Node.js/Vite) とバックエンド (Python FastAPI Serverless) がデプロイされる構造です。
                </p>

                <pre className="p-3 bg-neutral-950 rounded-lg text-[11px] font-mono text-neutral-300 overflow-x-auto leading-relaxed border border-neutral-800">
{`├── api/
│   ├── index.py          # FastAPI App (/api/...)
│   ├── models.py         # Pydantic v2 & ORM
│   └── requirements.txt  # Python 依存関係
├── src/
│   ├── components/       # Instagram風UI
│   ├── views/            # Store & /admin
│   └── types/            # TypeScript 型定義
├── vercel.json           # Monorepo ルーティング
└── package.json          # Node.js 依存関係`}
                </pre>

                <div className="mt-4 p-3 bg-neutral-900 border border-neutral-700 rounded-lg text-xs space-y-2">
                  <p className="font-semibold text-neutral-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Python FastAPI の設計ポイント</span>
                  </p>
                  <ul className="text-neutral-400 space-y-1 list-disc pl-4 text-[11px]">
                    <li>Pydantic v2 による厳格な入力値バリデーション</li>
                    <li>Stripe Checkout / Webhook 決済連携モジュール</li>
                    <li>Instagram Graph API 経由のカタログ同期エンドポイント</li>
                    <li>UTMパラメータ解析によるクリエイター別ROAS計算</li>
                  </ul>
                </div>
              </div>

              {/* Live Interactive API Runner */}
              <div className="lg:col-span-7 bg-neutral-800/80 border border-neutral-700/80 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white mb-2">
                    FastAPI エンドポイント即時テスト (API Runner)
                  </h3>
                  <p className="text-xs text-neutral-400 mb-4">
                    エンドポイントを選択し、サーバーレス関数のレスポンスをシミュレーションします。
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {[
                      '/api/analytics/kpis',
                      '/api/campaigns',
                      '/api/products',
                      '/api/health'
                    ].map((ep) => (
                      <button
                        key={ep}
                        onClick={() => testApiCall(ep)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                          selectedApiEndpoint === ep
                            ? 'bg-indigo-600 text-white'
                            : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-700'
                        }`}
                      >
                        GET {ep}
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <div className="flex items-center justify-between px-3 py-1.5 bg-neutral-900 border-b border-neutral-800 text-[11px] font-mono text-neutral-400 rounded-t-lg">
                      <span>HTTP 200 OK · application/json</span>
                      <span>FastAPI Response</span>
                    </div>
                    <pre className="p-4 bg-neutral-950 rounded-b-lg text-xs font-mono text-emerald-400 overflow-x-auto max-h-72 border border-neutral-800">
                      {isApiLoading ? '// FastAPI 通信中...' : apiResponseJson}
                    </pre>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-neutral-500 pt-3 border-t border-neutral-700">
                  <span>FastAPI ドキュメント: /api/docs (Swagger UI)</span>
                  <span className="font-mono text-neutral-400">Pydantic v2.6+</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
