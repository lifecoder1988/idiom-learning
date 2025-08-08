'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface Idiom {
  word: string;
  pinyin: string;
  explanation: string;
  example: string;
  derivation: string;
  abbreviation: string;
}

interface ApiResponse {
  success: boolean;
  data: Idiom;
  total: number;
}

export default function ApiTestPage() {
  const [idiom, setIdiom] = useState<Idiom | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRandomIdiom = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/idiom');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      if (data.success) {
        setIdiom(data.data);
      } else {
        setError('API返回错误');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取成语失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">成语API测试</h1>
          <p className="text-gray-600">测试随机成语API接口</p>
        </div>

        <div className="text-center mb-6">
          <Button 
            onClick={fetchRandomIdiom} 
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? '获取中...' : '获取随机成语'}
          </Button>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-600">错误: {error}</p>
            </CardContent>
          </Card>
        )}

        {idiom && (
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl text-blue-600">
                {idiom.word}
              </CardTitle>
              <p className="text-center text-gray-500">{idiom.pinyin}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">释义：</h3>
                <p className="text-gray-600">{idiom.explanation}</p>
              </div>
              
              {idiom.example && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">例句：</h3>
                  <p className="text-gray-600">{idiom.example}</p>
                </div>
              )}
              
              {idiom.derivation && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">出处：</h3>
                  <p className="text-gray-600">{idiom.derivation}</p>
                </div>
              )}
              
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">缩写：</h3>
                <p className="text-gray-600">{idiom.abbreviation}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 text-center">
          <Card>
            <CardHeader>
              <CardTitle>API使用说明</CardTitle>
            </CardHeader>
            <CardContent className="text-left space-y-2">
              <p><strong>接口地址：</strong> <code className="bg-gray-100 px-2 py-1 rounded">/api/idiom</code></p>
              <p><strong>请求方法：</strong> GET</p>
              <p><strong>返回格式：</strong> JSON</p>
              <p><strong>查询参数：</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><code>count</code> - 可选，返回成语数量（默认为1）</li>
              </ul>
              <p><strong>示例：</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><code>/api/idiom</code> - 返回单个随机成语</li>
                <li><code>/api/idiom?count=5</code> - 返回5个随机成语</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}