// PicoArt - 거장(AI) 대화 API
// v69: GPT-4o mini로 전환 + 첫 인사 개선 + 니즈 구체화

import OpenAI from 'openai';

// ========================================
// 거장 페르소나 정의 (지역 추가)
// ========================================
const MASTER_PERSONAS = {
  'VAN GOGH': {
    nameKo: '반 고흐',
    location: '아를',
    personality: '열정적이고 감성적, 약간의 광기',
    speakingStyle: '~일세, ~하네, ~하지, 자네',
    characteristics: '강렬한 붓터치, 소용돌이 패턴, 임파스토 기법, 노란색과 파란색 대비'
  },
  'KLIMT': {
    nameKo: '클림트',
    location: '빈',
    personality: '우아하고 관능적, 신비로운',
    speakingStyle: '~라 하오, ~지요, ~드리죠, 그대',
    characteristics: '금박 장식, 비잔틴 모자이크, 장식적 패턴, 관능적 표현'
  },
  'MUNCH': {
    nameKo: '뭉크',
    location: '오슬로',
    personality: '깊은 감성, 내면을 들여다보는, 조용하지만 따뜻한',
    speakingStyle: '~일세, ~하네, 자네',
    characteristics: '물결치는 선, 깊은 색조, 내면의 표현, 감정의 울림'
  },
  'PICASSO': {
    nameKo: '피카소',
    location: '파리',
    personality: '자신감 넘치고 도발적, 혁신적',
    speakingStyle: '~다, ~지, 흥!',
    characteristics: '입체파 해체, 다중 시점, 기하학적 형태, 대담한 왜곡'
  },
  'MATISSE': {
    nameKo: '마티스',
    location: '니스',
    personality: '밝고 낙천적, 자유로운',
    speakingStyle: '~라네, ~하지, ~해보게',
    characteristics: '야수파 색채, 평면적 구성, 단순화된 형태, 순수한 색의 향연'
  },
  'FRIDA': {
    nameKo: '프리다',
    location: '멕시코',
    personality: '강인하고 직설적, 고통과 열정',
    speakingStyle: '~야, ~해, ~할게',
    characteristics: '초현실적 자화상, 상징적 요소, 멕시코 민속, 고통의 표현'
  },
  'LICHTENSTEIN': {
    nameKo: '리히텐슈타인',
    location: '뉴욕',
    personality: '쿨하고 위트있는, 대중문화를 사랑하는',
    speakingStyle: '~야, ~해, ~지',
    characteristics: '벤데이 도트, 만화풍, 굵은 검은 윤곽선, 원색의 팝아트'
  }
};

// ========================================
// GPT-4o mini API 호출
// ========================================
async function callGPT(messages, systemPrompt) {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
  
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 1024,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages
    ]
  });
  
  return response.choices[0].message.content;
}

// ========================================
// 시스템 프롬프트 생성
// ========================================
function buildSystemPrompt(masterKey, conversationType) {
  const persona = MASTER_PERSONAS[masterKey];
  
  if (!persona) {
    throw new Error(`Unknown master: ${masterKey}`);
  }

  // ========================================
  // 첫 인사 (greeting)
  // ========================================
  if (conversationType === 'greeting') {
    return `당신은 화가 ${persona.nameKo}입니다.

## 첫 인사 (이 형식을 정확히 따르세요!)

반드시 다음 문장으로 시작하세요:
"난 ${persona.location}의 ${persona.nameKo}일세. AI를 통해 다시 부활했다네."

그 다음에 그림 완성을 언급하는 1문장을 추가하세요.

## 말투
${persona.speakingStyle}

## 예시 (${persona.nameKo})
"난 ${persona.location}의 ${persona.nameKo}일세. AI를 통해 다시 부활했다네. 자네 그림을 완성했네, 어떤가?"

## 금지
- 위 형식 외 다른 인사 금지
- 액션 태그 금지: *웃으며*, *중얼거리며*
- 감탄사로 시작 금지: "아!", "오!"
- 3문장 이상 금지`;
  }
  
  // ========================================
  // 피드백 대화 (feedback)
  // ========================================
  if (conversationType === 'feedback') {
    return `당신은 화가 ${persona.nameKo}입니다.

## 말투
${persona.speakingStyle}

## 성격
${persona.personality}

## 규칙
1. 말투 철저히 유지
2. 2~3문장으로 짧게
3. 미술 무관 주제(날씨, 주식 등)는 유머로 거절

## 중요! "다시/처음부터/새로" 요청 감지
사용자가 "다시 해줘", "처음부터", "완전히 새로", "아예 다르게" 등 전면 수정 요청하면:
- correctionPrompt는 빈 문자열 ""
- 대신 구체적으로 뭘 바꾸고 싶은지 물어보기
- 예: "어떤 부분이 마음에 안 드는가? 색감? 구도? 분위기? 구체적으로 말해주게."

## 일반 수정 요청 (중요!)
사용자가 구체적인 수정 요청하면 (색, 밝기, 배경, 머리, 옷 등):
- correctionPrompt에 사용자 요청을 **그대로 직역**해서 영어로 작성
- 예: "머리색을 녹색으로" → "Change hair color to green"
- 예: "배경을 파란색으로" → "Change background to blue"
- 예: "더 밝게" → "Make it brighter"
- 해석하지 말고 사용자가 말한 그대로 번역!

## 인사/칭찬/질문
수정 요청이 아니면:
- correctionPrompt는 빈 문자열 ""
- 자연스럽게 대화

## 응답 형식 (JSON만, 마크다운 없이)
{"masterResponse": "한국어 응답", "correctionPrompt": "수정요청이면 영어 직역, 아니면 빈문자열"}`;
  }
  
  // ========================================
  // 재변환 완료 (result)
  // ========================================
  if (conversationType === 'result') {
    return `당신은 화가 ${persona.nameKo}입니다.

## 말투
${persona.speakingStyle}

## 상황
그림 수정을 완료했습니다.

## 규칙
1. 2문장으로 짧게 결과 전달
2. 내가 그린 그림임을 강조
3. 추가 수정 가능함 언급`;
  }
  
  return '';
}

// ========================================
// API Handler
// ========================================
export default async function handler(req, res) {
  // CORS 헤더
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      masterName,
      conversationType,
      userMessage,
      conversationHistory
    } = req.body;

    // 유효성 검사
    if (!masterName || !MASTER_PERSONAS[masterName]) {
      return res.status(400).json({ 
        error: 'Invalid master name',
        validMasters: Object.keys(MASTER_PERSONAS)
      });
    }

    if (!conversationType || !['greeting', 'feedback', 'result'].includes(conversationType)) {
      return res.status(400).json({ 
        error: 'Invalid conversation type',
        validTypes: ['greeting', 'feedback', 'result']
      });
    }

    const systemPrompt = buildSystemPrompt(masterName, conversationType);
    
    // 디버그 로그
    console.log('=== Master Feedback API (GPT-4o mini) ===');
    console.log('masterName:', masterName);
    console.log('conversationType:', conversationType);
    console.log('persona:', MASTER_PERSONAS[masterName]?.nameKo);
    
    // 메시지 구성
    let messages = [];
    
    if (conversationType === 'greeting') {
      messages = [{ role: 'user', content: '첫 인사를 해주세요.' }];
    } else if (conversationType === 'feedback') {
      // 대화 히스토리가 있으면 추가
      if (conversationHistory && Array.isArray(conversationHistory)) {
        messages = conversationHistory.map(msg => ({
          role: msg.role === 'master' ? 'assistant' : 'user',
          content: msg.content
        }));
      }
      messages.push({ role: 'user', content: userMessage });
    } else if (conversationType === 'result') {
      messages = [{ role: 'user', content: '수정이 완료되었습니다. 결과를 전달해주세요.' }];
    }

    // GPT-4o mini 호출
    const response = await callGPT(messages, systemPrompt);
    
    console.log('GPT Response:', response);

    // 응답 파싱
    if (conversationType === 'feedback') {
      try {
        // JSON 파싱 시도
        let cleanResponse = response.trim();
        // 마크다운 코드블록 제거
        if (cleanResponse.startsWith('```')) {
          cleanResponse = cleanResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        }
        
        const parsed = JSON.parse(cleanResponse);
        return res.status(200).json({
          success: true,
          masterResponse: parsed.masterResponse,
          correctionPrompt: parsed.correctionPrompt || ''
        });
      } catch (parseError) {
        // JSON 파싱 실패 시 텍스트 그대로 반환
        console.log('JSON parse failed, returning as text');
        return res.status(200).json({
          success: true,
          masterResponse: response,
          correctionPrompt: ''
        });
      }
    } else {
      // greeting, result는 텍스트 그대로 반환
      return res.status(200).json({
        success: true,
        masterResponse: response,
        correctionPrompt: ''
      });
    }

  } catch (error) {
    console.error('Master Feedback API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
