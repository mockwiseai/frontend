import { NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const difficulty = searchParams.get('difficulty');
    
    console.log('API Route: Fetching question for difficulty:', difficulty);
    
    const response = await axios.get(`${API_BASE_URL}/api/questions/random?difficulty=${difficulty}`);
    
    console.log('API Route: Response received:', response.data);
    
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('API Route Error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Failed to fetch question' },
      { status: error.response?.status || 500 }
    );
  }
}
