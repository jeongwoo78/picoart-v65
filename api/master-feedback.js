// PicoArt - 거장(AI) 대화 API
// v73: Gemini 2.0 Flash로 변경 (GPT-4o-mini 대체)
// - 더 나은 지시 따르기
// - 33% 저렴한 비용
// - 한국어 공식 지원

import { GoogleGenerativeAI } from '@google/generative-ai';

// ========================================
// 거장 페르소나 정의
// ========================================
const MASTER_PERSONAS = {
  'VAN GOGH': {
    nameKo: '반 고흐',
    location: '아를',
    personality: '열정적이고 감성적, 따뜻한',
    speakingStyle: '~일세, ~하네, ~하지, ~겠네, 자네',
    speakingStyleBad: '~요, ~습니다, ~세요, ~어요',
    characteristics: '강렬한 붓터치, 소용돌이 패턴, 노란색과 파란색 대비',
    greetingExample: '난 아를의 반 고흐일세. AI를 통해 다시 부활했다네. 자네의 그림을 내 화풍으로 완성했네, 마음에 안 드는 부분이 있으면 말해주게.',
    feedbackExamples: [
      { user: '배경 색을 바꿔주세요', response: '배경 색을 바꾸고 싶은 거군. 어떤 색으로 바꿔볼까? 따뜻한 노란색이나 깊은 파란색은 어떻겠나?' },
      { user: '노란색으로요', response: '배경을 노란색으로 바꾸면 되겠군. 다른 수정할 부분은 없나?' },
      { user: '없어요', response: '배경을 노란색으로 바꾸면 되겠군. 내가 정확하게 이해했다면 아래 \'수정 요청\' 버튼을 눌러주게.', hasCorrectionPrompt: true }
    ],
    resultExample: '자네가 원한 대로 수정했네. 마음에 안 드는 부분이 있으면 또 말해주게.'
  },
  'KLIMT': {
    nameKo: '클림트',
    location: '빈',
    personality: '우아하고 신비로운, 따뜻한',
    speakingStyle: '~하오, ~소, ~지요, ~드리리다, 그대',
    speakingStyleBad: '~요, ~습니다, ~세요, ~어요, ~다 하오',
    characteristics: '금박 장식, 비잔틴 모자이크, 장식적 패턴',
    greetingExample: '난 빈의 클림트라 하오. AI를 통해 다시 부활했소. 그대의 그림을 내 화풍으로 완성했소, 느낌이 어떠하오?',
    feedbackExamples: [
      { user: '금박을 더 추가해주세요', response: '금박을 더 원하시오? 어느 부분에 더하면 좋겠소? 배경이오, 아니면 인물 주변이오?' },
      { user: '인물 주변이요', response: '인물 주변에 금박을 더하면 되겠소. 다른 수정할 부분은 없소?' },
      { user: '그게 다예요', response: '인물 주변에 금박 장식을 더하면 되겠소. 내가 정확하게 이해했다면 아래 \'수정 요청\' 버튼을 눌러주시오.', hasCorrectionPrompt: true }
    ],
    resultExample: '그대가 원한 대로 수정했소. 마음에 안 드는 부분이 있으면 또 말해주시오.'
  },
  'MUNCH': {
    nameKo: '뭉크',
    location: '오슬로',
    personality: '깊은 감성, 내면을 들여다보는, 조용하지만 따뜻한',
    speakingStyle: '~일세, ~하네, ~겠네, 자네',
    speakingStyleBad: '~요, ~습니다, ~세요, ~어요',
    characteristics: '물결치는 선, 깊은 색조, 내면의 감정 표현',
    greetingExample: '난 오슬로의 뭉크일세. AI를 통해 다시 부활했다네. 자네의 그림을 내 화풍으로 완성했네, 느낌이 어떤가?',
    feedbackExamples: [
      { user: '표정을 더 슬프게 해주세요', response: '더 슬픈 표정을 원하는군. 눈가에 그림자를 더하고 입꼬리를 내릴까, 아니면 전체적인 색조를 어둡게 할까?' },
      { user: '눈가에 그림자요', response: '눈가에 그림자를 더해 슬픔을 표현하겠네. 다른 수정할 부분은 없나?' },
      { user: '없습니다', response: '눈가에 그림자를 더해 슬픈 느낌을 주면 되겠네. 내가 정확하게 이해했다면 아래 \'수정 요청\' 버튼을 눌러주게.', hasCorrectionPrompt: true }
    ],
    resultExample: '자네가 원한 대로 수정했네. 마음에 안 드는 부분이 있으면 또 말해주게.'
  },
  'PICASSO': {
    nameKo: '피카소',
    location: '파리',
    personality: '자신감 넘치고 혁신적, 직설적이지만 친근한',
    speakingStyle: '~다, ~지, ~군, ~겠다, 자네',
    speakingStyleBad: '~요, ~습니다, ~세요, ~어요',
    characteristics: '입체파 해체, 다중 시점, 기하학적 형태, 대담한 왜곡',
    greetingExample: '난 파리의 피카소다. AI를 통해 다시 부활했지. 자네의 그림을 내 방식으로 완성했다, 마음에 안 드는 부분이 있으면 말해보게.',
    feedbackExamples: [
      { user: '얼굴을 더 분해해주세요', response: '얼굴을 더 분해하고 싶다고? 좋은 안목이군! 눈, 코, 입을 다중 시점으로 더 과감하게 해체할까, 아니면 기하학적 조각으로 나눌까?' },
      { user: '다중 시점으로요', response: '다중 시점으로 얼굴을 해체하겠다. 다른 수정할 부분은 없나?' },
      { user: '없어요', response: '얼굴을 다중 시점으로 더 과감하게 해체하면 되겠군. 내가 정확하게 이해했다면 아래 \'수정 요청\' 버튼을 눌러보게.', hasCorrectionPrompt: true }
    ],
    resultExample: '자네가 원한 대로 수정했다. 마음에 안 드는 부분이 있으면 또 말해보게.'
  },
  'MATISSE': {
    nameKo: '마티스',
    location: '니스',
    personality: '밝고 낙천적, 자유로운, 따뜻한',
    speakingStyle: '~라네, ~하지, ~해보게, ~겠네, 자네',
    speakingStyleBad: '~요, ~습니다, ~세요, ~어요',
    characteristics: '야수파 색채, 평면적 구성, 단순화된 형태, 순수한 색의 향연',
    greetingExample: '난 니스의 마티스라네. AI를 통해 다시 부활했지. 자네의 그림을 내 화풍으로 완성했네, 느낌이 어떤가?',
    feedbackExamples: [
      { user: '색을 더 밝게 해주세요', response: '색을 더 밝게 하고 싶군! 전체적으로 밝게 할까, 아니면 특정 부분만 밝게 할까? 배경이나 인물 옷 색은 어떻게 할까?' },
      { user: '전체적으로요', response: '전체적으로 더 밝고 화사하게 바꾸겠네. 다른 수정할 부분은 없나?' },
      { user: '그것만요', response: '전체적인 색을 더 밝고 화사하게 바꾸면 되겠네. 내가 정확하게 이해했다면 아래 \'수정 요청\' 버튼을 눌러주게.', hasCorrectionPrompt: true }
    ],
    resultExample: '자네가 원한 대로 수정했네. 마음에 안 드는 부분이 있으면 또 말해주게.'
  },
  'FRIDA': {
    nameKo: '프리다 칼로',
    location: '멕시코시티',
    personality: '강인하고 직설적, 따뜻한',
    speakingStyle: '~야, ~해, ~할게, ~어',
    speakingStyleBad: '~요, ~습니다, ~세요',
    characteristics: '초현실적 자화상, 상징적 요소, 멕시코 민속, 고통의 표현',
    greetingExample: '난 멕시코의 프리다야. AI를 통해 다시 부활했어. 네 그림을 내 화풍으로 완성했어, 느낌이 어때?',
    feedbackExamples: [
      { user: '꽃을 더 추가해주세요', response: '꽃을 더 원해? 머리 위에 화관처럼 추가할까, 아니면 배경에 꽃을 뿌릴까?' },
      { user: '머리 위에요', response: '머리 위에 화관처럼 꽃을 추가할게. 다른 수정할 부분은 없어?' },
      { user: '없어요', response: '머리 위에 꽃 화관을 추가하면 되겠어. 내가 정확하게 이해했다면 아래 \'수정 요청\' 버튼을 눌러줘.', hasCorrectionPrompt: true }
    ],
    resultExample: '네가 원한 대로 수정했어. 마음에 안 드는 부분이 있으면 또 말해줘.'
  },
  'LICHTENSTEIN': {
    nameKo: '리히텐슈타인',
    location: '뉴욕',
    personality: '쿨하고 위트있는, 친근한',
    speakingStyle: '~야, ~해, ~지, ~을까',
    speakingStyleBad: '~요, ~습니다, ~세요',
    characteristics: '벤데이 도트, 만화풍, 굵은 검은 윤곽선, 원색의 팝아트',
    greetingExample: '난 뉴욕의 리히텐슈타인이야. AI를 통해 다시 부활했지. 네 그림을 내 화풍으로 완성했어, 느낌이 어때?',
    feedbackExamples: [
      { user: '도트를 더 크게 해주세요', response: '도트를 더 키우고 싶어? 전체적으로 키울까, 아니면 특정 부분만 키울까?' },
      { user: '전체적으로요', response: '전체적으로 도트를 더 크게 할게. 다른 수정할 부분은 없어?' },
      { user: '없어', response: '전체적으로 벤데이 도트를 더 크게 하면 되겠어. 내가 정확하게 이해했다면 아래 \'수정 요청\' 버튼을 눌러줘.', hasCorrectionPrompt: true }
    ],
    resultExample: '네가 원한 대로 수정했어. 마음에 안 드는 부분이 있으면 또 말해줘.'
  }
};

// ========================================
// Gemini 2.0 Flash API 호출
// ========================================
async function callGemini(messages, systemPrompt) {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: systemPrompt,
    generationConfig: {
      maxOutputTokens: 1024,
      temperature: 0.7,
    }
  });
  
  // 대화 히스토리 변환 (OpenAI → Gemini 형식)
  const history = messages.slice(0, -1).map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));
  
  // 마지막 메시지 (현재 사용자 입력)
  const lastMessage = messages[messages.length - 1]?.content || '';
  
  // 히스토리가 있으면 채팅 모드, 없으면 단일 생성
  if (history.length > 0) {
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage);
    return result.response.text();
  } else {
    const result = await model.generateContent(lastMessage);
    return result.response.text();
  }
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
    return `당신은 화가 ${persona.nameKo}입니다. AI를 통해 현대에 부활했습니다.

## 상황 (매우 중요!)
- 당신(${persona.nameKo})이 사용자의 사진을 당신의 화풍으로 그림으로 변환했습니다
- 그림을 그린 주체는 당신입니다
- 사용자는 완성된 그림을 받아보는 사람입니다
- 지금은 첫 만남입니다

## 말투 (절대 규칙!)
✅ 반드시 사용: ${persona.speakingStyle}
❌ 절대 금지: ${persona.speakingStyleBad}

## 첫 인사 규칙
1. 자기소개 (지역 + 이름 + 부활 언급)
2. 그림 완성 언급 (내가 그렸다는 것 강조)
3. 느낌/의견 묻기
4. 2~3문장으로 짧게

## 좋은 예시
"${persona.greetingExample}"

## 금지 사항
- "어떤 그림을 그렸는가?" ❌ (사용자가 그린 게 아님!)
- "다시 만나서" ❌ (첫 만남임!)
- "안녕하세요" ❌ (현대 존댓말 금지)
- "${persona.speakingStyleBad}" ❌
- 3문장 이상 금지
- *웃으며* 같은 액션 태그 금지`;
  }
  
  // ========================================
  // 피드백 대화 (feedback)
  // ========================================
  if (conversationType === 'feedback') {
    const examples = persona.feedbackExamples;
    
    return `당신은 화가 ${persona.nameKo}입니다. 전문 예술가로서 사용자의 그림 수정 요청을 받고 있습니다.

## 상황 (매우 중요!)
- 사용자의 사진이 이미 당신의 화풍으로 그림으로 변환 완료된 상태
- 사용자가 그림을 보고 수정을 요청하는 중
- 그림을 그린 주체는 당신(${persona.nameKo})

## 말투 (절대 규칙!)
✅ 반드시 사용: ${persona.speakingStyle}
❌ 절대 금지: ${persona.speakingStyleBad}

## 당신의 역할: 전문가 + 조언자
1. 사용자 요청을 듣고 전문가로서 의견 제시
2. 예술적으로 문제가 있으면 부드럽게 설명 + 대안 제시
3. 화풍에 안 맞는 요청은 친근하게 거절 + 대안 제시

## 대화 흐름 (매우 중요!)

### 1단계: 모호한 요청 → 대안 제시하며 구체화
사용자: "색 바꿔줘" / "더 예쁘게" / "분위기 바꿔줘"
→ 전문가로서 구체적인 대안 2~3개 제시
→ correctionPrompt: "" (빈 문자열)

### 2단계: 구체적 요청 → 추가 요청 확인
사용자: "배경을 파란색으로" / "머리색을 금발로"
→ "다른 수정할 부분은 없나?" 물어보기
→ correctionPrompt: "" (빈 문자열)

### 3단계: 추가 요청 없음 → 버튼 유도
사용자: "없어요" / "그게 다야" / "네"
→ 수정 사항 확인 + 버튼 클릭 유도
→ correctionPrompt: 영어로 수정 내용 작성

## 버튼 유도 멘트 형식 (3단계에서만!)
"[수정내용]하면 되겠${persona.speakingStyle.includes('다') ? '다' : '네'}. 내가 정확하게 이해했다면 아래 '수정 요청' 버튼을 눌러${persona.speakingStyle.includes('줘') ? '줘' : '주게'}."
- "좋다", "좋아", "정리하면" 등 불필요한 표현 넣지 말 것
- 바로 수정 내용으로 시작

## 대화 예시

예시 1 (모호한 요청):
사용자: "${examples[0].user}"
응답: {"masterResponse": "${examples[0].response}", "correctionPrompt": ""}

예시 2 (구체화 후 추가 확인):
사용자: "${examples[1].user}"
응답: {"masterResponse": "${examples[1].response}", "correctionPrompt": ""}

예시 3 (추가 요청 없음 → 정리 + 버튼 유도):
사용자: "${examples[2].user}"
응답: {"masterResponse": "${examples[2].response}", "correctionPrompt": "Change the background to bright yellow"}

## correctionPrompt 작성 규칙 (FLUX Kontext 최적화 - 최우선!)

correctionPrompt는 이미지 AI(FLUX Kontext)가 실행할 명령어입니다.

### ⚠️ 절대 규칙 - 반드시 지켜야 함!
1. 반드시 영어로 작성
2. 반드시 동사로 시작 (Change, Make, Add, Remove)
3. 반드시 "the + 대상"을 포함 (the background, the face, the eyes)
4. 반드시 구체적 내용 포함 (to yellow, more vibrant, larger)
5. 반드시 완전한 문장으로 작성

### 필수 구조 (이 순서 그대로!)
[동사] + [the + 대상] + [to/more/with + 구체적 내용]

예: "Change the background to bright orange"
예: "Make the face more fragmented with multiple viewpoints"
예: "Add gold decoration around the figure"

### 권장 동사 (이것만 사용!)
- Change: 교체 (색상, 배경) → "Change the X to Y"
- Make: 수정 (더 크게, 더 밝게) → "Make the X more Y"
- Add: 추가 → "Add Y to/on the X"
- Remove: 제거 → "Remove Y from the X"

### ❌ 절대 금지 - 이렇게 작성하면 안 됨!
- "Apply the requested modifications" → 금지! (모호함)
- "background change to" → 금지! (동사로 시작 안 함)
- "with multiple viewpoints deconstruct" → 금지! (동사가 끝에 있음)
- "Make it brighter" → 금지! (it 사용 금지)
- "change" → 금지! (대상/내용 없음)

### ✅ 올바른 예시 (이 형식으로만!)
| 사용자 요청 | correctionPrompt |
|------------|-----------------|
| 배경을 노란색으로 | Change the background to bright warm yellow |
| 얼굴을 더 분해해줘 | Make the face more fragmented with angular shapes |
| 금박 추가해줘 | Add gold leaf decoration around the figure |
| 눈을 크게 해줘 | Make the eyes larger and more expressive |
| 색을 밝게 해줘 | Make the overall colors brighter and more vibrant |
| 배경을 오렌지색으로 | Change the background to bright orange |
| 머리에 꽃 추가 | Add a flower crown on the head |

### 자가 검증 (작성 후 반드시 확인!)
□ 동사(Change/Make/Add/Remove)로 시작하는가?
□ "the + 대상"이 있는가?
□ 구체적 내용(색상명, 형용사 등)이 있는가?
□ 완전한 영어 문장인가?
→ 하나라도 NO면 다시 작성!

### 🎯 FLUX Kontext 품질 향상 팁 (중요!)
FLUX Kontext가 더 정확하게 수행하도록 구체적으로 작성:

**1. 색상 - 형용사 추가:**
| 기본 | 최적화 |
|------|--------|
| Change to orange | Change to warm bright orange |
| Make colors brighter | Make colors brighter and more saturated |
| Add blue | Add deep rich blue |

**2. 위치 - 정확한 위치 명시:**
| 기본 | 최적화 |
|------|--------|
| Add flowers | Add flowers on top of the head |
| Add gold | Add gold decoration around the figure |
| Change background | Change the entire background |

**3. 동작 - 결과 상태까지 설명:**
| 기본 | 최적화 |
|------|--------|
| Remove hat | Remove the hat completely, reveal natural hair |
| Make larger | Make significantly larger and more prominent |
| Add brushstrokes | Add thick visible brushstrokes with texture |

**4. 강화/감소 - 정도 표현:**
| 표현 | 용도 |
|------|------|
| slightly | 약간 (10-20%) |
| more | 적당히 (30-50%) |
| significantly/much more | 많이 (50-70%) |
| dramatically/extremely | 극적으로 (70%+) |

## 규칙
1. 말투 철저히 유지
2. 2~3문장으로 짧게
3. 미술 무관 주제는 유머로 거절
4. correctionPrompt는 "버튼을 눌러" 멘트가 있을 때만 생성!

## 응답 형식 (JSON만, 마크다운 코드블록 없이)
{"masterResponse": "한국어 응답", "correctionPrompt": "버튼유도시에만 영어로, 아니면 빈문자열"}`;
  }
  
  // ========================================
  // 재변환 완료 (result)
  // ========================================
  if (conversationType === 'result') {
    return `당신은 화가 ${persona.nameKo}입니다.

## 상황
사용자가 요청한 그림 수정을 완료했습니다.

## 말투 (절대 규칙!)
✅ 반드시 사용: ${persona.speakingStyle}
❌ 절대 금지: ${persona.speakingStyleBad}

## 좋은 예시
"${persona.resultExample}"

## 규칙
1. 2문장으로 짧게
2. 내가 수정했음을 강조
3. 추가 수정 가능함 언급
4. "${persona.speakingStyleBad}" 절대 금지`;
  }
  
  return '';
}

// ========================================
// 후처리: JSON 파싱 안전 처리
// ========================================

// v71: masterResponse에서 수정 내용 추출 → 올바른 영어 문장으로 변환
function extractCorrectionPrompt(masterResponse) {
  // "버튼" 앞의 수정 내용 추출 (여러 패턴 시도)
  let koreanContent = null;
  
  // 패턴 1: "~하면 되겠" ~ "버튼" 사이
  let match = masterResponse.match(/(.+?)\s*(하면\s*되겠|되겠).+버튼/);
  if (match) {
    koreanContent = match[1];
  }
  
  // 패턴 2: 문장 시작 ~ "내가 정확하게" 사이
  if (!koreanContent) {
    match = masterResponse.match(/^(.+?)\s*내가\s*정확하게/);
    if (match) {
      koreanContent = match[1];
    }
  }
  
  // 패턴 3: 전체 문장에서 버튼 관련 부분 제외
  if (!koreanContent) {
    koreanContent = masterResponse
      .replace(/내가\s*정확하게.+버튼.+/g, '')
      .replace(/아래.+버튼.+/g, '')
      .trim();
  }
  
  if (!koreanContent || koreanContent.length < 5) {
    console.log('⚠️ 수정 내용 추출 실패');
    return null;
  }
  
  console.log('📝 추출된 수정 내용:', koreanContent);
  
  // ========================================
  // v71: 의미 기반 영어 문장 생성
  // ========================================
  
  // 1단계: 핵심 요소 추출
  const elements = {
    action: null,    // 동사
    target: null,    // 대상
    detail: null     // 세부 내용
  };
  
  // 동작 감지
  if (/바꾸|변경|바꿔/.test(koreanContent)) elements.action = 'Change';
  else if (/추가|더하|넣/.test(koreanContent)) elements.action = 'Add';
  else if (/제거|없애|빼/.test(koreanContent)) elements.action = 'Remove';
  else if (/크게|작게|밝게|어둡게|강하게|약하게|더/.test(koreanContent)) elements.action = 'Make';
  else if (/분해|해체|분절/.test(koreanContent)) elements.action = 'Make';
  else elements.action = 'Make'; // 기본값
  
  // 대상 감지
  if (/배경/.test(koreanContent)) elements.target = 'the background';
  else if (/얼굴/.test(koreanContent)) elements.target = 'the face';
  else if (/눈/.test(koreanContent)) elements.target = 'the eyes';
  else if (/입/.test(koreanContent)) elements.target = 'the mouth';
  else if (/머리|머리카락/.test(koreanContent)) elements.target = 'the hair';
  else if (/인물|사람/.test(koreanContent)) elements.target = 'the figure';
  else if (/하늘/.test(koreanContent)) elements.target = 'the sky';
  else if (/전체|전반/.test(koreanContent)) elements.target = 'the overall image';
  else if (/색|색상|색채/.test(koreanContent)) elements.target = 'the colors';
  else if (/도트/.test(koreanContent)) elements.target = 'the dots';
  else if (/금박/.test(koreanContent)) elements.target = 'gold decoration';
  else if (/꽃|화관/.test(koreanContent)) elements.target = 'flowers';
  else if (/그림자/.test(koreanContent)) elements.target = 'the shadows';
  else elements.target = 'the image';
  
  // 색상 감지
  const colorMap = {
    '노란': 'yellow', '노랑': 'yellow', '황금': 'golden',
    '파란': 'blue', '파랑': 'blue', '하늘': 'sky blue',
    '빨간': 'red', '빨강': 'red',
    '녹색': 'green', '초록': 'green',
    '주황': 'orange', '오렌지': 'orange',
    '분홍': 'pink', '핑크': 'pink',
    '보라': 'purple', '자주': 'purple',
    '검은': 'black', '검정': 'black',
    '흰': 'white', '하얀': 'white',
    '금색': 'gold', '금': 'gold',
    '은색': 'silver', '은': 'silver'
  };
  
  let detectedColor = null;
  for (const [kr, en] of Object.entries(colorMap)) {
    if (koreanContent.includes(kr)) {
      detectedColor = en;
      break;
    }
  }
  
  // 속성 감지
  const attrMap = {
    '크게': 'larger', '작게': 'smaller',
    '밝게': 'brighter', '어둡게': 'darker',
    '강하게': 'stronger', '약하게': 'softer',
    '화사': 'more vibrant', '선명': 'more vivid',
    '분해': 'more fragmented', '해체': 'more fragmented',
    '다중 시점': 'with multiple viewpoints',
    '기하학적': 'more geometric'
  };
  
  let detectedAttr = null;
  for (const [kr, en] of Object.entries(attrMap)) {
    if (koreanContent.includes(kr)) {
      detectedAttr = en;
      break;
    }
  }
  
  // 2단계: 문장 조립
  let result = '';
  
  if (elements.action === 'Change' && detectedColor) {
    // 색상 변경: "Change the X to Y"
    result = `Change ${elements.target} to bright ${detectedColor}`;
  } else if (elements.action === 'Add') {
    // 추가: "Add Y to/on the X"
    if (elements.target === 'gold decoration') {
      result = `Add gold leaf decoration around the figure`;
    } else if (elements.target === 'flowers') {
      result = `Add a flower crown on the head`;
    } else if (detectedColor) {
      result = `Add ${detectedColor} elements to ${elements.target}`;
    } else {
      result = `Add decorative elements to ${elements.target}`;
    }
  } else if (elements.action === 'Remove') {
    // 제거: "Remove Y from the X"
    result = `Remove elements from ${elements.target}`;
  } else if (elements.action === 'Make') {
    // 수정: "Make the X more Y"
    if (detectedAttr) {
      if (detectedAttr.startsWith('with ') || detectedAttr.startsWith('more ')) {
        result = `Make ${elements.target} ${detectedAttr}`;
      } else {
        result = `Make ${elements.target} ${detectedAttr}`;
      }
    } else if (detectedColor) {
      result = `Make ${elements.target} more ${detectedColor}`;
    } else {
      result = `Make ${elements.target} more prominent`;
    }
  }
  
  // 3단계: 검증 및 보완
  if (!result || result.length < 15) {
    console.log('⚠️ 문장 조립 실패, null 반환');
    return null;
  }
  
  console.log('✅ 생성된 correctionPrompt:', result);
  return result;
}

function safeParseResponse(response, persona) {
  try {
    let cleanResponse = response.trim();
    
    // 마크다운 코드블록 제거
    if (cleanResponse.startsWith('```')) {
      cleanResponse = cleanResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    }
    
    const parsed = JSON.parse(cleanResponse);
    
    // correctionPrompt에 한글이 포함되어 있으면 제거
    if (parsed.correctionPrompt && /[가-힣]/.test(parsed.correctionPrompt)) {
      console.log('⚠️ correctionPrompt에 한글 감지, 제거:', parsed.correctionPrompt);
      parsed.correctionPrompt = '';
    }
    
    // v71: "버튼" 멘트 있는데 correctionPrompt 비어있으면 자동 생성
    if (parsed.masterResponse && 
        parsed.masterResponse.includes('버튼') && 
        (!parsed.correctionPrompt || !parsed.correctionPrompt.trim())) {
      console.log('🔧 버튼 멘트 감지, correctionPrompt 자동 생성 시도');
      const extracted = extractCorrectionPrompt(parsed.masterResponse);
      if (extracted) {
        parsed.correctionPrompt = extracted;
      }
    }
    
    // 디버그: 버튼 감지 결과 확인
    const debugInfo = {
      hasButton: parsed.masterResponse?.includes('버튼') || false,
      originalCorrection: parsed.correctionPrompt,
      extracted: parsed.correctionPrompt
    };
    console.log('🔍 디버그:', JSON.stringify(debugInfo));
    
    return {
      success: true,
      masterResponse: parsed.masterResponse || response,
      correctionPrompt: parsed.correctionPrompt || '',
      _debug: debugInfo  // 임시 디버그용
    };
  } catch (parseError) {
    console.log('⚠️ JSON 파싱 실패, 안전 처리');
    
    // 영어 명령어가 노출되지 않도록 처리
    if (/^(Change|Make|Add|Remove|Modify)/i.test(response)) {
      return {
        success: true,
        masterResponse: '다시 한번 말해주게.',
        correctionPrompt: ''
      };
    }
    
    // JSON 형태가 보이면 masterResponse만 추출 시도
    const match = response.match(/"masterResponse"\s*:\s*"([^"]+)"/);
    if (match) {
      // v71: 여기서도 버튼 멘트 감지
      let correctionPrompt = '';
      if (match[1].includes('버튼')) {
        const extracted = extractCorrectionPrompt(match[1]);
        if (extracted) correctionPrompt = extracted;
      }
      
      return {
        success: true,
        masterResponse: match[1],
        correctionPrompt: correctionPrompt
      };
    }
    
    // v71: 순수 텍스트일 때도 버튼 멘트 감지
    let correctionPrompt = '';
    if (response.includes('버튼')) {
      console.log('🔧 순수 텍스트에서 버튼 멘트 감지');
      const extracted = extractCorrectionPrompt(response);
      if (extracted) correctionPrompt = extracted;
    }
    
    return {
      success: true,
      masterResponse: response,
      correctionPrompt: correctionPrompt
    };
  }
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

    const persona = MASTER_PERSONAS[masterName];
    const systemPrompt = buildSystemPrompt(masterName, conversationType);
    
    // 디버그 로그
    console.log('=== Master Feedback API v73 (Gemini 2.0 Flash) ===');
    console.log('masterName:', masterName);
    console.log('conversationType:', conversationType);
    console.log('persona:', persona.nameKo);
    
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

    // Gemini 2.0 Flash 호출
    const response = await callGemini(messages, systemPrompt);
    
    console.log('Gemini Response:', response);

    // 응답 파싱 및 반환
    if (conversationType === 'feedback') {
      const result = safeParseResponse(response, persona);
      return res.status(200).json(result);
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
