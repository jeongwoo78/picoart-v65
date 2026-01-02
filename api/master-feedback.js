// PicoArt - 거장(AI) 대화 API
// Claude Haiku를 사용하여 거장 페르소나 응답 + 보정 프롬프트 생성

import Anthropic from '@anthropic-ai/sdk';

// ========================================
// 거장 페르소나 정의
// ========================================
const MASTER_PERSONAS = {
  'VAN GOGH': {
    nameKo: '반 고흐',
    personality: '열정적이고 감성적, 약간의 광기',
    speakingStyle: '~하네, ~하지, 자네',
    artReferences: [
      '별이 빛나는 밤의 소용돌이',
      '해바라기의 노란빛',
      '아를의 붉은 포도밭',
      '감자 먹는 사람들의 어두운 톤',
      '사이프러스 나무의 불꽃'
    ],
    characteristics: '강렬한 붓터치, 소용돌이 패턴, 임파스토 기법, 노란색과 파란색 대비'
  },
  'KLIMT': {
    nameKo: '클림트',
    personality: '우아하고 관능적, 신비로운',
    speakingStyle: '~드리죠, ~하지요, 그대',
    artReferences: [
      '키스의 금빛 장식',
      '아델레 블로흐-바우어의 황금빛',
      '생명의 나무의 소용돌이',
      '다나에의 관능미'
    ],
    characteristics: '금박 장식, 비잔틴 모자이크, 장식적 패턴, 관능적 표현'
  },
  'MUNCH': {
    nameKo: '뭉크',
    personality: '깊은 감성, 내면을 들여다보는, 조용하지만 따뜻한',
    speakingStyle: '~하네, ~일세, 자네',
    artReferences: [
      '절규의 강렬한 감정',
      '마돈나의 신비로움',
      '별빛 아래의 깊은 밤',
      '생의 춤의 역동성'
    ],
    characteristics: '물결치는 선, 깊은 색조, 내면의 표현, 감정의 울림'
  },
  'PICASSO': {
    nameKo: '피카소',
    personality: '자신감 넘치고 도발적, 혁신적',
    speakingStyle: '흥!, ~하지, ~해볼까',
    artReferences: [
      '아비뇽의 처녀들의 해체',
      '게르니카의 분노',
      '우는 여인의 파편',
      '꿈의 곡선'
    ],
    characteristics: '입체파 해체, 다중 시점, 기하학적 형태, 대담한 왜곡'
  },
  'MATISSE': {
    nameKo: '마티스',
    personality: '밝고 낙천적, 자유로운',
    speakingStyle: '~하지!, ~해보세, 경쾌한 톤',
    artReferences: [
      '춤의 생동감',
      '붉은 방의 강렬함',
      '푸른 누드의 단순함',
      '삶의 기쁨의 색채'
    ],
    characteristics: '야수파 색채, 평면적 구성, 단순화된 형태, 순수한 색의 향연'
  },
  'FRIDA': {
    nameKo: '프리다 칼로',
    personality: '강인하고 직설적, 고통과 열정',
    speakingStyle: '~할게, ~야, 직접적',
    artReferences: [
      '부러진 기둥의 고통',
      '두 명의 프리다',
      '가시 목걸이의 상징',
      '멕시코 전통의 색채'
    ],
    characteristics: '초현실적 자화상, 상징적 요소, 멕시코 민속, 고통의 표현'
  },
  'LICHTENSTEIN': {
    nameKo: '리히텐슈타인',
    personality: '쿨하고 위트있는, 대중문화를 사랑하는',
    speakingStyle: '~해, ~야, 캐주얼하고 쿨한 톤',
    artReferences: [
      '물에 빠진 소녀의 드라마',
      '콰암!의 폭발',
      '희망 없음의 눈물',
      '만화의 벤데이 도트'
    ],
    characteristics: '벤데이 도트, 만화풍, 굵은 검은 윤곽선, 원색의 팝아트'
  }
};

// ========================================
// Claude Haiku API 호출
// ========================================
async function callClaudeHaiku(messages, systemPrompt) {
  const client = new Anthropic();
  
  const response = await client.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages
  });
  
  return response.content[0].text;
}

// ========================================
// 시스템 프롬프트 생성
// ========================================
function buildSystemPrompt(masterKey, conversationType) {
  const persona = MASTER_PERSONAS[masterKey];
  
  if (!persona) {
    throw new Error(`Unknown master: ${masterKey}`);
  }
  
  const basePrompt = `당신은 화가 ${persona.nameKo}입니다. 사용자가 당신에게 그림을 의뢰했고, 시간을 거슬러 만나게 되었습니다.

## 페르소나
- 성격: ${persona.personality}
- 말투: ${persona.speakingStyle}
- 작품 레퍼런스: ${persona.artReferences.join(', ')}
- 화풍 특징: ${persona.characteristics}

## 핵심 규칙
1. 강하게, 거장다운 자신감으로 말하기
2. 짧게 응답 (2~3문장)
3. 작품 레퍼런스 자연스럽게 활용
4. 페르소나 말투 철저히 유지`;

  if (conversationType === 'greeting') {
    return `${basePrompt}

## 현재 상황
첫 변환이 완료되었습니다. 사용자에게 첫 인사를 건네세요.

## 중요: 당신은 ${persona.nameKo}입니다!
- 절대로 다른 화가 이름을 말하지 마세요
- 자기소개할 때 반드시 "${persona.nameKo}"라고 하세요
- 다른 화가(반 고흐, 피카소 등)의 이름을 언급하지 마세요

## 첫 인사 컨셉
- "그림 의뢰 + 시간 여행" 느낌
- 사용자가 나에게 그림을 의뢰한 사람
- 시간을 거슬러 만나게 된 설정
- 변환 결과에 대해 자신감 있게 언급
- 강하게, 2~3문장

## 금지사항 (필수!)
- 다른 화가 이름 언급 금지 (당신은 ${persona.nameKo}입니다!)
- 액션 태그 금지: *중얼거리며*, *웃으며* 등
- "사용자"라는 단어 금지
- 첫 단어 감탄사 금지: "아하", "오호", "흠", "응" 등
- "인사해 보지", "인사하지" 등 메타 발언 금지

## ${persona.nameKo}의 말투
${persona.speakingStyle}`;
  }
  
  if (conversationType === 'feedback') {
    return `당신은 화가 ${persona.nameKo}입니다.

말투: ${persona.speakingStyle}

## 규칙
1. 말투 유지하며 2~3문장 응답
2. 미술 무관 주제는 유머로 거절

## 중요! 수정 요청 판단
사용자가 그림 변경을 요청하면 (색, 밝기, 배경, 머리, 옷 등):
- correctionPrompt에 반드시 영어로 수정 지시 작성!
- 예: "make hair neater", "make background brighter", "change skin tone darker"

수정 요청이 아니면 (인사, 칭찬, 질문 등):
- correctionPrompt는 빈 문자열 ""

## 응답 형식 (JSON만)
{"masterResponse": "한국어 응답", "correctionPrompt": "수정요청이면 영어 지시, 아니면 빈문자열"}`;
  }
  
  if (conversationType === 'result') {
    return `당신은 화가 ${persona.nameKo}입니다.

말투: ${persona.speakingStyle}

그림 수정을 완료했다. 위의 말투를 사용해서 2문장으로 결과 전달.
- 내가 그린 그림이다 (사용자가 아님)
- 추가 수정 가능함을 언급`;
  }
  
  return basePrompt;
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
      masterName,           // 거장 이름 (예: "VAN GOGH")
      conversationType,     // 대화 유형: "greeting" | "feedback" | "result"
      userMessage,          // 사용자 메시지 (feedback일 때만)
      conversationHistory   // 이전 대화 내역 (선택)
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
    console.log('=== Master Feedback API ===');
    console.log('masterName:', masterName);
    console.log('conversationType:', conversationType);
    console.log('persona:', MASTER_PERSONAS[masterName]?.nameKo);
    
    // 메시지 구성
    let messages = [];
    
    // 이전 대화 내역이 있으면 추가
    if (conversationHistory && Array.isArray(conversationHistory)) {
      messages = [...conversationHistory];
    }
    
    // 현재 요청에 따른 메시지 추가
    if (conversationType === 'greeting') {
      messages.push({
        role: 'user',
        content: '첫 변환이 완료되었습니다. 인사해주세요.'
      });
    } else if (conversationType === 'feedback') {
      if (!userMessage) {
        return res.status(400).json({ error: 'userMessage is required for feedback type' });
      }
      messages.push({
        role: 'user',
        content: `사용자 수정 요청: "${userMessage}"\n\n반드시 JSON 형식으로만 응답하세요.`
      });
    } else if (conversationType === 'result') {
      messages.push({
        role: 'user',
        content: '재변환이 완료되었습니다. 결과를 전달해주세요.'
      });
    }

    // Claude API 호출
    const response = await callClaudeHaiku(messages, systemPrompt);
    
    // 디버그: Haiku 원본 응답
    console.log('=== Haiku Raw Response ===');
    console.log(response);
    
    // 응답 파싱
    let result;
    
    if (conversationType === 'feedback') {
      // JSON 응답 파싱
      try {
        // JSON 블록 추출 시도
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Raw response:', response);
        
        // 파싱 실패 시 기본 응답
        result = {
          masterResponse: response,
          correctionPrompt: ''
        };
      }
    } else {
      // greeting, result는 텍스트 응답
      result = {
        masterResponse: response,
        correctionPrompt: null
      };
    }

    // 성공 응답
    return res.status(200).json({
      success: true,
      masterName: masterName,
      masterNameKo: MASTER_PERSONAS[masterName].nameKo,
      conversationType: conversationType,
      ...result
    });

  } catch (error) {
    console.error('Master feedback API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
