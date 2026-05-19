import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Tldraw, AssetRecordType, createShapeId, getHashForString, loadSnapshot } from 'tldraw';
import 'tldraw/tldraw.css';
import { LiveblocksProvider, RoomProvider, useRoom } from '@liveblocks/react';
import { useYjsStore } from './useYjsStore';

const LIVEBLOCKS_PUBLIC_KEY = 'pk_dev_HmjiBrl82vKEdKeBNAcQ8qVW31S9_FwWiKPR9utJDEddbLpCp5_30GMjxHsGkmHA';

function CollabTldraw({ onMount }) {
  const storeWithStatus = useYjsStore();
  return <Tldraw store={storeWithStatus} onMount={onMount} />;
}
import Anthropic from '@anthropic-ai/sdk';
import {
  Rocket, Mountain, Ship, Sprout, Bug, HardHat,
  Wind, RollerCoaster, Car, HeartHandshake, CalendarClock,
  KanbanSquare, ArrowRight, Play, LayoutGrid, CheckCircle2, RotateCcw,
  // 新增圖解所需的 icons
  Sun, CloudRain, Leaf, Circle, TrendingDown, Compass, CloudLightning, Scissors,
  Anchor, AlertTriangle, Droplets, Feather, Share2, Wrench, Briefcase, Building,
  MapPin, Flame, ShieldAlert, Battery, Octagon, Flag, Search, Maximize,
  MessageSquare, Target, Activity, Calendar, Coffee, Package, Lightbulb,
  FileText, Beaker, ArrowLeft, ArrowUp, Hash, Link, PanelLeftClose, PanelLeftOpen, ClipboardPaste
} from 'lucide-react';

// 新增：通用底層標籤的顏色樣式對照表
const getTagStyle = (tag) => {
  if (tag.includes('值得分享') || tag.includes('慶祝')) return 'bg-amber-100 text-amber-700 border-amber-200';
  if (tag.includes('保持')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  if (tag.includes('阻礙')) return 'bg-red-100 text-red-700 border-red-200';
  if (tag.includes('嘗試')) return 'bg-blue-100 text-blue-700 border-blue-200';
  if (tag.includes('風險') || tag.includes('疑惑')) return 'bg-orange-100 text-orange-700 border-orange-200';
  if (tag.includes('學習')) return 'bg-purple-100 text-purple-700 border-purple-200';
  if (tag.includes('心路歷程')) return 'bg-slate-100 text-slate-600 border-slate-200';
  if (tag.includes('需要改變')) return 'bg-indigo-100 text-indigo-700 border-indigo-200';
  if (tag.includes('值得投資')) return 'bg-teal-100 text-teal-600 border-teal-200';
  return 'bg-slate-100 text-slate-700 border-slate-200';
};

// 資料庫：12種 Retrospective 模式
const patternsData = [
  {
    id: 1,
    name: "小青蛙回顧法 (Mr. Frog)",
    icon: <Bug className="w-6 h-6 text-green-500" />,
    category: "破冰與趣味",
    imageUrl: "https://i0.wp.com/scrumadventures.com/wp-content/uploads/2021/02/Retrospectives-and-Random-Clip-Art-2.jpg?w=1320&ssl=1",
    pros: "介面可愛，分類簡單明確。具象化問題能讓團隊以輕鬆視角表達不滿。",
    cons: "意象較發散，初次使用需花時間解釋區塊意義。",
    scenario: "年輕團隊、剛成軍的團隊，或是 Sprint 壓力極大，需要可愛框架舒緩情緒時。",
    tags: ["新手友善", "輕鬆可愛", "舒緩壓力"],
    areas: [
      { name: "太陽 (Ms. Sun)", icon: <Sun className="w-6 h-6"/>, colorBg: "bg-amber-100 text-amber-600", desc: "回顧期間發生的好事！值得大家一起慶祝、或是進行得很順利的地方。", commonTags: ["#值得分享 (Share)", "#心路歷程 (Reflect)"] },
      { name: "小青蛙 (Mr. Frog)", icon: <Bug className="w-6 h-6"/>, colorBg: "bg-green-100 text-green-600", desc: "遇到困難了嗎？寫下你需要團隊幫助、需要新工具或培訓的地方。", commonTags: ["#值得投資 (Invest)"] },
      { name: "沼澤 (The Swamp)", icon: <CloudRain className="w-6 h-6"/>, colorBg: "bg-slate-200 text-slate-600", desc: "哪些事情讓你覺得深陷泥沼？寫下不清楚、難以克服或進展緩慢的任務。", commonTags: ["#遇到阻礙 (Blocker)", "#潛在風險 (Risk)"] },
      { name: "荷葉 (Lily Pads)", icon: <Leaf className="w-6 h-6"/>, colorBg: "bg-emerald-100 text-emerald-600", desc: "我們的救生圈是什麼？寫下那些幫助我們保持穩定、需要繼續維持的好習慣。", commonTags: ["#繼續保持 (Keep)"] },
      { name: "青蛙卵 (Frog Eggs)", icon: <Circle className="w-6 h-6"/>, colorBg: "bg-blue-100 text-blue-600", desc: "孵化新點子！建議團隊下個 Sprint 可以嘗試的新事物或開始做的事。", commonTags: ["#新嘗試 (Start)"] }
    ]
  },
  {
    id: 2,
    name: "高山回顧法 (Mountain)",
    icon: <Mountain className="w-6 h-6 text-slate-600" />,
    category: "目標與動力",
    imageUrl: "https://i0.wp.com/scrumadventures.com/wp-content/uploads/2021/02/The-Mountain-Retrospective.jpg?w=1320&ssl=1",
    pros: "視覺化直覺，強調前進動力與阻礙。有效將焦點放在「如何更快達標」。",
    cons: "容易讓團隊只關注任務與產出，忽略人際關係或情感交流。",
    scenario: "團隊正朝著明確的重大發布 (Release) 前進，或近期進度緩慢需找出瓶頸時。",
    tags: ["目標導向", "排除阻礙", "衝刺期"],
    areas: [
      { name: "太陽 (Sun)", icon: <Sun className="w-6 h-6"/>, colorBg: "bg-amber-100 text-amber-600", desc: "光明的時刻！分享專案中值得慶祝、進展順利的成就。", commonTags: ["#值得分享 (Share)"] },
      { name: "攀登 (Climbing)", icon: <ArrowUp className="w-6 h-6"/>, colorBg: "bg-blue-100 text-blue-600", desc: "我們正在努力往上爬的部分。寫下團隊穩步推進、需要繼續堅持的事情。", commonTags: ["#繼續保持 (Keep)"] },
      { name: "跌落 (Falling)", icon: <TrendingDown className="w-6 h-6"/>, colorBg: "bg-red-100 text-red-600", desc: "失足的危險！需要注意的失誤、風險，或讓我們退步的原因。", commonTags: ["#潛在風險 (Risk)"] },
      { name: "指南針 (Compass)", icon: <Compass className="w-6 h-6"/>, colorBg: "bg-indigo-100 text-indigo-600", desc: "指引方向。我們接下來應該「開始做」哪些新嘗試來幫助攻頂？", commonTags: ["#新嘗試 (Start)"] },
      { name: "風暴 (Storm)", icon: <CloudLightning className="w-6 h-6"/>, colorBg: "bg-slate-200 text-slate-700", desc: "遇到亂流了。寫下我們面臨的挑戰、模糊不清的需求或外部阻礙。", commonTags: ["#遇到阻礙 (Blocker)"] },
      { name: "雜草 (Weeds)", icon: <Scissors className="w-6 h-6"/>, colorBg: "bg-green-100 text-green-700", desc: "絆住腳步的東西。哪些是浪費時間的流程？我們應該「停止做」什麼？", commonTags: ["#需要改變 (Change)"] }
    ]
  },
  {
    id: 3,
    name: "海盜船回顧法 (Pirate Ship)",
    icon: <Ship className="w-6 h-6 text-amber-700" />,
    category: "破冰與趣味",
    imageUrl: "https://i0.wp.com/scrumadventures.com/wp-content/uploads/2021/02/Pirate-Ship-Retrospective.jpg?w=1320&ssl=1",
    pros: "娛樂性極高，可透過角色扮演打破僵局，讓會議充滿活力。",
    cons: "嚴肅團隊可能覺得尷尬；新鮮感易退，不適合連續使用。",
    scenario: "團隊氣氛低迷、對制式會議感到疲乏 (Retro Fatigue)，需要輕鬆破冰時。",
    tags: ["高度互動", "打破僵局", "角色扮演"],
    areas: [
      { name: "風 (Wind)", icon: <Wind className="w-6 h-6"/>, colorBg: "bg-sky-100 text-sky-600", desc: "推動我們揚帆的力量！什麼事情或誰正在激勵團隊、推動我們全速前進？", commonTags: ["#繼續保持 (Keep)"] },
      { name: "錨 (Anchor)", icon: <Anchor className="w-6 h-6"/>, colorBg: "bg-slate-200 text-slate-700", desc: "拖慢速度的重物。什麼事情阻礙了我們、把我們留在原地？", commonTags: ["#需要改變 (Change)"] },
      { name: "礁石 (Rocks)", icon: <AlertTriangle className="w-6 h-6"/>, colorBg: "bg-red-100 text-red-600", desc: "前方的潛在危機！我們需要留意哪些即將到來的風險或技術坑？", commonTags: ["#潛在風險 (Risk)"] },
      { name: "太陽 (Sun)", icon: <Sun className="w-6 h-6"/>, colorBg: "bg-amber-100 text-amber-600", desc: "寶藏與高光時刻！分享進展得特別棒、閃閃發光的成就。", commonTags: ["#值得分享 (Share)"] },
      { name: "船艦 (Ship)", icon: <Ship className="w-6 h-6"/>, colorBg: "bg-amber-100 text-amber-800", desc: "我們的堅強後盾。是哪個流程、工具或夥伴讓團隊保持穩定和強大？", commonTags: ["#繼續保持 (Keep)"] }
    ]
  },
  {
    id: 4,
    name: "花園回顧法 (Garden)",
    icon: <Sprout className="w-6 h-6 text-emerald-500" />,
    category: "安全與文化",
    imageUrl: "https://i0.wp.com/scrumadventures.com/wp-content/uploads/2021/02/the-garden-retrospective.jpg?resize=1536%2C864&ssl=1",
    pros: "帶有強烈「心理安全感」與培育意象，討論除草/病蟲害時語氣較溫和。",
    cons: "隱喻較柔和，有時可能導致團隊避重就輕，忽略核心硬性問題。",
    scenario: "團隊經歷文化轉型、有新成員加入需培養默契，或需處理技術債時。",
    tags: ["心理安全", "團隊建立", "溫和溝通"],
    areas: [
      { name: "花圃 (Garden)", icon: <Sprout className="w-6 h-6"/>, colorBg: "bg-green-100 text-green-600", desc: "正在盛開的花朵！寫下團隊中成長良好、和諧且運作順利的部分。", commonTags: ["#繼續保持 (Keep)", "#值得分享 (Share)"] },
      { name: "澆水罐 (Watering Can)", icon: <Droplets className="w-6 h-6"/>, colorBg: "bg-blue-100 text-blue-600", desc: "需要更多滋潤的地方。哪些事情我們應該投入更多時間或資源？", commonTags: ["#值得投資 (Invest)"] },
      { name: "剪刀 (Shears)", icon: <Scissors className="w-6 h-6"/>, colorBg: "bg-slate-100 text-slate-600", desc: "需要修剪的枝葉。我們應該減少做什麼？(例如：無效會議、過度設計)", commonTags: ["#需要改變 (Change)"] },
      { name: "鳥巢 (Bird's Nest)", icon: <Feather className="w-6 h-6"/>, colorBg: "bg-amber-100 text-amber-700", desc: "孕育新生命。團隊最近有什麼新發現，或者想嘗試什麼新方法？", commonTags: ["#學習發現 (Learn)", "#新嘗試 (Start)"] },
      { name: "病蟲害 (Disease)", icon: <Bug className="w-6 h-6"/>, colorBg: "bg-red-100 text-red-600", desc: "啃食我們花園的害蟲。需要留心的系統漏洞、技術債或潛在風險。", commonTags: ["#潛在風險 (Risk)"] }
    ]
  },
  {
    id: 5,
    name: "蜘蛛回顧法 (Spider)",
    icon: <Bug className="w-6 h-6 text-gray-800" />,
    category: "破冰與趣味",
    imageUrl: "https://i0.wp.com/scrumadventures.com/wp-content/uploads/2021/02/Spider-Retrospective.jpg?resize=1536%2C864&ssl=1",
    pros: "將問題具象化為蜘蛛網，讓抱怨變得無害且有趣。",
    cons: "與小青蛙類似，需要前置解釋，適合的問題深度有限。",
    scenario: "需要一個無壓力的環境讓團隊宣洩不滿或提出簡單建議時。",
    tags: ["情緒宣洩", "簡單直覺", "趣味性"],
    areas: [
      { name: "蜘蛛網 (Web)", icon: <Share2 className="w-6 h-6"/>, colorBg: "bg-slate-200 text-slate-700", desc: "被困住了！寫下這個 Sprint 中讓你覺得不喜歡、煩人或被絆住的事情。", commonTags: ["#遇到阻礙 (Blocker)"] },
      { name: "太陽 (Sun)", icon: <Sun className="w-6 h-6"/>, colorBg: "bg-amber-100 text-amber-500", desc: "溫暖的陽光！分享你熱愛、覺得做起來很有成就感的部分。", commonTags: ["#值得分享 (Share)"] },
      { name: "戴帽子的小花 (Top Hat Flower)", icon: <Sprout className="w-6 h-6"/>, colorBg: "bg-green-100 text-green-600", desc: "奇妙的生長！哪些事情正在順利發展、或者團隊表現得特別好？", commonTags: ["#繼續保持 (Keep)"] },
      { name: "花盆 (Flower Pots)", icon: <Briefcase className="w-6 h-6"/>, colorBg: "bg-orange-100 text-orange-700", desc: "換個盆子會更好。寫下你覺得可以改變作法、稍作改進的地方。", commonTags: ["#需要改變 (Change)"] }
    ]
  },
  {
    id: 6,
    name: "施工現場回顧法 (Construction Zone)",
    icon: <HardHat className="w-6 h-6 text-yellow-500" />,
    category: "務實與技術",
    imageUrl: "https://i0.wp.com/scrumadventures.com/wp-content/uploads/2021/08/constructionzone-retrospective.png?resize=1536%2C864&ssl=1",
    pros: "務實且具體，強調工具、計畫與能量補充。行動導向強。",
    cons: "缺乏對情緒或軟技能的探討，易變成純工程檢討會。",
    scenario: "高度技術導向團隊、基礎設施團隊，或啟動全新架構/專案初期。",
    tags: ["務實導向", "技術團隊", "行動力"],
    areas: [
      { name: "藍圖 (Plans)", icon: <FileText className="w-6 h-6"/>, colorBg: "bg-blue-100 text-blue-600", desc: "未來的設計圖。我們接下來應該嘗試的新作法，或是需要修改計畫的地方。", commonTags: ["#新嘗試 (Start)"] },
      { name: "工具箱 (Toolbox)", icon: <Wrench className="w-6 h-6"/>, colorBg: "bg-slate-200 text-slate-700", desc: "鎖緊螺絲！哪些工具、技術或流程讓我們保持穩定、扎實地推進？", commonTags: ["#繼續保持 (Keep)"] },
      { name: "便當盒 (Lunchbox)", icon: <Briefcase className="w-6 h-6"/>, colorBg: "bg-amber-100 text-amber-600", desc: "補充體力！團隊需要更多什麼？(可能是更多溝通、更多測試時間、或下午茶)", commonTags: ["#值得投資 (Invest)"] },
      { name: "三角錐 (Cone)", icon: <AlertTriangle className="w-6 h-6"/>, colorBg: "bg-orange-100 text-orange-600", desc: "施工危險請繞道。我們需要特別注意、小心避開的坑或風險在哪裡？", commonTags: ["#潛在風險 (Risk)"] },
      { name: "吊車與建築 (Building & Crane)", icon: <Building className="w-6 h-6"/>, colorBg: "bg-emerald-100 text-emerald-600", desc: "順利建成的部分。大聲肯定那些運作良好、成功蓋好的功能或模組！", commonTags: ["#值得分享 (Share)"] }
    ]
  },
  {
    id: 7,
    name: "熱氣球回顧法 (Hot Air Balloon)",
    icon: <Wind className="w-6 h-6 text-sky-500" />,
    category: "目標與動力",
    imageUrl: "https://i0.wp.com/scrumadventures.com/wp-content/uploads/2021/07/hotairballoon-retrospective.png?resize=1536%2C864&ssl=1",
    pros: "結合動力(風)與阻力(風暴)，非常適合檢視團隊的上升勢頭。",
    cons: "對於細節問題的探討較不具體。",
    scenario: "團隊需要回顧大方向、檢視整體視野與潛在未知風險時。",
    tags: ["大局觀", "動力檢視", "願景"],
    areas: [
      { name: "飛鳥 (Birds)", icon: <Feather className="w-6 h-6"/>, colorBg: "bg-sky-100 text-sky-500", desc: "乘風而起的動力！什麼人事物是我們翅膀下的風，激勵著我們向上？", commonTags: ["#繼續保持 (Keep)"] },
      { name: "熱氣球 (Hot Air Balloon)", icon: <Wind className="w-6 h-6"/>, colorBg: "bg-red-100 text-red-500", desc: "升空的美景。分享團隊的成功、成就與令人興奮的里程碑。", commonTags: ["#值得分享 (Share)"] },
      { name: "暴風雲 (Storm Clouds)", icon: <CloudLightning className="w-6 h-6"/>, colorBg: "bg-slate-200 text-slate-700", desc: "惡劣天氣。這個 Sprint 中哪些事情很困難、讓人害怕或狀況不明確？", commonTags: ["#遇到阻礙 (Blocker)"] },
      { name: "未知森林 (Forest)", icon: <MapPin className="w-6 h-6"/>, colorBg: "bg-green-100 text-green-700", desc: "不要掉進去！我們需要停止做什麼事，或者有哪些未知的領域需要釐清？", commonTags: ["#潛在風險 (Risk)", "#需要改變 (Change)"] }
    ]
  },
  {
    id: 8,
    name: "繁忙樂園回顧法 (Busyland)",
    icon: <RollerCoaster className="w-6 h-6 text-purple-500" />,
    category: "情緒與體驗",
    imageUrl: "https://i0.wp.com/scrumadventures.com/wp-content/uploads/2021/08/busylandretrospective.png?resize=1536%2C864&ssl=1",
    pros: "高度聚焦「情緒旅程」，能挖掘出平時隱藏的心理狀態 (如鬼屋驚嚇)。",
    cons: "若缺乏心理安全感，成員可能不敢真實分享「搞砸」的經歷。",
    scenario: "經歷了混亂、需求變動劇烈、或充滿驚險救火事件的 Sprint 後。",
    tags: ["情緒復盤", "高低潮檢視", "混亂後覆盤"],
    areas: [
      { name: "高山 (Mountain)", icon: <Mountain className="w-6 h-6"/>, colorBg: "bg-sky-100 text-sky-600", desc: "像雲霄飛車一樣！分享 Sprint 中令人極度興奮、覺得特別有趣的事情。", commonTags: ["#值得分享 (Share)"] },
      { name: "城堡 (Castle)", icon: <Building className="w-6 h-6"/>, colorBg: "bg-indigo-100 text-indigo-500", desc: "魔法時刻！那些令人難忘、充滿 Wow 驚嘆號、表現絕佳的不可思議時刻。", commonTags: ["#值得分享 (Share)"] },
      { name: "潛水艇 (Submarine)", icon: <Anchor className="w-6 h-6"/>, colorBg: "bg-blue-100 text-blue-800", desc: "沉入水底。覺得沮喪、失敗、或者進行得很不順利、沉沒的任務。", commonTags: ["#遇到阻礙 (Blocker)"] },
      { name: "爆米花 (Popcorn)", icon: <Flame className="w-6 h-6"/>, colorBg: "bg-amber-100 text-amber-600", desc: "補充樂園能量。哪些事情充滿活力、提供了養分，讓團隊充滿幹勁？", commonTags: ["#繼續保持 (Keep)"] },
      { name: "鬼屋 (Haunted House)", icon: <ShieldAlert className="w-6 h-6"/>, colorBg: "bg-slate-200 text-slate-800", desc: "嚇死人了！工作中有哪些部分很可怕、充滿危機、下次絕對要小心避開？", commonTags: ["#潛在風險 (Risk)"] }
    ]
  },
  {
    id: 9,
    name: "賽車回顧法 (Racecar)",
    icon: <Car className="w-6 h-6 text-red-500" />,
    category: "目標與動力",
    imageUrl: "https://i0.wp.com/scrumadventures.com/wp-content/uploads/2021/08/racecar-retrospective.png?resize=1536%2C864&ssl=1",
    pros: "速度感極強，強調「煞車/降落傘」與「引擎」的對比。",
    cons: "容易給人壓迫感，不適合已經過勞的團隊。",
    scenario: "團隊需要極速衝刺，或者需要立刻找出拖慢整體速度的元凶時。",
    tags: ["速度感", "衝刺期", "效率優化"],
    areas: [
      { name: "降落傘 (Parachute)", icon: <CloudRain className="w-6 h-6"/>, colorBg: "bg-slate-100 text-slate-500", desc: "阻力來源。是什麼拖慢了我們的開發速度？(例：無止盡的開會、環境設定)", commonTags: ["#遇到阻礙 (Blocker)"] },
      { name: "電動引擎 (Electric Vehicle)", icon: <Battery className="w-6 h-6"/>, colorBg: "bg-green-100 text-green-600", desc: "動力來源。什麼事情或工具為我們充電，推動我們高速往前衝？", commonTags: ["#繼續保持 (Keep)"] },
      { name: "停止標誌 (Stop Sign)", icon: <Octagon className="w-6 h-6"/>, colorBg: "bg-red-100 text-red-600", desc: "立刻煞車！我們必須馬上「停止做」的壞習慣或無效流程是什麼？", commonTags: ["#需要改變 (Change)"] },
      { name: "終點線 (Finish Line)", icon: <Flag className="w-6 h-6"/>, colorBg: "bg-blue-100 text-blue-600", desc: "衝線時刻！我們是如何受到激勵的？達到目標後我們該如何慶祝？", commonTags: ["#值得分享 (Share)", "#新嘗試 (Start)"] }
    ]
  },
  {
    id: 10,
    name: "Scrum 價值觀回顧法 (Scrum Values)",
    icon: <HeartHandshake className="w-6 h-6 text-blue-600" />,
    category: "流程與核心",
    imageUrl: "https://i0.wp.com/scrumadventures.com/wp-content/uploads/2021/08/scrumvalues-retrospective.png?resize=1536%2C864&ssl=1",
    pros: "拉回敏捷初心，檢視團隊的專注、開放、尊重、勇氣、承諾。",
    cons: "討論可能較抽象，較難產出下個 Sprint 立刻能執行的具體行動。",
    scenario: "團隊出現信任危機、推卸責任，或迷失在日常瑣事忘記敏捷精神時。",
    tags: ["敏捷初心", "信任建立", "深度對話"],
    areas: [
      { name: "專注 (Focus/Magnifying Glass)", icon: <Search className="w-6 h-6"/>, colorBg: "bg-blue-100 text-blue-600", desc: "放大鏡檢視：我們在衝刺期間是否夠專注？接下來最需要聚焦在哪件事上？", commonTags: ["#新嘗試 (Start)", "#遇到阻礙 (Blocker)"] },
      { name: "開放 (Openness/Window)", icon: <Maximize className="w-6 h-6"/>, colorBg: "bg-sky-100 text-sky-500", desc: "打開天窗說亮話：有什麼事情擋住了視線？我們在資訊同步上夠透明嗎？", commonTags: ["#遇到阻礙 (Blocker)", "#潛在風險 (Risk)"] },
      { name: "尊重 (Respect/Handshake)", icon: <HeartHandshake className="w-6 h-6"/>, colorBg: "bg-pink-100 text-pink-600", desc: "握手言和：不論成功或失敗，我們是否有尊重彼此的專業與付出？", commonTags: ["#值得分享 (Share)", "#繼續保持 (Keep)"] },
      { name: "勇氣 (Courage/Meeting)", icon: <MessageSquare className="w-6 h-6"/>, colorBg: "bg-amber-100 text-amber-600", desc: "勇敢發聲：我們在哪裡表現出勇氣？又有哪裡因為不敢說真話而妥協了？", commonTags: ["#學習發現 (Learn)", "#新嘗試 (Start)"] },
      { name: "承諾 (Commitment/Goal)", icon: <Target className="w-6 h-6"/>, colorBg: "bg-emerald-100 text-emerald-600", desc: "目標約定：我們對 Sprint 目標以及對團隊彼此的承諾，是否都有盡力達成？", commonTags: ["#繼續保持 (Keep)"] }
    ]
  },
  {
    id: 11,
    name: "Scrum 事件回顧法 (Scrum Events)",
    icon: <CalendarClock className="w-6 h-6 text-indigo-500" />,
    category: "流程與核心",
    imageUrl: "https://i0.wp.com/scrumadventures.com/wp-content/uploads/2021/12/scrumevents-retrospective.png?resize=1536%2C864&ssl=1",
    pros: "直接實用。精準檢視各項會議效率，能立即優化團隊工作節奏。",
    cons: "過程可能較枯燥，只關注「流程」，忽略「人」與「技術」。",
    scenario: "團隊覺得 Scrum 會議太長、無效、流於形式 (如 Daily 變進度匯報) 時。",
    tags: ["流程優化", "會議瘦身", "務實檢討"],
    areas: [
      { name: "Sprint 整體 (Sprint)", icon: <Activity className="w-6 h-6"/>, colorBg: "bg-blue-100 text-blue-600", desc: "宏觀來看，我們該如何改進，才能更穩定、一致地達成 Sprint 目標？", commonTags: ["#新嘗試 (Start)"] },
      { name: "規劃會議 (Planning/Joggers)", icon: <Calendar className="w-6 h-6"/>, colorBg: "bg-indigo-100 text-indigo-600", desc: "起跑準備：我們怎麼把 Planning 開得更好，確保選入的工作最有價值？", commonTags: ["#新嘗試 (Start)", "#需要改變 (Change)"] },
      { name: "每日站會 (Daily/Coffee)", icon: <Coffee className="w-6 h-6"/>, colorBg: "bg-amber-100 text-amber-700", desc: "早晨咖啡：Daily 是否有效幫助我們同步阻礙？目前還有什麼沒講出來的 Blockers？", commonTags: ["#遇到阻礙 (Blocker)"] },
      { name: "展示會議 (Review/Parcel)", icon: <Package className="w-6 h-6"/>, colorBg: "bg-emerald-100 text-emerald-600", desc: "交付包裹：如何讓 Review 變成真實獲取回饋的「工作會議」，而不是單向簡報？", commonTags: ["#新嘗試 (Start)", "#繼續保持 (Keep)"] },
      { name: "回顧會議 (Retro/Lightbulb)", icon: <Lightbulb className="w-6 h-6"/>, colorBg: "bg-yellow-100 text-yellow-600", desc: "燈泡亮起：我們自己這個 Retro 會議還能怎麼改善，讓團隊擁有更好的自我管理？", commonTags: ["#學習發現 (Learn)"] }
    ]
  },
  {
    id: 12,
    name: "團隊回顧畫布 (Team Canvas)",
    icon: <KanbanSquare className="w-6 h-6 text-teal-600" />,
    category: "流程與核心",
    imageUrl: "https://i0.wp.com/scrumadventures.com/wp-content/uploads/2022/07/team-retrospective-canvas.png?resize=1536%2C864&ssl=1",
    pros: "結構化極強，強迫團隊設計「實驗」在下個 Sprint 驗證，數據驅動。",
    cons: "填寫與引導門檻高，對不習慣系統性思考的團隊負擔大。",
    scenario: "高成熟度敏捷團隊，厭倦只講 Good/Bad，需以假設驗證驅動持續改善時。",
    tags: ["高成熟度", "實驗精神", "數據驅動"],
    areas: [
      { name: "發現痛點 (Problem)", icon: <AlertTriangle className="w-6 h-6"/>, colorBg: "bg-red-100 text-red-600", desc: "我們觀察到了什麼現象？(例：Code Review 總是拖到最後一天)", commonTags: ["#遇到阻礙 (Blocker)"] },
      { name: "提出假設 (Hypothesis)", icon: <Lightbulb className="w-6 h-6"/>, colorBg: "bg-amber-100 text-amber-500", desc: "為什麼會發生？我們猜測原因是什麼？(例：因為大家早上都在開會沒空看)", commonTags: ["#學習發現 (Learn)"] },
      { name: "設計實驗 (Experiment)", icon: <Beaker className="w-6 h-6"/>, colorBg: "bg-purple-100 text-purple-600", desc: "下個 Sprint 我們要「試著改變什麼作法」來解決它？(例：規定每天下午 2 點為 PR 時間)", commonTags: ["#新嘗試 (Start)"] },
      { name: "驗證指標 (Metrics)", icon: <Target className="w-6 h-6"/>, colorBg: "bg-emerald-100 text-emerald-600", desc: "我們怎麼知道實驗成功了沒？要看什麼數據？(例：PR 平均停留時間低於 24 小時)", commonTags: ["#學習發現 (Learn)"] }
    ]
  }
];

// 測驗題目選項
const quizOptions = [
  {
    id: 'A',
    text: "氣氛低迷或大家覺得開會很無聊，需要破冰與歡樂感。",
    results: [3, 1, 5] // Pirate, Frog, Spider
  },
  {
    id: 'B',
    text: "正全力衝刺大目標（如重大發布），需要排除阻礙、提升速度。",
    results: [9, 2, 7] // Racecar, Mountain, Balloon
  },
  {
    id: 'C',
    text: "團隊剛建立或有新成員，需要培養默契、建立心理安全感。",
    results: [4, 1] // Garden, Frog
  },
  {
    id: 'D',
    text: "剛經歷一場混亂、頻繁救火的 Sprint，大家心情像洗三溫暖。",
    results: [8, 6] // Busyland, Construction
  },
  {
    id: 'E',
    text: "覺得敏捷流程流於形式（會議太冗長），或團隊出現信任/溝通危機。",
    results: [11, 10] // Events, Values
  },
  {
    id: 'F',
    text: "我們團隊很成熟了！想要更系統化、用實驗數據來推動持續改善。",
    results: [12] // Canvas
  }
];

// ── Sprint 自動計算（基準：Sprint 56，2026-05-18，每兩週一個）──────────────
const SPRINT_BASE = { number: 56, start: new Date('2026-05-18') };
function getCurrentSprintInfo() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysDiff = Math.floor((today - SPRINT_BASE.start) / (1000 * 60 * 60 * 24));
  const sprintOffset = Math.max(0, Math.floor(daysDiff / 14));
  const sprintNumber = SPRINT_BASE.number + sprintOffset;
  const startDate = new Date(SPRINT_BASE.start);
  startDate.setDate(startDate.getDate() + sprintOffset * 14);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 13);
  const fmt = (d) => d.toISOString().slice(0, 10);
  return { sprintNumber, startDate: fmt(startDate), endDate: fmt(endDate) };
}

// ── Debrief utilities ────────────────────────────────────────────────────────
function extractPlainText(richText) {
  if (!richText) return '';
  const texts = [];
  const traverse = (node) => {
    if (node?.type === 'text' && node.text) texts.push(node.text);
    if (node?.content) node.content.forEach(traverse);
  };
  traverse(richText);
  return texts.join('');
}

function extractNotesFromSnapshot(snapshot) {
  // 相容兩種格式：TLEditorSnapshot ({document: {store}}) 和 TLStoreSnapshot ({store})
  const store = snapshot?.document?.store || snapshot?.store || {};
  return Object.values(store)
    .filter(r => r.typeName === 'shape' && r.type === 'note')
    .map(r => ({ id: r.id, text: (extractPlainText(r.props?.richText) || r.props?.text || '').trim() }))
    .filter(n => n.text.length > 0);
}

export default function App() {
  const [view, setView] = useState('home'); // 'home', 'quiz', 'result', 'all', 'detail', 'board', 'history', 'debrief'
  const [sprintNumber, setSprintNumber] = useState('');
  const [sprintStartDate, setSprintStartDate] = useState('');
  const [sprintEndDate, setSprintEndDate] = useState('');
  const [savedMsg, setSavedMsg] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sessionToRestore, setSessionToRestore] = useState(null);
  const editorRef = useRef(null);
  const currentSessionIdRef = useRef(null);
  const autoSaveTimerRef = useRef(null);
  const [recommendedIds, setRecommendedIds] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedPattern, setSelectedPattern] = useState(null); // 新增：追蹤目前查看詳細內容的 pattern

  // Collab room state
  const [roomId, setRoomId] = useState(() => {
    const m = window.location.hash.match(/^#collab-([0-9a-f-]+)$/);
    return m ? m[1] : null;
  });
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (view !== 'board') return;
    if (roomId) return; // 保留已有的 roomId（來自分享連結）
    const id = crypto.randomUUID();
    setRoomId(id);
    window.location.hash = `collab-${id}`;
  }, [view]);

  // Bulk import state
  const [bulkText, setBulkText] = useState('');
  const [showBulkInput, setShowBulkInput] = useState(false);

  // Debrief state
  const [debriefSession, setDebriefSession] = useState(null);
  const [debriefNotes, setDebriefNotes] = useState([]); // [{id, text, areaIndex}]
  const [debriefLoading, setDebriefLoading] = useState(false);
  const [debriefError, setDebriefError] = useState('');
  const [debriefApiKey, setDebriefApiKey] = useState(() => localStorage.getItem('retro-api-key') || '');
  const [reassignTarget, setReassignTarget] = useState(null); // noteId being reassigned
  const autoCategFiredRef = useRef(false);
  const [debriefActionItems, setDebriefActionItems] = useState([]); // [{id, text, done}]
  const [debriefActionInput, setDebriefActionInput] = useState('');
  const [pendingLinkNoteId, setPendingLinkNoteId] = useState(null);
  const actionItemInputRef = useRef(null);
  const [debriefSuggestions, setDebriefSuggestions] = useState('');
  const [debriefSuggestionsLoading, setDebriefSuggestionsLoading] = useState(false);

  // 新增：開始測驗並重置選取狀態
  const startQuiz = () => {
    setSelectedOptions([]);
    setView('quiz');
  };

  // 新增：切換選項選取狀態
  const toggleOption = (id) => {
    setSelectedOptions(prev =>
      prev.includes(id)
        ? prev.filter(optId => optId !== id)
        : [...prev, id]
    );
  };

  // 修改：送出複選結果，並計算權重取前 3 名
  const handleSubmitQuiz = () => {
    if (selectedOptions.length === 0) return;

    // 收集所有選中選項的推薦 IDs（保留重複以計算頻率）
    let allIds = [];
    selectedOptions.forEach(optId => {
      const option = quizOptions.find(o => o.id === optId);
      if (option) {
        allIds = [...allIds, ...option.results];
      }
    });

    // 計算每個 pattern 被推薦的次數 (權重)
    const frequencyMap = {};
    allIds.forEach(id => {
      frequencyMap[id] = (frequencyMap[id] || 0) + 1;
    });

    // 根據被推薦的次數進行降冪排序，並只取前 3 名
    const top3Ids = Object.keys(frequencyMap)
      .map(id => Number(id))
      .sort((a, b) => frequencyMap[b] - frequencyMap[a])
      .slice(0, 3);

    setRecommendedIds(top3Ids);
    setView('result');
  };

  const renderHome = () => (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="bg-blue-100 p-4 rounded-full mb-6">
        <Rocket className="w-12 h-12 text-blue-600" />
      </div>
      <h1 className="text-4xl font-bold text-slate-800 mb-4">
        找尋最適合的 Retrospective 模式
      </h1>
      <p className="text-lg text-slate-600 max-w-2xl mb-10">
        不知道下一次 Sprint 回顧會議該用哪一種模式嗎？<br/>
        透過一題簡單的團隊現況測驗，讓我們為您推薦最適合的框架，或者您也可以直接探索所有 12 種模式。
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={startQuiz}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-lg shadow-blue-200"
        >
          <Play className="w-5 h-5" />
          開始快速測驗
        </button>
        <button
          onClick={() => setView('all')}
          className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-3 rounded-lg font-medium transition-colors shadow-sm"
        >
          <LayoutGrid className="w-5 h-5" />
          瀏覽全部模式
        </button>
      </div>
    </div>
  );

  const renderQuiz = () => (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">團隊現況診斷</h2>
        <p className="text-slate-600">請選擇最符合你們團隊當前狀態或最大挑戰的描述（可複選）：</p>
      </div>
      <div className="grid gap-4">
        {quizOptions.map((option) => {
          const isSelected = selectedOptions.includes(option.id);
          return (
            <button
              key={option.id}
              onClick={() => toggleOption(option.id)}
              className={`flex items-start p-5 border rounded-xl transition-all text-left group ${
                isSelected
                  ? 'bg-blue-50 border-blue-500 shadow-md'
                  : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm'
              }`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 transition-colors ${
                isSelected
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600'
              }`}>
                {option.id}
              </div>
              <div className="flex-grow">
                <span className={`text-lg font-medium transition-colors ${
                  isSelected ? 'text-blue-900' : 'text-slate-700 group-hover:text-slate-900'
                }`}>
                  {option.text}
                </span>
              </div>
              <div className="ml-4 flex flex-col justify-center mt-1">
                {isSelected ? (
                  <CheckCircle2 className="w-6 h-6 text-blue-600" />
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-slate-200 group-hover:border-blue-300" />
                )}
              </div>
            </button>
          );
        })}
      </div>
      <div className="mt-10 flex flex-col items-center gap-4">
        <button
          onClick={handleSubmitQuiz}
          disabled={selectedOptions.length === 0}
          className={`px-10 py-3 rounded-lg font-bold text-lg transition-all ${
            selectedOptions.length > 0
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 transform hover:-translate-y-1'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          查看推薦結果 {selectedOptions.length > 0 && `(${selectedOptions.length})`}
        </button>
        <button onClick={() => setView('home')} className="text-slate-500 hover:text-slate-700 font-medium">
          返回首頁
        </button>
      </div>
    </div>
  );

  const renderResult = () => {
    const recommendations = recommendedIds.map(id => patternsData.find(p => p.id === id));

    return (
      <div className="max-w-5xl mx-auto py-12 px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">最佳推薦模式</h2>
          <p className="text-slate-600">根據您的團隊現況，我們推薦以下 Retrospective 框架：</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map(pattern => (
            <PatternCard
              key={pattern.id}
              pattern={pattern}
              highlight={true}
              onSelect={() => {
                setSelectedPattern(pattern);
                setView('detail');
              }}
            />
          ))}
        </div>

        <div className="mt-12 flex justify-center gap-4">
          <button
            onClick={startQuiz}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-2 rounded-lg font-medium transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            重新測驗
          </button>
          <button
            onClick={() => setView('all')}
            className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-6 py-2 rounded-lg font-medium transition-colors"
          >
            <LayoutGrid className="w-4 h-4" />
            查看所有模式
          </button>
        </div>
      </div>
    );
  };

  const renderAll = () => (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">所有回顧模式圖鑑</h2>
          <p className="text-slate-600">共收錄 12 種不同情境的 Sprint Retrospective 框架</p>
        </div>
        <button
          onClick={() => setView('home')}
          className="text-slate-500 hover:text-slate-800 font-medium hidden sm:block"
        >
          返回首頁
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patternsData.map(pattern => (
          <PatternCard
            key={pattern.id}
            pattern={pattern}
            onSelect={() => {
              setSelectedPattern(pattern);
              setView('detail');
            }}
          />
        ))}
      </div>
    </div>
  );

  // 新增：詳細圖解與說明頁面
  const renderDetail = () => {
    if (!selectedPattern) return null;

    return (
      <div className="max-w-5xl mx-auto py-8 px-4 animate-in fade-in duration-300">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setView(recommendedIds.includes(selectedPattern.id) ? 'result' : 'all')}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            返回列表
          </button>
          <button
            onClick={() => {
              const info = getCurrentSprintInfo();
              setSprintNumber(String(info.sprintNumber));
              setSprintStartDate(info.startDate);
              setSprintEndDate(info.endDate);
              setSessionToRestore(null);
              currentSessionIdRef.current = null;
              setView('board');
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            <Play className="w-4 h-4" />
            使用模板
          </button>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              {selectedPattern.icon}
            </div>
            <div>
              <span className="text-sm font-bold text-blue-600 uppercase tracking-wider">{selectedPattern.category}</span>
              <h2 className="text-3xl font-bold text-slate-800">{selectedPattern.name}</h2>
            </div>
          </div>
          <p className="text-lg text-slate-600 leading-relaxed max-w-3xl mb-6">
            {selectedPattern.scenario}
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedPattern.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-lg font-medium border border-slate-200">#{tag}</span>
            ))}
          </div>
        </div>

        {/* 實際參考圖片 (如果有的話) */}
        {selectedPattern.imageUrl && (
          <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-2xl font-black text-slate-700 tracking-wide mb-4">畫布參考圖 <span className="text-slate-400 font-normal">(Canvas Layout)</span></h3>
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 inline-block w-full text-center">
              <img
                src={selectedPattern.imageUrl}
                alt={`${selectedPattern.name} 參考圖`}
                referrerPolicy="no-referrer"
                className="w-full h-auto rounded-xl object-contain max-h-[600px] mx-auto"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          </div>
        )}

        {/* 淺顯易懂的說明 (加上通用標籤) */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-slate-100 gap-4">
            <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <FileText className="w-7 h-7 text-blue-500" />
              每個區塊該寫些什麼？
            </h3>
            <div className="text-sm text-slate-600 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 flex items-center gap-2">
              <Hash className="w-4 h-4 text-slate-400" />
              不管用哪種模式，請認明 <strong className="text-slate-800">通用標籤</strong> 快速理解分類！
            </div>
          </div>

          <div className="space-y-4">
            {selectedPattern.areas.map((area, idx) => (
              <div key={idx} className="flex gap-5 items-start p-5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className={`p-3 rounded-full flex-shrink-0 ${area.colorBg}`}>
                  {area.icon}
                </div>
                <div className="pt-1 flex-grow">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                    <h4 className="text-lg font-bold text-slate-800">{area.name}</h4>
                    {/* 顯示該區塊對應的通用標籤 */}
                    <div className="flex flex-wrap gap-2">
                      {area.commonTags && area.commonTags.map(tag => (
                        <span key={tag} className={`text-xs font-bold px-2.5 py-1 rounded-md border ${getTagStyle(tag)}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[1.05rem]">{area.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const handleBoardMount = useCallback((editor) => {
    editorRef.current = editor;
    if (sessionToRestore) {
      currentSessionIdRef.current = sessionToRestore.id;
      // 只在畫布為空時才載入快照，避免覆蓋其他人的共編內容
      if (editor.getCurrentPageShapes().length === 0) {
        loadSnapshot(editor.store, sessionToRestore.snapshot);
      }
      setSessionToRestore(null);
    } else {
      currentSessionIdRef.current = crypto.randomUUID();
    }
    editor.store.listen(() => {
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = setTimeout(() => autoSave(), 2000);
    }, { scope: 'document' });
    if (sessionToRestore || !selectedPattern?.imageUrl) return;
    const url = selectedPattern.imageUrl;
    const img = new window.Image();
    img.onload = () => {
      if (editor.getCurrentPageShapes().some(s => s.type === 'image')) return;
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const assetId = AssetRecordType.createId(getHashForString(url));
      editor.createAssets([{
        id: assetId,
        typeName: 'asset',
        type: 'image',
        props: { name: selectedPattern.name, src: url, w, h, mimeType: 'image/jpeg', isAnimated: false },
        meta: {},
      }]);
      const shapeId = createShapeId();
      editor.createShapes([{ id: shapeId, type: 'image', x: 0, y: 0, props: { assetId, w, h } }]);
    };
    img.src = url;
  }, [selectedPattern, sessionToRestore]);

  const autoSave = useCallback(() => {
    if (!editorRef.current || !selectedPattern) return;
    const snapshot = editorRef.current.getSnapshot();
    const sessions = JSON.parse(localStorage.getItem('retro-sessions') || '[]');
    const id = currentSessionIdRef.current;
    const idx = sessions.findIndex(s => s.id === id);
    const session = {
      id: id || crypto.randomUUID(),
      sprintNumber: sprintNumber || '?',
      startDate: sprintStartDate,
      endDate: sprintEndDate,
      patternId: selectedPattern.id,
      patternName: selectedPattern.name,
      savedAt: new Date().toISOString(),
      snapshot,
      // 保留已有的分類結果，避免 autoSave 覆蓋
      ...(idx >= 0 && sessions[idx].categorizedNotes
        ? { categorizedNotes: sessions[idx].categorizedNotes }
        : {}),
    };
    if (idx >= 0) sessions[idx] = session;
    else sessions.push(session);
    currentSessionIdRef.current = session.id;
    localStorage.setItem('retro-sessions', JSON.stringify(sessions));
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  }, [sprintNumber, sprintStartDate, sprintEndDate, selectedPattern]);

  // debriefNotes 任何變動都存回 localStorage（含手動調整）
  useEffect(() => {
    if (!debriefSession?.id || view !== 'debrief' || debriefNotes.length === 0) return;
    const sessions = JSON.parse(localStorage.getItem('retro-sessions') || '[]');
    const idx = sessions.findIndex(s => s.id === debriefSession.id);
    if (idx >= 0) {
      sessions[idx].categorizedNotes = debriefNotes;
      localStorage.setItem('retro-sessions', JSON.stringify(sessions));
    }
  }, [debriefNotes]);

  // action items 變動時存回 localStorage
  useEffect(() => {
    if (!debriefSession?.id || view !== 'debrief') return;
    const sessions = JSON.parse(localStorage.getItem('retro-sessions') || '[]');
    const idx = sessions.findIndex(s => s.id === debriefSession.id);
    if (idx >= 0) { sessions[idx].actionItems = debriefActionItems; localStorage.setItem('retro-sessions', JSON.stringify(sessions)); }
  }, [debriefActionItems]);

  // 進復盤時若有 API Key 且尚未分類，自動觸發 AI 分類
  useEffect(() => {
    if (view !== 'debrief') return;
    if (!debriefApiKey.trim()) return;
    if (debriefNotes.length === 0) return;
    if (autoCategFiredRef.current) return;
    if (debriefNotes.some(n => n.areaIndex !== null)) return; // 已有分類結果，略過
    autoCategFiredRef.current = true;
    runClaudeCateg();
  }, [view, debriefNotes.length]);

  // 當 Sprint 欄位變動時也觸發儲存
  useEffect(() => {
    if (view === 'board' && editorRef.current && selectedPattern) {
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = setTimeout(() => autoSave(), 1000);
    }
  }, [sprintNumber, sprintStartDate, sprintEndDate]);

  const [historyVersion, setHistoryVersion] = useState(0);

  const deleteSession = (id) => {
    const updated = JSON.parse(localStorage.getItem('retro-sessions') || '[]').filter(s => s.id !== id);
    localStorage.setItem('retro-sessions', JSON.stringify(updated));
    setHistoryVersion(v => v + 1);
  };

  const openSessionInBoard = (session) => {
    const pattern = patternsData.find(p => p.id === session.patternId);
    if (!pattern) return;
    setSelectedPattern(pattern);
    setSprintNumber(session.sprintNumber === '?' ? '' : String(session.sprintNumber));
    setSprintStartDate(session.startDate || '');
    setSprintEndDate(session.endDate || '');
    setSessionToRestore(session);
    setView('board');
  };

  const bulkImportNotes = useCallback(() => {
    const editor = editorRef.current;
    if (!editor || !bulkText.trim()) return;

    const notes = bulkText
      .split(/\n\s*\n/)
      .map(n => n.trim())
      .filter(n => n.length > 0);
    if (notes.length === 0) return;

    const NOTE_W = 220;
    const NOTE_H = 220;
    const COLS = 4;
    const GAP = 16;
    const START_X = 1400;
    const START_Y = 80;

    const shapes = notes.map((noteText, idx) => {
      const col = idx % COLS;
      const row = Math.floor(idx / COLS);
      const paragraphs = noteText.split('\n').map(line =>
        line.trim()
          ? { type: 'paragraph', content: [{ type: 'text', text: line }] }
          : { type: 'paragraph' }
      );
      return {
        id: createShapeId(),
        type: 'note',
        x: START_X + col * (NOTE_W + GAP),
        y: START_Y + row * (NOTE_H + GAP),
        props: {
          richText: { type: 'doc', content: paragraphs },
          color: 'yellow',
          size: 'm',
          align: 'middle',
          verticalAlign: 'middle',
          growY: 0,
          fontSizeAdjustment: 0,
          url: '',
        },
      };
    });

    editor.createShapes(shapes);
    setBulkText('');
    setShowBulkInput(false);
  }, [bulkText]);

  const openDebrief = (session) => {
    autoCategFiredRef.current = false;
    if (session.categorizedNotes?.length > 0) {
      setDebriefNotes(session.categorizedNotes);
    } else {
      const notes = extractNotesFromSnapshot(session.snapshot);
      setDebriefNotes(notes.map(n => ({ ...n, areaIndex: null })));
    }
    setDebriefActionItems(session.actionItems || []);
    setDebriefSuggestions(session.aiSuggestions || '');
    setDebriefSession(session);
    setDebriefError('');
    setView('debrief');
  };

  const runClaudeCateg = async () => {
    if (!debriefSession || !debriefApiKey.trim()) return;
    const pattern = patternsData.find(p => p.id === debriefSession.patternId);
    if (!pattern) return;
    const rawNotes = debriefNotes.map(n => n.text);
    if (rawNotes.length === 0) return;

    setDebriefLoading(true);
    setDebriefError('');
    localStorage.setItem('retro-api-key', debriefApiKey.trim());

    const areas = pattern.areas.map((a, i) => `${i}. ${a.name}：${a.desc}`).join('\n');
    const noteList = rawNotes.map((t, i) => `[${i}] ${t}`).join('\n');

    const prompt = `你是 Scrum Master 助理。以下是回顧會議的模板區塊定義：
${areas}

以下是團隊貼的便利貼（每行一張）：
${noteList}

請將每張便利貼分類到最適合的區塊。僅回傳 JSON 陣列，格式如下（不要其他文字）：
[{"noteIndex": 0, "areaIndex": 1}, ...]
所有 noteIndex 必須出現一次，areaIndex 為 0 到 ${pattern.areas.length - 1}。`;

    try {
      const client = new Anthropic({ apiKey: debriefApiKey.trim(), dangerouslyAllowBrowser: true });
      const msg = await client.messages.create({
        model: 'claude-haiku-4-5',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      });
      const raw = msg.content[0]?.text || '';
      const jsonMatch = raw.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error('回應格式錯誤');
      const result = JSON.parse(jsonMatch[0]);
      const categorized = debriefNotes.map((n, idx) => {
        const match = result.find(r => r.noteIndex === idx);
        return match ? { ...n, areaIndex: match.areaIndex } : n;
      });
      setDebriefNotes(categorized);
      // 存回 localStorage，下次進來直接顯示
      const sessions = JSON.parse(localStorage.getItem('retro-sessions') || '[]');
      const idx = sessions.findIndex(s => s.id === debriefSession.id);
      if (idx >= 0) {
        sessions[idx].categorizedNotes = categorized;
        localStorage.setItem('retro-sessions', JSON.stringify(sessions));
      }
    } catch (e) {
      setDebriefError(e.message || '分析失敗，請確認 API Key 是否正確');
    } finally {
      setDebriefLoading(false);
    }
  };

  const generateSuggestions = async (pattern) => {
    if (!debriefApiKey.trim() || debriefSuggestionsLoading) return;
    setDebriefSuggestionsLoading(true);
    const areaBlocks = pattern.areas.map((a, i) => {
      const notes = debriefNotes.filter(n => n.areaIndex === i).map(n => `- ${n.text}`).join('\n');
      return `【${a.name}】\n${notes || '（無）'}`;
    }).join('\n\n');
    const unassigned = debriefNotes.filter(n => n.areaIndex === null);
    const prompt = `你是資深 Scrum Master 顧問。以下是 Sprint ${debriefSession?.sprintNumber ?? ''} 回顧會議（${pattern.name}）的分類結果：

${areaBlocks}
${unassigned.length > 0 ? `\n【未分類】\n${unassigned.map(n => `- ${n.text}`).join('\n')}` : ''}

請以繁體中文提供：
1. **本次回顧摘要**（2-3 句，點出整體氛圍與主要收穫）
2. **需優先處理的問題**（Top 3，每條一句，加上建議方向）
3. **建議 Action Items**（3-5 條，格式：負責角色 → 具體行動）
4. **下次回顧追蹤項目**（1-2 條）

回覆格式使用 markdown，清晰簡潔。`;

    try {
      const client = new Anthropic({ apiKey: debriefApiKey.trim(), dangerouslyAllowBrowser: true });
      const msg = await client.messages.create({
        model: 'claude-haiku-4-5',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      });
      const text = msg.content[0]?.text || '';
      setDebriefSuggestions(text);
      // 存回 localStorage
      const sessions = JSON.parse(localStorage.getItem('retro-sessions') || '[]');
      const idx = sessions.findIndex(s => s.id === debriefSession.id);
      if (idx >= 0) { sessions[idx].aiSuggestions = text; localStorage.setItem('retro-sessions', JSON.stringify(sessions)); }
    } catch (e) {
      setDebriefSuggestions(`分析失敗：${e.message}`);
    } finally {
      setDebriefSuggestionsLoading(false);
    }
  };

  const renderDebrief = () => {
    if (!debriefSession) return null;
    // patternId 可能因 JSON 序列化變成字串，統一用 == 比對
    const pattern = patternsData.find(p => p.id == debriefSession.patternId);
    if (!pattern) return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center text-slate-400">
        <p className="text-lg">找不到對應模板（patternId: {String(debriefSession.patternId)}）</p>
        <button onClick={() => setView('history')} className="mt-4 text-blue-500 hover:underline">返回歷史紀錄</button>
      </div>
    );

    const unassigned = debriefNotes.filter(n => n.areaIndex === null);
    const hasNotes = debriefNotes.length > 0;

    return (
      <div className="max-w-6xl mx-auto py-8 px-4 animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <button onClick={() => setView('history')} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium transition-colors mb-3 text-sm">
              <ArrowLeft className="w-4 h-4" /> 返回歷史紀錄
            </button>
            <h2 className="text-3xl font-bold text-slate-800">復盤分析</h2>
            <p className="text-slate-500 mt-1">
              {pattern.name} · Sprint {debriefSession.sprintNumber}
              {debriefSession.startDate && ` · ${debriefSession.startDate} → ${debriefSession.endDate || '?'}`}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            {/* API Key input */}
            <div className="flex items-center gap-2">
              <input
                type="password"
                placeholder="Anthropic API Key"
                value={debriefApiKey}
                onChange={e => setDebriefApiKey(e.target.value)}
                className="text-sm border border-slate-200 rounded-lg px-3 py-2 w-56 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
              />
              <button
                onClick={runClaudeCateg}
                disabled={debriefLoading || !debriefApiKey.trim() || !hasNotes}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
              >
                {debriefLoading
                  ? <><span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> 分析中</>
                  : <><Lightbulb className="w-4 h-4" /> AI 自動分類</>}
              </button>
            </div>
            {debriefError && <p className="text-xs text-red-500">{debriefError}</p>}
          </div>
        </div>

        {!hasNotes && (
          <div className="text-center py-24 text-slate-400">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg">這份紀錄沒有便利貼</p>
            <p className="text-sm mt-1">請回到白板新增便利貼後再儲存</p>
          </div>
        )}

        {hasNotes && (() => {
          const linkedNoteIds = new Set([
            ...debriefActionItems.flatMap(i => i.linkedNoteIds || []),
            ...(pendingLinkNoteId ? [pendingLinkNoteId] : []),
          ]);
          const toggleNoteAction = (note) => {
            if (debriefActionItems.flatMap(i => i.linkedNoteIds || []).includes(note.id)) {
              setDebriefActionItems(prev => prev
                .map(i => ({ ...i, linkedNoteIds: (i.linkedNoteIds || []).filter(id => id !== note.id) }))
                .filter(i => (i.linkedNoteIds || []).length > 0 || i.text)
              );
              if (pendingLinkNoteId === note.id) setPendingLinkNoteId(null);
            } else if (pendingLinkNoteId === note.id) {
              setPendingLinkNoteId(null);
            } else {
              setPendingLinkNoteId(note.id);
              setDebriefActionInput('');
              setTimeout(() => {
                actionItemInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => actionItemInputRef.current?.focus(), 300);
              }, 50);
            }
          };
          return (
          <>
            {/* Unassigned notes pool */}
            {unassigned.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  未分類便利貼（{unassigned.length} 張）
                </h3>
                <div className="flex flex-wrap gap-2">
                  {unassigned.map(note => (
                    <NoteChip
                      key={note.id}
                      note={note}
                      areas={pattern.areas}
                      reassignTarget={reassignTarget}
                      setReassignTarget={setReassignTarget}
                      isLinked={linkedNoteIds.has(note.id)}
                      onAddToAction={() => toggleNoteAction(note)}
                      onAssign={(areaIndex) => {
                        setDebriefNotes(prev => prev.map(n => n.id === note.id ? { ...n, areaIndex } : n));
                        setReassignTarget(null);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Copy + Import row */}
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="flex-1">
                <ManualImport
                  debriefNotes={debriefNotes}
                  areas={pattern.areas}
                  onApply={(mapping) => {
                    setDebriefNotes(prev => prev.map((n, idx) => {
                      const a = mapping[idx];
                      return a !== undefined ? { ...n, areaIndex: a === -1 ? null : a } : n;
                    }));
                  }}
                />
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(
                  debriefNotes.map((n, i) => `[${i}] ${n.text}`).join('\n\n')
                )}
                className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Hash className="w-3.5 h-3.5" /> 複製（含編號）
              </button>
            </div>

            {/* Area columns */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {pattern.areas.map((area, aIdx) => {
                const areaNotesArr = debriefNotes.filter(n => n.areaIndex === aIdx);
                return (
                  <div key={aIdx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <div className={`px-4 py-3 flex items-center gap-2 border-b border-slate-100 ${area.colorBg.split(' ')[0]}`}>
                      <div className={`p-1.5 rounded-lg ${area.colorBg}`}>
                        {React.cloneElement(area.icon, { className: 'w-4 h-4' })}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{area.name}</p>
                        {area.commonTags && (
                          <div className="flex flex-wrap gap-1 mt-0.5">
                            {area.commonTags.map(tag => (
                              <span key={tag} className={`text-xs font-bold px-1.5 py-0 rounded border ${getTagStyle(tag)}`}>{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="ml-auto text-xs font-bold text-slate-400 bg-white rounded-full px-2 py-0.5 border border-slate-200">{areaNotesArr.length}</span>
                    </div>
                    <div className="p-3 grid grid-cols-3 gap-2 min-h-[80px]">
                      {areaNotesArr.map(note => (
                        <NoteChip
                          key={note.id}
                          note={note}
                          areas={pattern.areas}
                          reassignTarget={reassignTarget}
                          setReassignTarget={setReassignTarget}
                          isLinked={linkedNoteIds.has(note.id)}
                          onAddToAction={() => toggleNoteAction(note)}
                          onAssign={(newAreaIndex) => {
                            setDebriefNotes(prev => prev.map(n => n.id === note.id ? { ...n, areaIndex: newAreaIndex === 'unassign' ? null : newAreaIndex } : n));
                            setReassignTarget(null);
                          }}
                          currentAreaIndex={aIdx}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Items */}
            <div className="mt-10">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Action Items
              </h3>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2">
                {debriefActionItems.map(item => (
                  <ActionItemRow
                    key={item.id}
                    item={item}
                    allNotes={debriefNotes}
                    onChange={updated => setDebriefActionItems(prev => prev.map(i => i.id === item.id ? updated : i))}
                    onDelete={() => setDebriefActionItems(prev => prev.filter(i => i.id !== item.id))}
                  />
                ))}
                <div className="flex gap-2 pt-2">
                  <input
                    ref={actionItemInputRef}
                    value={debriefActionInput}
                    onChange={e => setDebriefActionInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && debriefActionInput.trim()) {
                        setDebriefActionItems(prev => [...prev, { id: crypto.randomUUID(), text: debriefActionInput.trim(), done: false, linkedNoteIds: pendingLinkNoteId ? [pendingLinkNoteId] : [] }]);
                        setDebriefActionInput('');
                        setPendingLinkNoteId(null);
                      }
                    }}
                    placeholder={pendingLinkNoteId ? '輸入對應的 action item…' : '新增 action item… (Enter 送出)'}
                    className={`flex-1 text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 bg-white ${pendingLinkNoteId ? 'border-emerald-400 focus:ring-emerald-300' : 'border-slate-200 focus:ring-emerald-300'}`}
                  />
                  <button
                    onClick={() => {
                      if (!debriefActionInput.trim()) return;
                      setDebriefActionItems(prev => [...prev, { id: crypto.randomUUID(), text: debriefActionInput.trim(), done: false, linkedNoteIds: pendingLinkNoteId ? [pendingLinkNoteId] : [] }]);
                      setDebriefActionInput('');
                      setPendingLinkNoteId(null);
                    }}
                    className="text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >新增</button>
                </div>
                {pendingLinkNoteId && (
                  <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                    <span>✓</span> 新增後將自動連結選取的便利貼
                    <button onClick={() => setPendingLinkNoteId(null)} className="ml-1 text-slate-400 hover:text-slate-600">取消</button>
                  </p>
                )}
              </div>
            </div>

            {/* AI Suggestions */}
            <div className="mt-8 mb-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" /> AI 建議
                </h3>
                <button
                  onClick={() => generateSuggestions(pattern)}
                  disabled={debriefSuggestionsLoading || !debriefApiKey.trim()}
                  className="flex items-center gap-2 text-sm font-semibold text-amber-600 hover:bg-amber-50 disabled:opacity-40 border border-amber-200 px-3 py-1.5 rounded-lg transition-colors"
                >
                  {debriefSuggestionsLoading
                    ? <><span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full" /> 分析中</>
                    : debriefSuggestions ? '重新分析' : '開始分析'}
                </button>
              </div>
              {debriefSuggestions ? (
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 text-sm text-slate-700 leading-relaxed prose prose-sm max-w-none">
                  {debriefSuggestions.split('\n').map((line, i) => {
                    if (line.startsWith('## ') || line.startsWith('**') && line.endsWith('**')) {
                      return <p key={i} className="font-bold text-slate-800 mt-3 mb-1">{line.replace(/\*\*/g, '').replace(/^## /, '')}</p>;
                    }
                    if (line.startsWith('- ') || line.startsWith('* ')) {
                      return <p key={i} className="ml-3 before:content-['•'] before:mr-2 before:text-amber-400">{line.slice(2)}</p>;
                    }
                    if (line.trim() === '') return <br key={i} />;
                    return <p key={i}>{line}</p>;
                  })}
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-8 text-center text-slate-400">
                  <Lightbulb className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">點「開始分析」，AI 將根據分類結果給出摘要與行動建議</p>
                </div>
              )}
            </div>
          </>
          );
        })()}
      </div>
    );
  };

  const renderHistory = () => {
    const sessions = JSON.parse(localStorage.getItem('retro-sessions') || '[]')
      .sort((a, b) => Number(b.sprintNumber) - Number(a.sprintNumber));
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in duration-300">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">歷史紀錄</h2>
            <p className="text-slate-500 mt-1">共 {sessions.length} 筆 Sprint 回顧紀錄</p>
          </div>
          <button onClick={() => setView('home')} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" /> 返回首頁
          </button>
        </div>
        {sessions.length === 0 ? (
          <div className="text-center py-24 text-slate-400">
            <p className="text-lg">還沒有儲存任何紀錄</p>
            <p className="text-sm mt-2">開始使用模板白板後將自動記錄</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map(s => (
              <div key={s.id} className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center justify-between gap-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-center min-w-[72px]">
                    <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">Sprint</p>
                    <p className="text-2xl font-black text-blue-600">{s.sprintNumber}</p>
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{s.patternName}</p>
                    {(s.startDate || s.endDate) && (
                      <p className="text-sm text-slate-500 mt-0.5">{s.startDate} {s.endDate ? `→ ${s.endDate}` : ''}</p>
                    )}
                    <p className="text-xs text-slate-400 mt-1">儲存於 {new Date(s.savedAt).toLocaleString('zh-TW')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openDebrief(s)}
                    className="flex items-center gap-1.5 text-sm font-semibold text-purple-600 hover:bg-purple-50 px-3 py-2 rounded-lg transition-colors border border-purple-200"
                  >
                    <Lightbulb className="w-3.5 h-3.5" /> 復盤
                  </button>
                  <button
                    onClick={() => openSessionInBoard(s)}
                    className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors border border-blue-200"
                  >
                    <Play className="w-3.5 h-3.5" /> 開啟白板
                  </button>
                  <button
                    onClick={() => { if (confirm('確定要刪除這筆紀錄？')) deleteSession(s.id); }}
                    className="text-sm font-semibold text-red-400 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors border border-red-200"
                  >
                    刪除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderBoard = () => {
    if (!selectedPattern) return null;
    return (
      <div className="flex" style={{ height: 'calc(100vh - 64px)' }}>
        {/* Left Sidebar */}
        <div className={`flex-shrink-0 bg-white border-r border-slate-200 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? 'w-80' : 'w-12'}`}>
          <div className="p-3 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
            {sidebarOpen && (
              <button
                onClick={() => setView('detail')}
                className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                返回說明
              </button>
            )}
            <button
              onClick={() => setSidebarOpen(o => !o)}
              className="ml-auto p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors flex-shrink-0"
              title={sidebarOpen ? '收合側欄' : '展開側欄'}
            >
              {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
            </button>
          </div>
          {sidebarOpen && (
            <>
              <div className="p-4 border-b border-slate-100 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2.5 rounded-lg border border-blue-100 flex-shrink-0">
                    {selectedPattern.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">{selectedPattern.category}</p>
                    <h2 className="text-base font-bold text-slate-800 leading-tight">{selectedPattern.name}</h2>
                  </div>
                </div>
              </div>

              {/* Sprint Info */}
              <div className="p-4 border-b border-slate-100 flex-shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sprint 資訊</p>
                  <button
                    onClick={() => { const i = getCurrentSprintInfo(); setSprintNumber(String(i.sprintNumber)); setSprintStartDate(i.startDate); setSprintEndDate(i.endDate); }}
                    className="text-xs text-blue-500 hover:text-blue-700 font-medium transition-colors"
                  >自動填入</button>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Sprint 編號</label>
                    <input type="number" value={sprintNumber} onChange={e => setSprintNumber(e.target.value)} placeholder="42"
                      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white" />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-xs text-slate-500 mb-1 block">開始</label>
                      <input type="date" value={sprintStartDate} onChange={e => setSprintStartDate(e.target.value)}
                        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white" />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-slate-500 mb-1 block">結束</label>
                      <input type="date" value={sprintEndDate} onChange={e => setSprintEndDate(e.target.value)}
                        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-y-auto flex-1 p-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">區塊說明</p>
                <div className="space-y-3">
                  {selectedPattern.areas.map((area, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-1.5 rounded-lg flex-shrink-0 ${area.colorBg}`}>
                          {React.cloneElement(area.icon, { className: 'w-4 h-4' })}
                        </div>
                        <span className="font-bold text-slate-800 text-sm">{area.name}</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed mb-2">{area.desc}</p>
                      {area.commonTags && (
                        <div className="flex flex-wrap gap-1">
                          {area.commonTags.map(tag => (
                            <span key={tag} className={`text-xs font-bold px-2 py-0.5 rounded border ${getTagStyle(tag)}`}>{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>



              {/* Bulk import */}
              <div className="p-3 border-t border-slate-100 flex-shrink-0">
                <button
                  onClick={() => setShowBulkInput(v => !v)}
                  className="w-full flex items-center justify-between text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <span className="flex items-center gap-1.5"><ClipboardPaste className="w-3.5 h-3.5" /> 批量貼上便利貼</span>
                  <span>{showBulkInput ? '▼' : '▲'}</span>
                </button>
                {showBulkInput && (
                  <div className="mt-2 space-y-2">
                    <textarea
                      value={bulkText}
                      onChange={e => setBulkText(e.target.value)}
                      placeholder={"每則便利貼以空行分隔，例如：\n\n第一張便利貼內容\n\n第二張便利貼內容"}
                      className="w-full text-xs border border-slate-200 rounded-lg px-2 py-2 h-36 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                    />
                    <button
                      onClick={bulkImportNotes}
                      disabled={!bulkText.trim()}
                      className="w-full text-xs font-bold bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white py-2 rounded-lg transition-colors"
                    >
                      貼上白板
                    </button>
                  </div>
                )}
              </div>

              <div className="p-3 border-t border-slate-100 flex-shrink-0 space-y-2">
                {roomId && (
                  <button
                    onClick={() => {
                      const url = `${window.location.origin}${window.location.pathname}#collab-${roomId}`;
                      navigator.clipboard.writeText(url);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2000);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 text-xs text-blue-600 hover:bg-blue-50 py-1.5 rounded-lg transition-colors border border-blue-200"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    {copiedLink ? '✓ 已複製連結' : '複製共享連結'}
                  </button>
                )}
                <p className="text-xs text-slate-400 text-center">{savedMsg ? '✓ 已自動儲存' : '變更將自動儲存'}</p>
              </div>
            </>
          )}
        </div>

        {/* Whiteboard */}
        <div className="flex-1 relative">
          {roomId ? (
            <RoomProvider id={roomId} initialPresence={{}}>
              <CollabTldraw onMount={handleBoardMount} />
            </RoomProvider>
          ) : (
            <div className="tl-loading" aria-busy="true" />
          )}
        </div>
      </div>
    );
  };

  return (
    <LiveblocksProvider publicApiKey={LIVEBLOCKS_PUBLIC_KEY}>
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setView('home')}
          >
            <div className="bg-blue-600 p-1.5 rounded-md">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">RetroFinder</span>
          </div>
          <nav className="flex gap-4">
            <button
              onClick={startQuiz}
              className={`text-sm font-medium px-3 py-2 rounded-md transition-colors ${view === 'quiz' || (view === 'result' && !selectedPattern) ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              快速測驗
            </button>
            <button
              onClick={() => { setView('all'); setSelectedPattern(null); }}
              className={`text-sm font-medium px-3 py-2 rounded-md transition-colors ${view === 'all' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              模式總覽
            </button>
            <button
              onClick={() => setView('history')}
              className={`text-sm font-medium px-3 py-2 rounded-md transition-colors ${view === 'history' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              歷史紀錄
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      {view !== 'board' && (
        <main>
          {view === 'home' && renderHome()}
          {view === 'quiz' && renderQuiz()}
          {view === 'result' && renderResult()}
          {view === 'all' && renderAll()}
          {view === 'detail' && renderDetail()}
          {view === 'history' && renderHistory()}
          {view === 'debrief' && renderDebrief()}
        </main>
      )}
      {view === 'board' && renderBoard()}
    </div>
    </LiveblocksProvider>
  );
}

// 獨立的卡片組件，用於展示單一模式
function PatternCard({ pattern, highlight = false, onSelect }) {
  return (
    <div
      onClick={onSelect}
      className={`bg-white rounded-xl overflow-hidden flex flex-col transition-all duration-300 cursor-pointer ${highlight ? 'shadow-lg border-2 border-blue-400 transform hover:-translate-y-1' : 'shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-300 hover:-translate-y-1'}`}
    >
      <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center gap-4">
        <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-100">
          {pattern.icon}
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1 block">
            {pattern.category}
          </span>
          <h3 className="text-lg font-bold text-slate-800 leading-tight">
            {pattern.name}
          </h3>
        </div>
      </div>

      <div className="p-5 flex-grow flex flex-col gap-4">
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">適合情境</h4>
          <p className="text-sm text-slate-700 leading-relaxed font-medium">
            {pattern.scenario}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 mt-auto pt-4 border-t border-slate-100">
          <div>
            <h4 className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">優點</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{pattern.pros}</p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1">缺點</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{pattern.cons}</p>
          </div>
        </div>
      </div>

      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-2">
        {pattern.tags.map(tag => (
          <span key={tag} className="px-2 py-1 bg-white border border-slate-200 text-slate-500 text-xs rounded-md font-medium">
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function MemoSquare({ note }) {
  const ref = React.useRef(null);
  const [show, setShow] = React.useState(false);
  const [style, setStyle] = React.useState({});

  const onEnter = () => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setStyle({ position: 'fixed', bottom: window.innerHeight - rect.top + 6, left: rect.left, zIndex: 300 });
    setShow(true);
  };

  return (
    <div className="relative">
      <div
        ref={ref}
        onMouseEnter={onEnter}
        onMouseLeave={() => setShow(false)}
        className="text-xs bg-yellow-100 border border-yellow-300 text-slate-700 p-1.5 rounded-sm w-[80px] h-[80px] overflow-hidden shadow-sm cursor-default"
      >
        <span className="line-clamp-4 break-words">{note.text}</span>
      </div>
      {show && (
        <div style={style} className="bg-slate-800 text-white text-xs rounded-lg px-3 py-2 max-w-[240px] shadow-xl pointer-events-none whitespace-pre-wrap break-words">
          {note.text}
        </div>
      )}
    </div>
  );
}

function ActionItemRow({ item, allNotes, onChange, onDelete }) {
  const [showPicker, setShowPicker] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const [editText, setEditText] = React.useState(item.text);
  const inputRef = React.useRef(null);
  const pickerRef = React.useRef(null);

  React.useEffect(() => {
    if (!showPicker) return;
    const handler = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) setShowPicker(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showPicker]);
  const linked = (item.linkedNoteIds || [])
    .map(id => allNotes.find(n => n.id === id))
    .filter(Boolean);

  const toggleNote = (noteId) => {
    const ids = item.linkedNoteIds || [];
    onChange({ ...item, linkedNoteIds: ids.includes(noteId) ? ids.filter(i => i !== noteId) : [...ids, noteId] });
  };

  const commitEdit = () => {
    const trimmed = editText.trim();
    if (trimmed) onChange({ ...item, text: trimmed });
    else setEditText(item.text);
    setEditing(false);
  };

  React.useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus();
  }, [editing]);

  return (
    <div className="group space-y-1.5 py-1">
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange({ ...item, done: !item.done })}
          className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${item.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 hover:border-emerald-400'}`}
        >
          {item.done && <span className="text-xs">✓</span>}
        </button>
        {editing ? (
          <input
            ref={inputRef}
            value={editText}
            onChange={e => setEditText(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={e => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') { setEditText(item.text); setEditing(false); } }}
            className="flex-1 text-sm border border-blue-300 rounded-md px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        ) : (
          <span
            onClick={() => { setEditText(item.text); setEditing(true); }}
            className={`flex-1 text-sm cursor-text ${item.done ? 'line-through text-slate-400' : 'text-slate-700'}`}
          >{item.text}</span>
        )}
        <button
          onClick={() => setShowPicker(v => !v)}
          className={`opacity-0 group-hover:opacity-100 text-xs px-1.5 py-0.5 rounded transition-all ${linked.length > 0 ? 'opacity-100 text-blue-400 hover:text-blue-600' : 'text-slate-300 hover:text-slate-500'}`}
          title="關聯便利貼"
        >
          <Link className="w-3.5 h-3.5 inline" /> {linked.length > 0 && <span>{linked.length}</span>}
        </button>
        <button onClick={onDelete} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-all text-xs px-1">✕</button>
      </div>

      {/* 已關聯的便利貼 chips */}
      {linked.length > 0 && (
        <div className="ml-8 flex flex-wrap gap-2">
          {linked.map(n => (
            <MemoSquare key={n.id} note={n} />
          ))}
        </div>
      )}

      {/* 便利貼選取器 */}
      {showPicker && (
        <div ref={pickerRef} className="ml-8 bg-white border border-slate-200 rounded-xl shadow-lg p-3 space-y-1 max-h-48 overflow-y-auto">
          <p className="text-xs font-bold text-slate-400 mb-2">選取相關便利貼</p>
          {allNotes.map(n => {
            const selected = (item.linkedNoteIds || []).includes(n.id);
            return (
              <button
                key={n.id}
                onClick={() => toggleNote(n.id)}
                className={`w-full text-left text-xs px-2 py-1.5 rounded-lg flex items-start gap-2 transition-colors ${selected ? 'bg-yellow-50 border border-yellow-200' : 'hover:bg-slate-50'}`}
              >
                <span className={`mt-0.5 w-3.5 h-3.5 rounded border flex-shrink-0 flex items-center justify-center ${selected ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'}`}>
                  {selected && '✓'}
                </span>
                <span className="line-clamp-2 text-slate-700">{n.text}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ManualImport({ debriefNotes, areas, onApply }) {
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState('');
  const [err, setErr] = React.useState('');

  const apply = () => {
    setErr('');
    const mapping = {};
    for (const line of text.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const m = trimmed.match(/^(\d+)\s*[:：]\s*(-?\d+)$/);
      if (!m) { setErr(`格式錯誤：「${trimmed}」，請用 noteIndex: areaIndex`); return; }
      const ni = Number(m[1]), ai = Number(m[2]);
      if (ni < 0 || ni >= debriefNotes.length) { setErr(`編號 ${ni} 超出範圍（0–${debriefNotes.length - 1}）`); return; }
      if (ai !== -1 && (ai < 0 || ai >= areas.length)) { setErr(`區塊 ${ai} 超出範圍（0–${areas.length - 1}，-1 = 未分類）`); return; }
      mapping[ni] = ai;
    }
    onApply(mapping);
    setText('');
    setOpen(false);
  };

  return (
    <div>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors"
      >
        <FileText className="w-3.5 h-3.5" /> 匯入分類結果
      </button>
      {open && (
        <div className="mt-3 bg-white border border-slate-200 rounded-xl p-4 space-y-3">
          <div>
            <p className="text-xs font-bold text-slate-500 mb-1">區塊編號對照</p>
            <div className="flex flex-wrap gap-1.5">
              {areas.map((a, i) => (
                <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">{i} = {a.name}</span>
              ))}
              <span className="text-xs bg-slate-100 text-slate-400 px-2 py-0.5 rounded font-mono">-1 = 未分類</span>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 mb-1">格式：每行 <code className="bg-slate-100 px-1 rounded">便利貼編號: 區塊編號</code></p>
            <textarea
              value={text}
              onChange={e => { setText(e.target.value); setErr(''); }}
              placeholder={"0: 2\n1: 0\n2: 3\n..."}
              className="w-full text-xs font-mono border border-slate-200 rounded-lg px-3 py-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
            />
          </div>
          {err && <p className="text-xs text-red-500">{err}</p>}
          <button
            onClick={apply}
            disabled={!text.trim()}
            className="text-xs font-bold bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white px-4 py-1.5 rounded-lg transition-colors"
          >套用</button>
        </div>
      )}
    </div>
  );
}

function NoteChip({ note, areas, reassignTarget, setReassignTarget, onAssign, currentAreaIndex, isLinked, onAddToAction }) {
  const isOpen = reassignTarget === note.id;
  const btnRef = React.useRef(null);
  const [popupStyle, setPopupStyle] = React.useState({});
  const [showTooltip, setShowTooltip] = React.useState(false);
  const [tooltipStyle, setTooltipStyle] = React.useState({});

  const handleClick = () => {
    if (!isOpen && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setPopupStyle(spaceBelow < 240
        ? { position: 'fixed', bottom: window.innerHeight - rect.top + 4, left: rect.left, zIndex: 200 }
        : { position: 'fixed', top: rect.bottom + 4, left: rect.left, zIndex: 200 }
      );
    }
    setReassignTarget(isOpen ? null : note.id);
  };

  const handleMouseEnter = () => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    setTooltipStyle({ position: 'fixed', bottom: window.innerHeight - rect.top + 6, left: rect.left, zIndex: 300 });
    setShowTooltip(true);
  };

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setShowTooltip(false)}
        className={`text-left text-sm rounded-sm p-2 w-[110px] h-[110px] overflow-hidden shadow-sm transition-colors ${isLinked ? 'bg-emerald-100 border border-emerald-300 hover:border-emerald-500' : 'bg-yellow-100 border border-yellow-300 hover:border-yellow-500'}`}
      >
        {isLinked && <span className="mr-1 text-emerald-500 text-xs">✓</span>}
        <span className="line-clamp-4 break-words">{note.text}</span>
      </button>
      {showTooltip && (
        <div style={tooltipStyle} className="bg-slate-800 text-white text-xs rounded-lg px-3 py-2 max-w-[240px] shadow-xl pointer-events-none whitespace-pre-wrap break-words">
          {note.text}
        </div>
      )}
      {isOpen && (
        <div style={popupStyle} className="bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 min-w-[180px]">
          {onAddToAction && (
            isLinked ? (
              <button
                onClick={() => { onAddToAction(); setReassignTarget(null); }}
                className="w-full text-left text-xs px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
              >
                <span className="text-red-400">－</span> 從 Action Item 移除
              </button>
            ) : (
              <button
                onClick={() => { onAddToAction(); setReassignTarget(null); }}
                className="w-full text-left text-xs px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
              >
                <span className="text-emerald-500">＋</span> 加到 Action Item
              </button>
            )
          )}
          {currentAreaIndex !== undefined && (
            <button
              onClick={() => onAssign('unassign')}
              className="w-full text-left text-xs px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <span className="text-slate-400">↩</span> 移回未分類
            </button>
          )}
          {(onAddToAction || currentAreaIndex !== undefined) && areas.some((_, i) => i !== currentAreaIndex) && (
            <div className="my-1 border-t border-slate-100" />
          )}
          {areas.map((area, aIdx) => (
            aIdx !== currentAreaIndex && (
              <button
                key={aIdx}
                onClick={() => onAssign(aIdx)}
                className="w-full text-left text-xs px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
              >
                {area.name}
              </button>
            )
          ))}
        </div>
      )}
    </div>
  );
}
