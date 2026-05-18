import React, { useState } from 'react';
import {
  Rocket, Mountain, Ship, Sprout, Bug, HardHat,
  Wind, RollerCoaster, Car, HeartHandshake, CalendarClock,
  KanbanSquare, ArrowRight, Play, LayoutGrid, CheckCircle2, RotateCcw,
  // 新增圖解所需的 icons
  Sun, CloudRain, Leaf, Circle, TrendingDown, Compass, CloudLightning, Scissors,
  Anchor, AlertTriangle, Droplets, Feather, Share2, Wrench, Briefcase, Building,
  MapPin, Flame, ShieldAlert, Battery, Octagon, Flag, Search, Maximize,
  MessageSquare, Target, Activity, Calendar, Coffee, Package, Lightbulb,
  FileText, Beaker, ArrowLeft, ArrowUp, Hash
} from 'lucide-react';

// 新增：通用底層標籤的顏色樣式對照表
const getTagStyle = (tag) => {
  if (tag.includes('慶祝')) return 'bg-amber-100 text-amber-700 border-amber-200';
  if (tag.includes('保持')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  if (tag.includes('阻礙')) return 'bg-red-100 text-red-700 border-red-200';
  if (tag.includes('嘗試')) return 'bg-blue-100 text-blue-700 border-blue-200';
  if (tag.includes('風險') || tag.includes('疑惑')) return 'bg-orange-100 text-orange-700 border-orange-200';
  if (tag.includes('學習')) return 'bg-purple-100 text-purple-700 border-purple-200';
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
      { name: "太陽 (Ms. Sun)", icon: <Sun className="w-6 h-6"/>, colorBg: "bg-amber-100 text-amber-600", desc: "回顧期間發生的好事！值得大家一起慶祝、或是進行得很順利的地方。", commonTags: ["#值得慶祝 (Good)"] },
      { name: "小青蛙 (Mr. Frog)", icon: <Bug className="w-6 h-6"/>, colorBg: "bg-green-100 text-green-600", desc: "遇到困難了嗎？寫下你需要團隊幫助、需要新工具或培訓的地方。", commonTags: ["#遇到阻礙 (Blocker)"] },
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
      { name: "太陽 (Sun)", icon: <Sun className="w-6 h-6"/>, colorBg: "bg-amber-100 text-amber-600", desc: "光明的時刻！分享專案中值得慶祝、進展順利的成就。", commonTags: ["#值得慶祝 (Good)"] },
      { name: "攀登 (Climbing)", icon: <ArrowUp className="w-6 h-6"/>, colorBg: "bg-blue-100 text-blue-600", desc: "我們正在努力往上爬的部分。寫下團隊穩步推進、需要繼續堅持的事情。", commonTags: ["#繼續保持 (Keep)"] },
      { name: "跌落 (Falling)", icon: <TrendingDown className="w-6 h-6"/>, colorBg: "bg-red-100 text-red-600", desc: "失足的危險！需要注意的失誤、風險，或讓我們退步的原因。", commonTags: ["#潛在風險 (Risk)"] },
      { name: "指南針 (Compass)", icon: <Compass className="w-6 h-6"/>, colorBg: "bg-indigo-100 text-indigo-600", desc: "指引方向。我們接下來應該「開始做」哪些新嘗試來幫助攻頂？", commonTags: ["#新嘗試 (Start)"] },
      { name: "風暴 (Storm)", icon: <CloudLightning className="w-6 h-6"/>, colorBg: "bg-slate-200 text-slate-700", desc: "遇到亂流了。寫下我們面臨的挑戰、模糊不清的需求或外部阻礙。", commonTags: ["#遇到阻礙 (Blocker)"] },
      { name: "雜草 (Weeds)", icon: <Scissors className="w-6 h-6"/>, colorBg: "bg-green-100 text-green-700", desc: "絆住腳步的東西。哪些是浪費時間的流程？我們應該「停止做」什麼？", commonTags: ["#遇到阻礙 (Stop)"] }
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
      { name: "錨 (Anchor)", icon: <Anchor className="w-6 h-6"/>, colorBg: "bg-slate-200 text-slate-700", desc: "拖慢速度的重物。什麼事情阻礙了我們、把我們留在原地？", commonTags: ["#遇到阻礙 (Stop)"] },
      { name: "礁石 (Rocks)", icon: <AlertTriangle className="w-6 h-6"/>, colorBg: "bg-red-100 text-red-600", desc: "前方的潛在危機！我們需要留意哪些即將到來的風險或技術坑？", commonTags: ["#潛在風險 (Risk)"] },
      { name: "太陽 (Sun)", icon: <Sun className="w-6 h-6"/>, colorBg: "bg-amber-100 text-amber-600", desc: "寶藏與高光時刻！分享進展得特別棒、閃閃發光的成就。", commonTags: ["#值得慶祝 (Good)"] },
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
      { name: "花圃 (Garden)", icon: <Sprout className="w-6 h-6"/>, colorBg: "bg-green-100 text-green-600", desc: "正在盛開的花朵！寫下團隊中成長良好、和諧且運作順利的部分。", commonTags: ["#繼續保持 (Keep)", "#值得慶祝 (Good)"] },
      { name: "澆水罐 (Watering Can)", icon: <Droplets className="w-6 h-6"/>, colorBg: "bg-blue-100 text-blue-600", desc: "需要更多滋潤的地方。哪些事情我們應該投入更多時間或資源？", commonTags: ["#新嘗試 (Start)"] },
      { name: "剪刀 (Shears)", icon: <Scissors className="w-6 h-6"/>, colorBg: "bg-slate-100 text-slate-600", desc: "需要修剪的枝葉。我們應該減少做什麼？(例如：無效會議、過度設計)", commonTags: ["#遇到阻礙 (Stop)"] },
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
      { name: "太陽 (Sun)", icon: <Sun className="w-6 h-6"/>, colorBg: "bg-amber-100 text-amber-500", desc: "溫暖的陽光！分享你熱愛、覺得做起來很有成就感的部分。", commonTags: ["#值得慶祝 (Good)"] },
      { name: "戴帽子的小花 (Top Hat Flower)", icon: <Sprout className="w-6 h-6"/>, colorBg: "bg-green-100 text-green-600", desc: "奇妙的生長！哪些事情正在順利發展、或者團隊表現得特別好？", commonTags: ["#繼續保持 (Keep)"] },
      { name: "花盆 (Flower Pots)", icon: <Briefcase className="w-6 h-6"/>, colorBg: "bg-orange-100 text-orange-700", desc: "換個盆子會更好。寫下你覺得可以改變作法、稍作改進的地方。", commonTags: ["#新嘗試 (Start)"] }
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
      { name: "便當盒 (Lunchbox)", icon: <Briefcase className="w-6 h-6"/>, colorBg: "bg-amber-100 text-amber-600", desc: "補充體力！團隊需要更多什麼？(可能是更多溝通、更多測試時間、或下午茶)", commonTags: ["#新嘗試 (Start)"] },
      { name: "三角錐 (Cone)", icon: <AlertTriangle className="w-6 h-6"/>, colorBg: "bg-orange-100 text-orange-600", desc: "施工危險請繞道。我們需要特別注意、小心避開的坑或風險在哪裡？", commonTags: ["#潛在風險 (Risk)"] },
      { name: "吊車與建築 (Building & Crane)", icon: <Building className="w-6 h-6"/>, colorBg: "bg-emerald-100 text-emerald-600", desc: "順利建成的部分。大聲肯定那些運作良好、成功蓋好的功能或模組！", commonTags: ["#值得慶祝 (Good)"] }
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
      { name: "熱氣球 (Hot Air Balloon)", icon: <Wind className="w-6 h-6"/>, colorBg: "bg-red-100 text-red-500", desc: "升空的美景。分享團隊的成功、成就與令人興奮的里程碑。", commonTags: ["#值得慶祝 (Good)"] },
      { name: "暴風雲 (Storm Clouds)", icon: <CloudLightning className="w-6 h-6"/>, colorBg: "bg-slate-200 text-slate-700", desc: "惡劣天氣。這個 Sprint 中哪些事情很困難、讓人害怕或狀況不明確？", commonTags: ["#遇到阻礙 (Blocker)"] },
      { name: "未知森林 (Forest)", icon: <MapPin className="w-6 h-6"/>, colorBg: "bg-green-100 text-green-700", desc: "不要掉進去！我們需要停止做什麼事，或者有哪些未知的領域需要釐清？", commonTags: ["#潛在風險 (Risk)", "#遇到阻礙 (Stop)"] }
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
      { name: "高山 (Mountain)", icon: <Mountain className="w-6 h-6"/>, colorBg: "bg-sky-100 text-sky-600", desc: "像雲霄飛車一樣！分享 Sprint 中令人極度興奮、覺得特別有趣的事情。", commonTags: ["#值得慶祝 (Good)"] },
      { name: "城堡 (Castle)", icon: <Building className="w-6 h-6"/>, colorBg: "bg-indigo-100 text-indigo-500", desc: "魔法時刻！那些令人難忘、充滿 Wow 驚嘆號、表現絕佳的不可思議時刻。", commonTags: ["#值得慶祝 (Good)"] },
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
      { name: "停止標誌 (Stop Sign)", icon: <Octagon className="w-6 h-6"/>, colorBg: "bg-red-100 text-red-600", desc: "立刻煞車！我們必須馬上「停止做」的壞習慣或無效流程是什麼？", commonTags: ["#遇到阻礙 (Stop)"] },
      { name: "終點線 (Finish Line)", icon: <Flag className="w-6 h-6"/>, colorBg: "bg-blue-100 text-blue-600", desc: "衝線時刻！我們是如何受到激勵的？達到目標後我們該如何慶祝？", commonTags: ["#值得慶祝 (Good)", "#新嘗試 (Start)"] }
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
      { name: "尊重 (Respect/Handshake)", icon: <HeartHandshake className="w-6 h-6"/>, colorBg: "bg-pink-100 text-pink-600", desc: "握手言和：不論成功或失敗，我們是否有尊重彼此的專業與付出？", commonTags: ["#值得慶祝 (Good)", "#繼續保持 (Keep)"] },
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
      { name: "規劃會議 (Planning/Joggers)", icon: <Calendar className="w-6 h-6"/>, colorBg: "bg-indigo-100 text-indigo-600", desc: "起跑準備：我們怎麼把 Planning 開得更好，確保選入的工作最有價值？", commonTags: ["#新嘗試 (Start)", "#遇到阻礙 (Stop)"] },
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
      { name: "驗證指標 (Metrics)", icon: <Target className="w-6 h-6"/>, colorBg: "bg-emerald-100 text-emerald-600", desc: "我們怎麼知道實驗成功了沒？要看什麼數據？(例：PR 平均停留時間低於 24 小時)", commonTags: ["#繼續保持 (Keep)"] }
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

export default function App() {
  const [view, setView] = useState('home'); // 'home', 'quiz', 'result', 'all', 'detail'
  const [recommendedIds, setRecommendedIds] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedPattern, setSelectedPattern] = useState(null); // 新增：追蹤目前查看詳細內容的 pattern

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
        <button
          onClick={() => setView(recommendedIds.includes(selectedPattern.id) ? 'result' : 'all')}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          返回列表
        </button>

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

  return (
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
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main>
        {view === 'home' && renderHome()}
        {view === 'quiz' && renderQuiz()}
        {view === 'result' && renderResult()}
        {view === 'all' && renderAll()}
        {view === 'detail' && renderDetail()}
      </main>
    </div>
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
