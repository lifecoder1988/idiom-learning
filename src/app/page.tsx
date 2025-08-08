'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Trophy, Target, RefreshCw, Percent } from 'lucide-react';

// 成语接口类型
interface Idiom {
  word: string;
  pinyin: string;
  explanation: string;
  example: string;
  derivation: string;
  abbreviation: string;
}

// 转换API数据为组件所需格式
const transformIdiomData = (apiIdiom: Idiom) => {
  // 根据成语长度和复杂度简单判断难度
  const getDifficulty = (word: string, explanation: string) => {
    if (!word || !explanation) return '中级';
    if (word.length <= 4 && explanation.length <= 30) return '初级';
    if (word.length <= 4 && explanation.length <= 60) return '中级';
    return '高级';
  };

  return {
    idiom: apiIdiom.word || '未知成语',
    pinyin: apiIdiom.pinyin || '',
    meaning: apiIdiom.explanation || '暂无释义',
    example: apiIdiom.example || '暂无例句',
    difficulty: getDifficulty(apiIdiom.word, apiIdiom.explanation)
  };
};

// 获取随机成语的API调用函数
const fetchRandomIdiom = async () => {
  try {
    const response = await fetch('/api/idiom');
    if (!response.ok) {
      throw new Error('Failed to fetch idiom');
    }
    const data = await response.json();
    return transformIdiomData(data.data);
  } catch (error) {
    console.error('Error fetching idiom:', error);
    // 返回默认成语作为后备
    return {
      idiom: '画蛇添足',
      pinyin: 'huà shé tiān zú',
      meaning: '画蛇时给蛇添上脚。比喻做了多余的事，非但无益，反而不合适。',
      example: '这幅画已经很完美了，你再加些装饰就是画蛇添足了。',
      difficulty: '中级'
    };
  }
};

export default function Home() {
  const [currentIdiom, setCurrentIdiom] = useState({
    idiom: '加载中...',
    pinyin: '',
    meaning: '正在获取成语数据...',
    example: '',
    difficulty: '中级'
  });
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [gameMode, setGameMode] = useState<'meaning' | 'example' | 'mixed'>('meaning');
  const [studyMode, setStudyMode] = useState(true);
  const [loading, setLoading] = useState(false);

  const getRandomIdiom = async () => {
    setLoading(true);
    try {
      const newIdiom = await fetchRandomIdiom();
      setCurrentIdiom(newIdiom);
      setUserAnswer('');
      setShowAnswer(false);
    } catch (error) {
      console.error('Error getting random idiom:', error);
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时获取第一个成语
  useEffect(() => {
    getRandomIdiom();
  }, []);

  const checkAnswer = () => {
    if (userAnswer.trim().toLowerCase() === currentIdiom.idiom.toLowerCase()) {
      setScore(score + 1);
    }
    setTotalQuestions(totalQuestions + 1);
    setShowAnswer(true);
  };

  const nextQuestion = async () => {
    await getRandomIdiom();
  };

  const resetGame = async () => {
    setScore(0);
    setTotalQuestions(0);
    await getRandomIdiom();
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
              <Percent className="w-8 h-8 text-green-500 mx-auto mb-2" />
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
          <Button onClick={getRandomIdiom} variant="outline" disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? '加载中...' : '换一个成语'}
          </Button>
          {!studyMode && (
            <Button onClick={resetGame} variant="outline">
              重置游戏
            </Button>
          )}
        </div>

        {/* 页脚 */}
        <div className="text-center mt-8 text-gray-500">
          <p>祝你的朋友Dr.Yu考试顺利！📚</p>
        </div>
      </div>
    </div>
  );
}
