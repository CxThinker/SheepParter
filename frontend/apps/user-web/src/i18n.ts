export type AuthStatus = "checking" | "authenticated" | "anonymous";
export type Locale = "en-US" | "zh-CN";
export type PageKey = "home" | "start" | "settings" | "profile";
export type Tone = "cyan" | "orange" | "green" | "red";

export type NavItem = {
  key: PageKey;
  label: string;
  caption: string;
  tone: Tone;
};

export const localeStorageKey = "sheepparter.locale";
export const fallbackLocale: Locale = "en-US";
export const localeOptions: Array<{ label: string; value: Locale }> = [
  { label: "中文", value: "zh-CN" },
  { label: "English", value: "en-US" }
];

export function isLocale(value: unknown): value is Locale {
  return value === "en-US" || value === "zh-CN";
}

export function resolveLocale(value: unknown): Locale {
  return isLocale(value) ? value : fallbackLocale;
}

export const messagesByLocale = {
  "en-US": {
    auth: {
      eyebrow: "[ ENGLISH TO CHINESE ]",
      title: "Neon Chinese Lab",
      subtitle: "Game-based drills for moving from English prompts to confident Chinese recall.",
      emailLabel: "Email",
      emailHelp: "Demo: demo@sheepparter.test",
      passwordLabel: "Password",
      passwordHelp: "Demo password: LearnChinese123",
      submit: "Enter lab",
      submitting: "Checking",
      invalidCredentials: "Sign-in failed. Check the demo email and password.",
      apiUnavailable: "Cannot reach the API. Check that the backend is running on port 8000.",
      sessionEyebrow: "[ SESSION ]",
      checkingAccess: "Checking access",
      signalTitle: "Practice signal",
      signalBody: "English clue -> Chinese answer -> instant feedback -> streak pressure."
    },
    shell: {
      product: "SheepParter",
      subtitle: "English -> Chinese game demo",
      api: "API",
      logout: "Log out",
      navLabel: "User navigation",
      loginForm: "Login form"
    },
    nav: [
      { key: "home", label: "Home", caption: "Overview", tone: "cyan" },
      { key: "start", label: "Start", caption: "Practice", tone: "orange" },
      { key: "settings", label: "Settings", caption: "Controls", tone: "green" },
      { key: "profile", label: "Profile", caption: "Learner", tone: "red" }
    ] satisfies NavItem[],
    pages: {
      home: {
        eyebrow: "[ HOME ]",
        title: "Today’s language run",
        description: "Track recall, keep the streak alive, and jump back into English-to-Chinese practice.",
        cards: [
          { label: "Recall score", value: "82%", detail: "+8 this week", tone: "cyan" },
          { label: "Study streak", value: "14", detail: "days active", tone: "green" },
          { label: "Queued prompts", value: "27", detail: "ready now", tone: "orange" }
        ],
        queueEyebrow: "[ QUEUE ]",
        missions: [
          { title: "Pinyin warmup", meta: "04 min", status: "Ready" },
          { title: "Character recall", meta: "12 prompts", status: "Queued" },
          { title: "Phrase review", meta: "3 weak spots", status: "Draft" }
        ]
      },
      start: {
        eyebrow: "[ START ]",
        title: "Practice modes",
        selectorLabel: "Practice mode selector",
        collapseLabel: "Collapse mode selector",
        expandLabel: "Expand mode selector",
        stageEyebrow: "[ MODE ]",
        emptyTitle: "Feature placeholder",
        emptyBody: "The selected mode panel is reserved for future gameplay functions.",
        modes: [
          { id: "vocabulary-hunter", label: "Vocabulary Hunter", mark: "VH" },
          { id: "color-storm", label: "Color Storm", mark: "CS" },
          { id: "finger-rhythm", label: "Fingertip Rhythm", mark: "FR" },
          { id: "greedy-dragon", label: "Word Link", mark: "WL" }
        ],
        games: {
          common: {
            start: "Start",
            pause: "Pause",
            reset: "Reset",
            left: "Left",
            right: "Right",
            correct: "Correct",
            wrong: "Wrong",
            missed: "Missed",
            progress: "Progress",
            complete: "Complete"
          },
          vocabularyHunter: {
            help: "Catch falling words with the cart. Match the cart label to the word type.",
            cartLabel: "Cart label",
            lanes: [
              { id: "food", label: "Food" },
              { id: "drink", label: "Drink" },
              { id: "action", label: "Action" }
            ],
            items: [
              { id: "rice", label: "米饭", target: "food", lane: 0 },
              { id: "tea", label: "茶", target: "drink", lane: 1 },
              { id: "run", label: "跑", target: "action", lane: 2 },
              { id: "noodle", label: "面条", target: "food", lane: 1 }
            ]
          },
          colorStorm: {
            help: "Catch falling color cards with the cart. Match the cart color to the card color.",
            cartLabel: "Cart color",
            lanes: [
              { id: "blue", label: "Blue" },
              { id: "orange", label: "Orange" },
              { id: "green", label: "Green" }
            ],
            items: [
              { id: "blue", label: "蓝色", target: "blue", lane: 0, color: "#1683ff" },
              { id: "orange", label: "橙色", target: "orange", lane: 2, color: "#ff9b2f" },
              { id: "green", label: "绿色", target: "green", lane: 1, color: "#70ff7a" },
              { id: "blue-two", label: "蓝色", target: "blue", lane: 1, color: "#1683ff" }
            ]
          },
          rhythm: {
            help: "Watch the Chinese words appear in rhythm, then choose the English cards in the same order.",
            play: "Play rhythm",
            locked: "Right side unlocks after the rhythm finishes.",
            unlocked: "Choose translations in the same rhythm order.",
            pairs: [
              { id: "hello", left: "你好", right: "hello" },
              { id: "water", left: "水", right: "water" },
              { id: "rice", left: "米饭", right: "rice" },
              { id: "study", left: "学习", right: "study" }
            ]
          },
          dragon: {
            help: "Hold the highlighted first word, then touch each next word card in order.",
            sentence: "I drink tea",
            next: "Next word",
            path: "Linked words",
            dragHint: "Start by pressing the highlighted word card.",
            steps: [
              { id: "i", label: "我" },
              { id: "drink", label: "喝" },
              { id: "tea", label: "茶" }
            ],
            tiles: [
              { id: "tea", label: "茶", cell: 3 },
              { id: "i", label: "我", cell: 5 },
              { id: "eat", label: "吃", cell: 7 },
              { id: "drink", label: "喝", cell: 10 },
              { id: "rice", label: "米饭", cell: 13 }
            ]
          }
        }
      },
      settings: {
        eyebrow: "[ SETTINGS ]",
        title: "Tune the practice loop",
        description: "Demo settings are stored locally in this screen only; they do not change the database.",
        dailyGoal: "Daily goal",
        pinyinHints: "Pinyin hints",
        promptUnit: "prompts",
        decreaseDailyGoal: "Decrease daily goal",
        increaseDailyGoal: "Increase daily goal",
        interfaceLanguage: "Interface language",
        soundEffects: "Sound effects",
        challengeMode: "Challenge mode",
        enabled: "Enabled",
        disabled: "Disabled"
      },
      profile: {
        eyebrow: "[ PROFILE ]",
        title: "Learner profile",
        description: "Current demo account and practice telemetry.",
        account: "Account",
        streak: "Current streak",
        streakValue: "14 days",
        streakHint: "Green border means active streak",
        mode: "Practice mode",
        modeValue: "English -> Chinese",
        logout: "Log out",
        fallbackName: "Learner"
      }
    }
  },
  "zh-CN": {
    auth: {
      eyebrow: "[ 英文学习中文 ]",
      title: "霓虹中文实验室",
      subtitle: "通过游戏化练习，把英文提示转化为稳定的中文记忆。",
      emailLabel: "邮箱",
      emailHelp: "演示账号：demo@sheepparter.test",
      passwordLabel: "密码",
      passwordHelp: "演示密码：LearnChinese123",
      submit: "进入实验室",
      submitting: "检查中",
      invalidCredentials: "登录失败，请检查演示邮箱和密码。",
      apiUnavailable: "无法连接 API，请确认后端已运行在 8000 端口。",
      sessionEyebrow: "[ 会话 ]",
      checkingAccess: "正在检查访问权限",
      signalTitle: "练习信号",
      signalBody: "英文线索 -> 中文答案 -> 即时反馈 -> 连续练习压力。"
    },
    shell: {
      product: "SheepParter",
      subtitle: "英文 -> 中文游戏化演示",
      api: "API",
      logout: "退出登录",
      navLabel: "用户导航",
      loginForm: "登录表单"
    },
    nav: [
      { key: "home", label: "首页", caption: "概览", tone: "cyan" },
      { key: "start", label: "开始", caption: "练习", tone: "orange" },
      { key: "settings", label: "设置", caption: "控制", tone: "green" },
      { key: "profile", label: "个人页面", caption: "学习者", tone: "red" }
    ] satisfies NavItem[],
    pages: {
      home: {
        eyebrow: "[ 首页 ]",
        title: "今日语言训练",
        description: "追踪回忆表现，保持连续练习，并回到英文到中文的训练节奏。",
        cards: [
          { label: "回忆得分", value: "82%", detail: "本周 +8", tone: "cyan" },
          { label: "连续学习", value: "14", detail: "天活跃", tone: "green" },
          { label: "待练提示", value: "27", detail: "可立即开始", tone: "orange" }
        ],
        queueEyebrow: "[ 队列 ]",
        missions: [
          { title: "拼音热身", meta: "04 分钟", status: "就绪" },
          { title: "汉字回忆", meta: "12 个提示", status: "排队中" },
          { title: "短语复习", meta: "3 个弱点", status: "草稿" }
        ]
      },
      start: {
        eyebrow: "[ 开始 ]",
        title: "练习模式",
        selectorLabel: "练习模式选择",
        collapseLabel: "收起练习模式选择",
        expandLabel: "展开练习模式选择",
        stageEyebrow: "[ 模式 ]",
        emptyTitle: "功能暂时留空",
        emptyBody: "当前选择卡对应功能区域已预留，后续可接入具体玩法。",
        modes: [
          { id: "vocabulary-hunter", label: "词汇猎手", mark: "词" },
          { id: "color-storm", label: "色彩风暴", mark: "色" },
          { id: "finger-rhythm", label: "指尖节奏", mark: "节" },
          { id: "greedy-dragon", label: "词龙接句", mark: "句" }
        ],
        games: {
          common: {
            start: "开始",
            pause: "暂停",
            reset: "重置",
            left: "左移",
            right: "右移",
            correct: "正确",
            wrong: "错误",
            missed: "未接住",
            progress: "进度",
            complete: "完成"
          },
          vocabularyHunter: {
            help: "接住顶部掉落的词汇。购物车标签与词汇类型一致则正确。",
            cartLabel: "购物车标签",
            lanes: [
              { id: "food", label: "食物" },
              { id: "drink", label: "饮品" },
              { id: "action", label: "动作" }
            ],
            items: [
              { id: "rice", label: "米饭", target: "food", lane: 0 },
              { id: "tea", label: "茶", target: "drink", lane: 1 },
              { id: "run", label: "跑", target: "action", lane: 2 },
              { id: "noodle", label: "面条", target: "food", lane: 1 }
            ]
          },
          colorStorm: {
            help: "接住顶部掉落的颜色文字卡片。购物车颜色与卡片颜色一致则正确。",
            cartLabel: "购物车颜色",
            lanes: [
              { id: "blue", label: "蓝色" },
              { id: "orange", label: "橙色" },
              { id: "green", label: "绿色" }
            ],
            items: [
              { id: "blue", label: "蓝色", target: "blue", lane: 0, color: "#1683ff" },
              { id: "orange", label: "橙色", target: "orange", lane: 2, color: "#ff9b2f" },
              { id: "green", label: "绿色", target: "green", lane: 1, color: "#70ff7a" },
              { id: "blue-two", label: "蓝色", target: "blue", lane: 1, color: "#1683ff" }
            ]
          },
          rhythm: {
            help: "左侧按节奏出现中文词汇，结束后在右侧按同样顺序选择英文翻译。",
            play: "播放节奏",
            locked: "右侧会在节奏播放完毕后解封。",
            unlocked: "请按刚才的顺序选择英文翻译。",
            pairs: [
              { id: "hello", left: "你好", right: "hello" },
              { id: "water", left: "水", right: "water" },
              { id: "rice", left: "米饭", right: "rice" },
              { id: "study", left: "学习", right: "study" }
            ]
          },
          dragon: {
            help: "按住高亮的第一个词卡，再依序触碰后续词卡完成连句。",
            sentence: "I drink tea",
            next: "下一个词卡",
            path: "已连接词卡",
            dragHint: "请从高亮词卡按下开始。",
            steps: [
              { id: "i", label: "我" },
              { id: "drink", label: "喝" },
              { id: "tea", label: "茶" }
            ],
            tiles: [
              { id: "tea", label: "茶", cell: 3 },
              { id: "i", label: "我", cell: 5 },
              { id: "eat", label: "吃", cell: 7 },
              { id: "drink", label: "喝", cell: 10 },
              { id: "rice", label: "米饭", cell: 13 }
            ]
          }
        }
      },
      settings: {
        eyebrow: "[ 设置 ]",
        title: "调整练习循环",
        description: "演示设置仅保存在当前界面，不会修改数据库。",
        dailyGoal: "每日目标",
        pinyinHints: "拼音提示",
        promptUnit: "个提示",
        decreaseDailyGoal: "减少每日目标",
        increaseDailyGoal: "增加每日目标",
        interfaceLanguage: "界面语言",
        soundEffects: "音效",
        challengeMode: "挑战模式",
        enabled: "已开启",
        disabled: "已关闭"
      },
      profile: {
        eyebrow: "[ 个人页面 ]",
        title: "学习者档案",
        description: "当前演示账号与练习状态。",
        account: "账号",
        streak: "当前连续学习",
        streakValue: "14 天",
        streakHint: "绿色边框表示连续学习仍在进行",
        mode: "练习模式",
        modeValue: "英文 -> 中文",
        logout: "退出登录",
        fallbackName: "学习者"
      }
    }
  }
} as const;

export type Messages = (typeof messagesByLocale)[Locale];
