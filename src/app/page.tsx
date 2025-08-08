'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Trophy, Target, RefreshCw } from 'lucide-react';

// 成语数据
const idioms = [
  {
    idiom: '画蛇添足',
    pinyin: 'huà shé tiān zú',
    meaning: '画蛇时给蛇添上脚。比喻做了多余的事，非但无益，反而不合适。',
    example: '这幅画已经很完美了，你再加些装饰就是画蛇添足了。',
    difficulty: '中级'
  },
  {
    idiom: '守株待兔',
    pinyin: 'shǒu zhū dài tù',
    meaning: '原比喻希图不经过努力而得到成功的侥幸心理。现也比喻死守狭隘经验，不知变通。',
    example: '学习不能守株待兔，要主动探索新知识。',
    difficulty: '初级'
  },
  {
    idiom: '杯弓蛇影',
    pinyin: 'bēi gōng shé yǐng',
    meaning: '将映在酒杯里的弓影误认为蛇。比喻因疑神疑鬼而引起恐惧。',
    example: '他总是杯弓蛇影，把别人的善意当成恶意。',
    difficulty: '高级'
  },
  {
    idiom: '亡羊补牢',
    pinyin: 'wáng yáng bǔ láo',
    meaning: '羊逃跑了再去修补羊圈，还不算晚。比喻出了问题以后想办法补救，可以防止继续受损失。',
    example: '虽然考试失利了，但现在努力学习还不晚，亡羊补牢，为时未晚。',
    difficulty: '中级'
  },
  {
    idiom: '刻舟求剑',
    pinyin: 'kè zhōu qiú jiàn',
    meaning: '比喻不懂事物已发展变化而仍静止地看问题。',
    example: '时代在发展，我们不能刻舟求剑，要与时俱进。',
    difficulty: '中级'
  },
  {
    idiom: '掩耳盗铃',
    pinyin: 'yǎn ěr dào líng',
    meaning: '偷铃铛怕别人听见而捂住自己的耳朵。比喻自己欺骗自己，明明掩盖不住的事情偏要想法子掩盖。',
    example: '他这种做法纯属掩耳盗铃，问题迟早会暴露的。',
    difficulty: '初级'
  },
  {
    idiom: '叶公好龙',
    pinyin: 'yè gōng hào lóng',
    meaning: '比喻口头上说爱好某事物，实际上并不真爱好。',
    example: '他说喜欢古典音乐，但从不去听音乐会，这就是叶公好龙。',
    difficulty: '高级'
  },
  {
    idiom: '塞翁失马',
    pinyin: 'sài wēng shī mǎ',
    meaning: '比喻一时虽然受到损失，也许反而因此能得到好处。也指坏事在一定条件下可变为好事。',
    example: '他失业后反而找到了更好的工作，真是塞翁失马，焉知非福。',
    difficulty: '高级'
  }
];

export default function Home() {
  const [currentIdiom, setCurrentIdiom] = useState(idioms[0]);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [gameMode, setGameMode] = useState<'meaning' | 'example' | 'mixed'>('meaning');
  const [studyMode, setStudyMode] = useState(true);

  const getRandomIdiom = () => {
    const randomIndex = Math.floor(Math.random() * idioms.length);
    setCurrentIdiom(idioms[randomIndex]);
    setUserAnswer('');
    setShowAnswer(false);
  };

  const checkAnswer = () => {
    if (userAnswer.trim().toLowerCase() === currentIdiom.idiom.toLowerCase()) {
      setScore(score + 1);
    }
    setTotalQuestions(totalQuestions + 1);
    setShowAnswer(true);
  };

  const nextQuestion = () => {
    getRandomIdiom();
  };

  const resetGame = () => {
    setScore(0);
    setTotalQuestions(0);
    getRandomIdiom();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case '初级': return 'bg-green-100 text-green-800';
      case '中级': return 'bg-yellow-100 text-yellow-800';
      case '高级': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQuestionText = () => {
    switch (gameMode) {
      case 'meaning':
        return `根据释义猜成语：${currentIdiom.meaning}`;
      case 'example':
        return `根据例句猜成语：${currentIdiom.example}`;
      case 'mixed':
        return Math.random() > 0.5 
          ? `根据释义猜成语：${currentIdiom.meaning}`
          : `根据例句猜成语：${currentIdiom.example}`;
      default:
        return `根据释义猜成语：${currentIdiom.meaning}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* 头部 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <BookOpen className="text-blue-600" />
            成语100分
          </h1>
          <p className="text-gray-600">助力博士考试，成语学习好帮手</p>
        </div>

        {/* 统计面板 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{score}</div>
              <div className="text-sm text-gray-600">正确答案</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{totalQuestions}</div>
              <div className="text-sm text-gray-600">总题数</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-800">
                {totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-600">正确率</div>
            </CardContent>
          </Card>
        </div>

        {/* 模式选择 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>学习模式</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                variant={studyMode ? "default" : "outline"}
                onClick={() => setStudyMode(true)}
              >
                学习模式
              </Button>
              <Button
                variant={!studyMode ? "default" : "outline"}
                onClick={() => setStudyMode(false)}
              >
                测试模式
              </Button>
            </div>
            {!studyMode && (
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={gameMode === 'meaning' ? "default" : "outline"}
                  onClick={() => setGameMode('meaning')}
                  size="sm"
                >
                  根据释义猜成语
                </Button>
                <Button
                  variant={gameMode === 'example' ? "default" : "outline"}
                  onClick={() => setGameMode('example')}
                  size="sm"
                >
                  根据例句猜成语
                </Button>
                <Button
                  variant={gameMode === 'mixed' ? "default" : "outline"}
                  onClick={() => setGameMode('mixed')}
                  size="sm"
                >
                  混合模式
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 主要学习区域 */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>当前成语</CardTitle>
              <Badge className={getDifficultyColor(currentIdiom.difficulty)}>
                {currentIdiom.difficulty}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {studyMode ? (
              // 学习模式
              <div className="space-y-4">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">{currentIdiom.idiom}</h2>
                  <p className="text-lg text-gray-600 mb-4">{currentIdiom.pinyin}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">释义：</h3>
                  <p className="text-gray-700">{currentIdiom.meaning}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">例句：</h3>
                  <p className="text-gray-700">{currentIdiom.example}</p>
                </div>
              </div>
            ) : (
              // 测试模式
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-lg text-gray-800">{getQuestionText()}</p>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="请输入成语"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !showAnswer && checkAnswer()}
                    disabled={showAnswer}
                  />
                  {!showAnswer ? (
                    <Button onClick={checkAnswer} disabled={!userAnswer.trim()}>
                      提交答案
                    </Button>
                  ) : (
                    <Button onClick={nextQuestion}>
                      下一题
                    </Button>
                  )}
                </div>
                {showAnswer && (
                  <div className="space-y-3">
                    <div className={`p-4 rounded-lg ${
                      userAnswer.trim().toLowerCase() === currentIdiom.idiom.toLowerCase()
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                    }`}>
                      <p className="font-semibold">
                        {userAnswer.trim().toLowerCase() === currentIdiom.idiom.toLowerCase()
                          ? '✅ 回答正确！'
                          : '❌ 回答错误'}
                      </p>
                      <p className="text-lg font-bold mt-2">正确答案：{currentIdiom.idiom}</p>
                      <p className="text-gray-600">{currentIdiom.pinyin}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-2">释义：</h3>
                      <p className="text-gray-700 mb-3">{currentIdiom.meaning}</p>
                      <h3 className="font-semibold text-gray-800 mb-2">例句：</h3>
                      <p className="text-gray-700">{currentIdiom.example}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 操作按钮 */}
        <div className="flex flex-wrap gap-2 justify-center">
          <Button onClick={getRandomIdiom} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            换一个成语
          </Button>
          {!studyMode && (
            <Button onClick={resetGame} variant="outline">
              重置游戏
            </Button>
          )}
        </div>

        {/* 页脚 */}
        <div className="text-center mt-8 text-gray-500">
          <p>祝你的朋友博士考试顺利！📚</p>
        </div>
      </div>
    </div>
  );
}
