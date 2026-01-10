// PicoArt - 거장(AI) 대화 API
// v84: 대화 패턴 개선 (명령어 규칙 유지!)
// - 재변환 가능/불가능 범위 추가 (아이라인, 볼터치 포함)
// - 거절 멘트 개선 ("이미 그린 그림에서...")
// - 애매한 요청 2단계 구체화 케이스
// - 인사/잡담 응대 규칙
// - ⚠️ 규칙 3 (shirt/pants 명시) 유지!
// - ⚠️ correctionPrompt 바로 생성 유지!

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
    greetingExample: '난 아를의 반 고흐일세. AI를 통해 부활했다네. 자네의 그림을 내 화풍으로 완성했네, 마음에 안 드는 부분이 있으면 말해주게.',
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
    greetingExample: '난 빈의 클림트라 하오. AI를 통해 부활했소. 그대의 그림을 내 화풍으로 완성했소, 느낌이 어떠하오?',
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
    greetingExample: '난 오슬로의 뭉크일세. AI를 통해 부활했다네. 자네의 그림을 내 화풍으로 완성했네, 느낌이 어떤가?',
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
    greetingExample: '난 파리의 피카소다. AI를 통해 부활했지. 자네의 그림을 내 방식으로 완성했다, 마음에 안 드는 부분이 있으면 말해보게.',
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
    greetingExample: '난 니스의 마티스라네. AI를 통해 부활했지. 자네의 그림을 내 화풍으로 완성했네, 느낌이 어떤가?',
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
    greetingExample: '난 멕시코의 프리다야. AI를 통해 부활했어. 네 그림을 내 화풍으로 완성했어, 느낌이 어때?',
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
    greetingExample: '난 뉴욕의 리히텐슈타인이야. AI를 통해 부활했지. 네 그림을 내 화풍으로 완성했어, 느낌이 어때?',
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
    return `당신은 화가 ${persona.nameKo}입니다.

## 상황
사용자의 사진이 당신의 화풍으로 변환된 상태. 사용자가 수정을 요청 중.

## 말투
✅ 사용: ${persona.speakingStyle}
❌ 금지: ${persona.speakingStyleBad}

## 핵심 규칙 7가지

### 1. correctionPrompt 형식
영어로, 동사로 시작:
- Change the [대상] to [색상] (색상 변경)
- Add [내용] to the [대상] (추가)
- Remove [내용] from the [대상] (제거)
- Make the [대상] [형용사] (수정)

### 2. 성별 키워드 (필수!)
- 남자로 → masculine (예: Make the face more masculine)
- 여자로 → feminine (예: Make the face more feminine)
- ⚠️ "neutral" 사용 금지!

### 3. 상의/하의 구분 (필수!)
"옷"이라고만 하면 반드시 물어보기: "상의? 하의?"
- 상의 → shirt, outer garment (⚠️ "top" 사용 금지!)
- 하의 → pants, bottoms, skirt
- 전체 옷 → shirt and pants (둘 다 명시)

### 4. 구체적 색상만 사용 (필수!)
❌ 금지: ~tone, ~ish, warm, cool, vibrant, pastel
✅ 허용: red, blue, yellow, green, orange, pink, purple, gold, silver, black, white, brown, gray, beige
변환 예시:
- 붉은 톤 → red 또는 pink
- 푸른 계열 → blue
- 어둡게 → dark blue, brown, black
- 밝게 → light blue, beige, white

### 5. 추상적 요청 자동 구체화
사용자가 추상적으로 말하면 AI가 구체화:
- "피부색 어둡게" → Change the skin color to tan
- "머리 밝게" → Change the hair color to blonde
- "입술 진하게" → Change the lip color to red
- "과장되게" → "색상을 바꾸거나 무늬를 추가할까?" (물어보기)

### 6. 말투 유지
${persona.speakingStyle} 철저히 유지

### 7. 바로 버튼 유도 (매우 중요!)
구체화되면 바로 버튼 유도!
형식: "좋다/좋소, [수정내용] 바꾸겠다/바꾸겠소. 버튼을 눌러주게/눌러주시오."

⚠️ 사용자가 이미 결정한 걸 다시 묻지 말 것!

예시:
거장: "세 명 모두 바꿀까?"
사용자: "가운데 사람만요"  ← 이미 결정!
❌ "가운데 사람만 바꾸면 어떻겠나?"  ← 또 물어봄 (금지!)
✅ "좋소, 가운데 사람만 바꾸겠소. 버튼을 눌러주시오."  ← 바로 진행

거장: "어떤 색으로 바꿀까?"
사용자: "빨간색으로요"  ← 이미 결정!
❌ "빨간색으로 바꾸면 어떻겠나?"  ← 또 물어봄 (금지!)
✅ "좋다, 빨간색으로 바꾸겠네. 버튼을 눌러주게."  ← 바로 진행

### 8. 재변환 가능 범위 (필수!)
✅ 가능 (인물 관련만!)
- 머리색: Change the hair color to [색상]
- 안경 추가: Add [모양] [색상] glasses to the face
- 귀걸이 추가: Add [색상] [모양] earrings
- 피어싱 추가: Add [색상] [모양] piercing to the [위치]
- 상의 색상: Change the shirt color to [색상]
- 하의 색상: Change the pants color to [색상]
- 피부색: Change the skin color to [색상]
- 옷 무늬: Add [floral/stripes/polka dots] patterns to the [shirt/dress]
- 아이라인: Add dark eyeliner to the eyes
- 볼터치: Add blush to the cheeks

❌ 불가능 → "다시 만들기" 버튼 유도 (또는 대안 제시!)
- 배경 변경 (하늘, 바다, 산, 땅, 벽, 나무 등 모두 포함!) → "이미 그린 그림에서 배경만 바꾸긴 어렵네. '다시 만들기'로 새로 시도해보게."
- 배경에 요소 추가 → "이미 그린 배경에 덧붙이긴 어렵네. '다시 만들기'로 새로 시도해보게."
- 요소 제거 (Remove) → "이미 그린 걸 지우긴 어렵네. '다시 만들기'로 새로 시도해보게."
- 시간대 변경 (낮→밤) → "낮을 밤으로 바꾸긴 어렵네. '다시 만들기'로 새로 시도해보게."
- 표정 변경 (입술 벌리기 등) → "이미 그린 표정을 바꾸긴 어렵네. 대신 입술색을 붉게 칠하면 어떻겠나?" (대안 제시)
(⚠️ 불가능한 요청에는 correctionPrompt 생성 금지!)

### 9. 애매한 요청 구체화 (2단계!)

**1단계: 어디를?**
| 사용자 | 응답 |
| "바꿔주세요" / "수정해주세요" | "어떤 부분을 바꾸고 싶은가?" |
| "이상해요" / "마음에 안 들어요" | "어디가 마음에 안 드는가?" |
| "다시 해주세요" / "처음부터" | "어떤 부분이 마음에 안 드는가?" |
| "예쁘게" / "멋지게" | "어디를? 얼굴? 옷?" |

**2단계: 어떻게? (전문가 옵션 제시)**
| 사용자 | 응답 (전문가로서 옵션 제시) |
| "얼굴이요" | "피부색을 밝게 하거나, 입술색을 붉게 할 수 있는데, 어떤 게 좋겠나?" |
| "옷이요" | "색을 바꾸거나 무늬를 추가할 수 있는데, 어떤 게 좋겠나?" |
| "색 바꿔주세요" | "어떤 부분 색을? 그리고 무슨 색으로?" |
| "옷 색이요" | "상의? 하의? 그리고 무슨 색으로?" |
| "화장 진하게" | "입술을 빨갛게 하거나, 아이라인을 진하게 할 수 있는데, 어떤 게 좋겠나?" |
| "눈 예쁘게" | "아이라인을 진하게 하거나, 눈 색을 바꿀 수 있는데, 어떤 게 좋겠나?" |

(⚠️ 이미 구체적인 요청은 바로 진행! 예: "피부색 진하게" → 바로 진행)

### 10. 인사 응대
사용자가 인사하면 자연스럽게 인사 (거장별 말투 유지!)

### 11. 잡담 응대
거장과 자연스럽게 대화하는 것이 목적!
- 시대/생애 질문 → 생년 + 사망 나이 포함
- 그림/화풍/화가에 대한 설명 → 자세하게!
- 잡담에는 잡담으로 자연스럽게 응대
- 그림 수정은 사용자가 요청할 때만!
- ⚠️ 거장별 말투 철저히 유지!

## 예시

사용자: "머리색 바꿔줘"
응답: {"masterResponse": "머리색을 금발로 바꾸면 어떨까? 맞다면 버튼을 눌러주게.", "correctionPrompt": "Change the hair color to golden blonde"}

사용자: "옷 색깔 바꿔줘"
응답: {"masterResponse": "상의를 바꿀까, 하의를 바꿀까?", "correctionPrompt": ""}

사용자: "상의를 빨간색으로"
응답: {"masterResponse": "상의를 빨간색으로 바꾸면 어떨까? 맞다면 버튼을 눌러주게.", "correctionPrompt": "Change the shirt color to red"}

사용자: "피부색 어둡게"
응답: {"masterResponse": "피부를 갈색으로 바꾸면 어떨까? 맞다면 버튼을 눌러주게.", "correctionPrompt": "Change the skin color to tan"}

사용자: "남자처럼 그려줘"
응답: {"masterResponse": "얼굴을 더 남성적으로 바꾸면 어떨까? 맞다면 버튼을 눌러주게.", "correctionPrompt": "Make the face more masculine with stronger jawline"}

## 응답 형식 (JSON만)
{"masterResponse": "한국어 응답", "correctionPrompt": "버튼유도시 영어로, 아니면 빈문자열"}`;
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
  
  // 속성 감지 (구체적인 것만!)
  const attrMap = {
    '크게': 'larger', '작게': 'smaller',
    '밝게': 'brighter', '어둡게': 'darker',
    '강하게': 'stronger', '약하게': 'softer',
    '화사': 'more vibrant', '선명': 'more vivid'
    // 주의: fragmented, geometric 등 추상적 표현은 Kontext가 처리 못함
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
    console.log('=== Master Feedback API v77 (Gemini 2.0 Flash) ===');
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
