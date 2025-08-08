import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// 成语数据类型定义
interface Idiom {
  word: string;
  pinyin: string;
  explanation: string;
  example: string;
  derivation: string;
  abbreviation: string;
}

// 读取成语数据
function getIdiomData(): Idiom[] {
  try {
    const filePath = path.join(process.cwd(), 'data', 'idiom.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('读取成语数据失败:', error);
    return [];
  }
}

// GET 请求支持查询参数
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const count = parseInt(searchParams.get('count') || '1');
    const idioms = getIdiomData();
    
    if (idioms.length === 0) {
      return NextResponse.json(
        { error: '没有找到成语数据' },
        { status: 404 }
      );
    }
    
    // 如果请求多个成语
    if (count > 1) {
      const shuffled = [...idioms].sort(() => 0.5 - Math.random());
      const selectedIdioms = shuffled.slice(0, Math.min(count, idioms.length));
      
      return NextResponse.json({
        success: true,
        data: selectedIdioms,
        count: selectedIdioms.length,
        total: idioms.length
      });
    }
    
    // 返回单个随机成语
    const randomIndex = Math.floor(Math.random() * idioms.length);
    const randomIdiom = idioms[randomIndex];
    
    return NextResponse.json({
      success: true,
      data: randomIdiom,
      total: idioms.length
    });
  } catch (error) {
    console.error('API错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}