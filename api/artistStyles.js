// ========================================
// 🎨 통합 화풍 프롬프트 (artistStyles.js) v68
// v68: 간소화 + FLUX 최적화
//     - "by [풀네임], [이름] art style" 패턴
//     - 강한 표현 (extreme, intense, explosive 등)
//     - 피사체 강조 (face, skin, clothing, entire subject)
//     - 금지는 단어 나열 (NOT xxx, NOT yyy)
//     - 서양화: NOT photograph, NOT digital 추가
// ========================================

// ========================================
// 🚻 성별 보존 규칙 (GENDER_RULE)
// ========================================
export const GENDER_RULE = 'If photo shows FEMALE - MUST have FEMININE face with SOFT features, female bone structure, NO masculine features, DO NOT masculinize, DO NOT make rough, KEEP AS WOMAN. PRESERVE ORIGINAL ETHNICITY AND SKIN COLOR EXACTLY - DO NOT change race, DO NOT lighten or darken skin, Asian must stay Asian, Caucasian must stay Caucasian, African must stay African. ';

// ========================================
// 🖌️ 유화 질감 강제 (PAINT_TEXTURE) - 샌드위치 끝
// ========================================
export const PAINT_TEXTURE = ' MUST look like HAND-PAINTED oil painting with VISIBLE THICK BRUSHSTROKES (20mm or thicker on subject), NOT photograph, NOT digital, NOT photorealistic, NOT smooth, NOT AI-generated photo.';

// ========================================
// 📚 모든 화가 화풍 프롬프트
// ========================================
export const ARTIST_STYLES = {
  
  // ========================================
  // 🏛️ 고대 (NOT photograph 이미 있거나 특수 질감)
  // ========================================
  'classical-sculpture': 'Ancient Greek-Roman marble sculpture style. Pure white Carrara marble with smooth polished surface, carved stone texture. NOT colored, NOT painting, NOT photograph, NOT digital.',
  
  'roman-mosaic': 'Roman floor mosaic style. Large visible tesserae tiles 50mm, thick black grout lines, earth tone palette. NOT painting, NOT smooth, NOT photograph, NOT digital.',

  // ========================================
  // ⛪ 중세 
  // ========================================
  'byzantine': 'Byzantine sacred icon style. Brilliant gold leaf background, flat frontal pose, large solemn eyes, rich jewel colors. NOT realistic, NOT 3D, NOT photograph, NOT digital.',
  
  'gothic': 'Gothic stained glass style. Bold black lead lines, luminous jewel-tone translucent colors, light streaming through. NOT painting, NOT realistic, NOT photograph, NOT digital.',
  
  'islamic-miniature': 'Persian miniature painting style. Exquisite intricate details, vibrant jewel colors, delicate fine brushwork. NOT Western style, NOT oil painting, NOT photograph, NOT digital.',

  // ========================================
  // 🎨 르네상스 
  // ========================================
  'botticelli': 'by Sandro Botticelli, Botticelli art style, elegant flowing lines, ethereal pale skin, graceful diaphanous fabrics billowing gently. NOT photograph, NOT digital.',
  
  'leonardo': 'by Leonardo da Vinci, da Vinci art style, extreme sfumato technique, soft hazy edges dissolving like smoke, mysterious atmospheric depth. NOT sharp lines, NOT bright colors, NOT photograph, NOT digital.',
  
  'titian': 'by Titian, Titian art style, warm glowing golden flesh, rich luminous Venetian colors, bold loose brushwork. NOT photograph, NOT digital.',
  
  'michelangelo': 'by Michelangelo, Michelangelo art style, powerful heroic muscular figures, dramatic foreshortening, monumental grandeur. NOT photograph, NOT digital.',
  
  'raphael': 'by Raphael, Raphael art style, perfect harmonious beauty, serene balanced composition, gentle graceful expressions. NOT photograph, NOT digital.',

  // ========================================
  // 🎭 바로크 
  // ========================================
  'caravaggio': 'by Caravaggio, Caravaggio art style, extreme tenebrism, intense spotlight from absolute black darkness, dramatic theatrical illumination. NOT photograph, NOT digital.',
  
  'rubens': 'by Peter Paul Rubens, Rubens art style, radiant luminous flesh, explosive swirling movement, rich passionate reds and golds. NOT photograph, NOT digital.',
  
  'rembrandt': 'by Rembrandt, Rembrandt art style, intense golden glow, deep mysterious shadows, thick impasto highlights. NOT photograph, NOT digital.',
  
  'velazquez': 'by Diego Velazquez, Velazquez art style, refined court elegance, masterful loose brushwork, subtle silver-grey palette. NOT photograph, NOT digital.',

  // ========================================
  // 🌸 로코코 
  // ========================================
  'watteau': 'by Antoine Watteau, Watteau art style, delicate feathery brushwork, soft dreamy pastoral scenes, romantic melancholic atmosphere. NOT photograph, NOT digital.',
  
  'boucher': 'by François Boucher, Boucher art style, soft rosy flesh tones, light pastel palette, playful decorative elegance. NOT photograph, NOT digital.',

  // ========================================
  // 🏛️ 신고전주의 
  // ========================================
  'david': 'by Jacques-Louis David, David art style, crisp clear outlines, heroic idealized figures, dramatic moral intensity. NOT photograph, NOT digital.',
  
  'ingres': 'by Jean-Auguste-Dominique Ingres, Ingres art style, smooth flowing contours, porcelain-smooth skin, elegant sinuous curves. NOT photograph, NOT digital.',

  // ========================================
  // 🌊 낭만주의 
  // ========================================
  'turner': 'by J.M.W. Turner, Turner art style, atmospheric sublime light, swirling mist dissolving forms, luminous golden glow. NOT photograph, NOT digital.',
  
  'delacroix': 'by Eugène Delacroix, Delacroix art style, passionate revolutionary energy, vivid intense colors, turbulent swirling movement. NOT photograph, NOT digital.',

  // ========================================
  // 🌾 사실주의 
  // ========================================
  'courbet': 'by Gustave Courbet, Courbet art style, raw unidealized realism, bold palette knife texture, dark earthy tones. NOT photograph, NOT digital.',
  
  'manet': 'by Édouard Manet, Manet art style, bold flat composition, striking light-dark contrast, loose confident brushwork. NOT photograph, NOT digital.',

  // ========================================
  // 🌅 인상주의 
  // ========================================
  'renoir': 'by Pierre-Auguste Renoir, Renoir art style, warm luminous glow, soft feathery brushstrokes, rosy pink flesh tones, dappled sunlight filtering through leaves. NOT photograph, NOT digital.',
  
  'monet': 'by Claude Monet, Monet art style, broken color brushstrokes, soft hazy atmospheric light, colors blending and dissolving. NOT photograph, NOT digital.',
  
  'degas': 'by Edgar Degas, Degas art style, unusual cropped angles, asymmetric composition, soft pastel chalky texture. NOT photograph, NOT digital.',
  
  'caillebotte': 'by Gustave Caillebotte, Caillebotte art style, dramatic converging perspective, muted grey-blue tones, wet pavement reflections. NOT photograph, NOT digital.',

  // ========================================
  // 🌻 후기인상주의 
  // ========================================
  'vangogh': 'by Vincent van Gogh, Van Gogh art style, swirling spiral brushstrokes on face skin clothing and entire subject, thick impasto texture throughout, intense cobalt blue and chrome yellow. NOT photograph, NOT digital.',
  
  'gauguin': 'by Paul Gauguin, Gauguin art style, bold black outlines, flat pure saturated colors, exotic tropical palette. NOT photograph, NOT digital.',
  
  'cezanne': 'by Paul Cézanne, Cézanne art style, geometric structural forms, visible constructive brushstrokes, muted earthy palette. NOT photograph, NOT digital.',
  
  'signac': 'by Paul Signac, Signac art style, pure color dots 8mm, vibrant optical color mixing, luminous Mediterranean light. NOT brushstrokes, NOT smooth, NOT photograph, NOT digital.',

  // ========================================
  // 🔥 야수파 
  // ========================================
  'matisse': 'by Henri Matisse, Matisse art style, bold flat pure colors, simplified expressive forms, vibrant emotional intensity. NOT photograph, NOT digital.',
  
  'derain': 'by André Derain, Derain art style, explosive vivid colors, bold rough brushstrokes, raw fauvist energy. NOT photograph, NOT digital.',
  
  'vlaminck': 'by Maurice de Vlaminck, Vlaminck art style, violent intense colors, thick aggressive brushwork, wild untamed energy. NOT photograph, NOT digital.',

  // ========================================
  // 😱 표현주의 
  // ========================================
  'munch': 'by Edvard Munch, Munch art style, extreme psychological emotion, wavy distorted swirling lines throughout entire image, blood red apocalyptic sky, intense anxiety and existential dread. NOT photograph, NOT digital.',
  
  'kirchner': 'by Ernst Ludwig Kirchner, Kirchner art style, sharp angular jagged forms, extreme bold clashing colors, elongated mask-like faces, raw primitive aggressive intensity. NOT photograph, NOT digital.',
  
  'kokoschka': 'by Oskar Kokoschka, Kokoschka art style, violent turbulent slashing brushwork, harsh acidic feverish colors, deeply distorted psychological tension. NOT photograph, NOT digital.',

  // ========================================
  // 🎪 모더니즘 
  // ========================================
  'picasso': 'by Pablo Picasso, Picasso Cubist art style, geometric fragmentation on face and entire body, face broken into angular planes, nose from side profile while both eyes visible from front, jaw chin cheeks shattered into geometric segments, multiple viewpoints simultaneously. NOT realistic face, NOT smooth, NOT normal face, NOT photograph, NOT digital.',
  
  'magritte': 'by René Magritte, Magritte Surrealist art style, philosophical visual paradox, mysterious object obscuring face, dreamlike impossible scenarios. NOT photograph, NOT digital.',
  
  'miro': 'by Joan Miró, Miró art style, playful biomorphic shapes, childlike symbols floating, primary colors on white background, spontaneous whimsical lines. NOT photograph, NOT digital.',
  
  'chagall': 'by Marc Chagall, Chagall art style, dreamy floating figures, soft pastel colors, nostalgic romantic atmosphere, poetic lyrical quality. NOT photograph, NOT digital.',
  
  'lichtenstein': 'by Roy Lichtenstein, COMIC BOOK POP ART style, LARGE VISIBLE Ben-Day dots pattern covering entire surface, EXTREMELY THICK BLACK OUTLINES 5mm+ surrounding ALL shapes and figures, FLAT primary colors ONLY (red blue yellow white black), halftone printing effect, comic book ink lines, NO gradients, NO realistic shading, NOT photograph, NOT soft.',
  
  'haring': 'by Keith Haring, Keith Haring art style, bold continuous black outlines, simplified dancing figures, radiant energy lines, flat bright colors. NOT photograph, NOT digital.',

  // ========================================
  // ⭐ 거장 전용 
  // ========================================
  'klimt': 'by Gustav Klimt, Klimt art style, ornate gold leaf patterns, intricate decorative mosaic, flat Byzantine-inspired figures, jewel-like embedded details, geometric robes with spirals and rectangles. NOT photograph, NOT digital.',
  
  'frida': 'by Frida Kahlo, Frida Kahlo art style, intense direct gaze, symbolic personal elements, vibrant Mexican folk colors, lush tropical foliage background, raw emotional honesty. NOT photograph, NOT digital.',

  // ========================================
  // 🎎 동양화 (현재 유지 - 이미 NO digital 등 포함)
  // ========================================
  'minhwa': 'Korean folk painting (Minhwa) style from late Joseon Dynasty. MINERAL PIGMENTS on AGED YELLOWED HANJI PAPER with visible paper texture. OLD FADED WEATHERED colors like antique painting 200+ years old. Muted earthy tones - faded ochre, dusty red, weathered green, pale greyish blue. ROUGH FOLK ART brush strokes with uneven pigment. Visible hanji paper texture throughout. Primitive naive quality. Museum artifact quality with aged patina. NO bright saturated colors, NO digital rendering, NO smooth surfaces, NO Japanese elements.',
  
  'pungsokdo': 'Korean genre painting (Pungsokdo) style by master Kim Hongdo. SOFT WATERCOLOR WASHES on traditional Korean paper. DELICATE FLOWING BRUSH LINES for figures. Everyday life scenes of Joseon Dynasty Korea. Limited subtle color palette - soft browns, muted greens, pale blues. EMPTY SPACE as compositional element. Light loose brushwork. Traditional Korean clothing (hanbok). Gentle humorous narrative quality. NO heavy oil textures, NO Western perspective, NO Japanese ukiyo-e style.',
  
  'jingyeong': 'Korean true-view landscape painting (Jingyeong Sansu) style by master Jeong Seon. BOLD EXPRESSIVE BRUSH STROKES for mountains. Korean mountain scenery with distinctive granite peaks. Strong ink work with dynamic energy. Traditional Korean landscape composition. Misty atmospheric perspective. Pine trees with characteristic Korean style. NO Chinese painting style, NO Japanese style.',
  
  'shuimohua': 'Chinese ink wash painting (Shuimohua/水墨画) style. BLACK INK on RICE PAPER with VISIBLE PAPER GRAIN texture. MONOCHROME ink with subtle grey gradations. EMPTY NEGATIVE SPACE as key compositional element. SPONTANEOUS EXPRESSIVE brush strokes. Soft atmospheric perspective. Traditional Chinese clothing (hanfu). Misty mountain backgrounds. Poetry and philosophy in visual form. NO color, NO Western oil painting technique.',
  
  'gongbi': 'Chinese meticulous court painting (Gongbi/工筆) style. FINE DETAILED BRUSHWORK with precise outlines. MINERAL PIGMENTS on silk with subtle sheen. Rich vivid colors - vermillion, malachite green, azurite blue, gold. Tang/Song Dynasty court elegance. Elaborate patterns on robes. Idealized graceful figures. Imperial court aesthetic. Highly refined technique with no visible brushstrokes.',
  
  'huaniaohua': 'Chinese flower and bird painting (Huaniaohua/花鳥画) style. DELICATE PRECISE BRUSHWORK for petals and feathers. Natural subjects with botanical accuracy. Subtle color gradations. Silk or paper with visible texture. Elegant composition with empty space. Traditional Chinese aesthetic. Poetic naturalism.',
  
  'ukiyoe': 'Japanese Ukiyo-e woodblock print style. FLAT COLOR AREAS with BOLD BLACK OUTLINES. LIMITED COLOR PALETTE of traditional woodblock inks. WOODGRAIN TEXTURE visible in color areas. Stylized Japanese figures with distinctive features. Dramatic compositions. Floating world aesthetic. Kabuki drama or courtesan elegance. Transform clothing to traditional kimono. NO photography, NO 3D rendering, NO gradients.'
};

// ========================================
// 🔍 화풍 조회 함수
// ========================================

/**
 * 화가 키로 화풍 프롬프트 가져오기
 * @param {string} artistKey - 화가 키 (예: 'vangogh', 'monet', 'picasso')
 * @returns {string|null} 화풍 프롬프트
 */
export function getArtistStyle(artistKey) {
  const normalized = artistKey.toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace(/é/g, 'e')
    .replace(/ó/g, 'o');
  
  return ARTIST_STYLES[normalized] || null;
}

/**
 * 화가 이름으로 화풍 프롬프트 가져오기 (다양한 표기 지원)
 * @param {string} artistName - 화가 이름 (영문, 한글, 풀네임 등)
 * @returns {string|null} 화풍 프롬프트
 */
export function getArtistStyleByName(artistName) {
  const normalized = artistName.toUpperCase().trim();
  
  // 이름 매핑
  const nameToKey = {
    // 고대
    'CLASSICAL': 'classical-sculpture', 'SCULPTURE': 'classical-sculpture', '조각': 'classical-sculpture',
    'CLASSICAL SCULPTURE': 'classical-sculpture', 'GREEK SCULPTURE': 'classical-sculpture', 'ROMAN SCULPTURE': 'classical-sculpture',
    'MARBLE': 'classical-sculpture', 'MARBLE SCULPTURE': 'classical-sculpture',
    'MOSAIC': 'roman-mosaic', 'ROMAN': 'roman-mosaic', '모자이크': 'roman-mosaic',
    'ROMAN MOSAIC': 'roman-mosaic', 'ANCIENT MOSAIC': 'roman-mosaic',
    
    // 중세
    'BYZANTINE': 'byzantine', '비잔틴': 'byzantine', 'BYZANTINE ICON': 'byzantine', 'BYZANTINE MOSAIC': 'byzantine',
    'GOTHIC': 'gothic', '고딕': 'gothic', 'GOTHIC STAINED GLASS': 'gothic', 'STAINED GLASS': 'gothic',
    'ISLAMIC': 'islamic-miniature', 'MINIATURE': 'islamic-miniature', '이슬람': 'islamic-miniature',
    'ISLAMIC MINIATURE': 'islamic-miniature', 'PERSIAN MINIATURE': 'islamic-miniature', 'OTTOMAN MINIATURE': 'islamic-miniature',
    
    // 르네상스
    'BOTTICELLI': 'botticelli', '보티첼리': 'botticelli', 'SANDRO BOTTICELLI': 'botticelli',
    'LEONARDO': 'leonardo', 'DA VINCI': 'leonardo', '다빈치': 'leonardo', '레오나르도': 'leonardo', 'LEONARDO DA VINCI': 'leonardo',
    'TITIAN': 'titian', '티치아노': 'titian', 'TIZIANO': 'titian',
    'MICHELANGELO': 'michelangelo', '미켈란젤로': 'michelangelo', 'MICHELANGELO BUONARROTI': 'michelangelo',
    'RAPHAEL': 'raphael', '라파엘로': 'raphael', 'RAFFAELLO': 'raphael', 'RAFFAELLO SANZIO': 'raphael',
    
    // 바로크
    'CARAVAGGIO': 'caravaggio', '카라바조': 'caravaggio', 'MICHELANGELO MERISI DA CARAVAGGIO': 'caravaggio',
    'RUBENS': 'rubens', '루벤스': 'rubens', 'PETER PAUL RUBENS': 'rubens',
    'REMBRANDT': 'rembrandt', '렘브란트': 'rembrandt', 'REMBRANDT VAN RIJN': 'rembrandt',
    'VELÁZQUEZ': 'velazquez', 'VELAZQUEZ': 'velazquez', '벨라스케스': 'velazquez', 'DIEGO VELÁZQUEZ': 'velazquez', 'DIEGO VELAZQUEZ': 'velazquez',
    
    // 로코코
    'WATTEAU': 'watteau', '와토': 'watteau', 'ANTOINE WATTEAU': 'watteau', 'JEAN-ANTOINE WATTEAU': 'watteau',
    'BOUCHER': 'boucher', '부셰': 'boucher', 'FRANÇOIS BOUCHER': 'boucher', 'FRANCOIS BOUCHER': 'boucher',
    
    // 신고전/낭만/사실
    'DAVID': 'david', '다비드': 'david', 'JACQUES-LOUIS DAVID': 'david',
    'INGRES': 'ingres', '앵그르': 'ingres', 'JEAN-AUGUSTE-DOMINIQUE INGRES': 'ingres',
    'TURNER': 'turner', '터너': 'turner', 'J.M.W. TURNER': 'turner', 'WILLIAM TURNER': 'turner',
    'DELACROIX': 'delacroix', '들라크루아': 'delacroix', 'EUGÈNE DELACROIX': 'delacroix', 'EUGENE DELACROIX': 'delacroix',
    'COURBET': 'courbet', '쿠르베': 'courbet', 'GUSTAVE COURBET': 'courbet',
    'MANET': 'manet', '마네': 'manet', 'ÉDOUARD MANET': 'manet', 'EDOUARD MANET': 'manet',
    
    // 인상주의
    'RENOIR': 'renoir', '르누아르': 'renoir', 'PIERRE-AUGUSTE RENOIR': 'renoir',
    'MONET': 'monet', '모네': 'monet', 'CLAUDE MONET': 'monet',
    'DEGAS': 'degas', '드가': 'degas', 'EDGAR DEGAS': 'degas',
    'CAILLEBOTTE': 'caillebotte', '카유보트': 'caillebotte', '칼리보트': 'caillebotte', 'GUSTAVE CAILLEBOTTE': 'caillebotte',
    
    // 후기인상주의
    'VAN GOGH': 'vangogh', 'GOGH': 'vangogh', '반 고흐': 'vangogh', '고흐': 'vangogh', '빈센트': 'vangogh', 'VINCENT VAN GOGH': 'vangogh',
    'GAUGUIN': 'gauguin', '고갱': 'gauguin', 'PAUL GAUGUIN': 'gauguin',
    'CÉZANNE': 'cezanne', 'CEZANNE': 'cezanne', '세잔': 'cezanne', 'PAUL CÉZANNE': 'cezanne', 'PAUL CEZANNE': 'cezanne',
    'SIGNAC': 'signac', '시냐크': 'signac', 'PAUL SIGNAC': 'signac',
    
    // 야수파
    'MATISSE': 'matisse', '마티스': 'matisse', 'HENRI MATISSE': 'matisse',
    'DERAIN': 'derain', '드랭': 'derain', 'ANDRÉ DERAIN': 'derain', 'ANDRE DERAIN': 'derain',
    'VLAMINCK': 'vlaminck', '블라맹크': 'vlaminck', 'MAURICE DE VLAMINCK': 'vlaminck',
    
    // 표현주의
    'MUNCH': 'munch', '뭉크': 'munch', 'EDVARD MUNCH': 'munch',
    'KIRCHNER': 'kirchner', '키르히너': 'kirchner', 'ERNST LUDWIG KIRCHNER': 'kirchner',
    'KOKOSCHKA': 'kokoschka', '코코슈카': 'kokoschka', 'OSKAR KOKOSCHKA': 'kokoschka',
    
    // 모더니즘
    'PICASSO': 'picasso', '피카소': 'picasso', 'PABLO PICASSO': 'picasso',
    'MAGRITTE': 'magritte', '마그리트': 'magritte', 'RENÉ MAGRITTE': 'magritte', 'RENE MAGRITTE': 'magritte',
    'MIRÓ': 'miro', 'MIRO': 'miro', '미로': 'miro', 'JOAN MIRÓ': 'miro', 'JOAN MIRO': 'miro',
    'CHAGALL': 'chagall', '샤갈': 'chagall', 'MARC CHAGALL': 'chagall',
    'LICHTENSTEIN': 'lichtenstein', '리히텐슈타인': 'lichtenstein', 'ROY LICHTENSTEIN': 'lichtenstein',
    'HARING': 'haring', 'KEITH HARING': 'haring', '해링': 'haring', '키스 해링': 'haring',
    
    // 거장 전용
    'KLIMT': 'klimt', '클림트': 'klimt', 'GUSTAV KLIMT': 'klimt',
    'FRIDA': 'frida', 'KAHLO': 'frida', '프리다': 'frida', '칼로': 'frida', 'FRIDA KAHLO': 'frida',
    
    // 동양화
    'MINHWA': 'minhwa', '민화': 'minhwa', 'KOREAN FOLK': 'minhwa',
    'PUNGSOKDO': 'pungsokdo', '풍속도': 'pungsokdo', 'GENRE PAINTING': 'pungsokdo', 'KIM HONGDO': 'pungsokdo',
    'JINGYEONG': 'jingyeong', '진경산수': 'jingyeong', 'TRUE VIEW': 'jingyeong', 'JEONG SEON': 'jingyeong',
    'SHUIMOHUA': 'shuimohua', '수묵화': 'shuimohua', 'INK WASH': 'shuimohua', '水墨画': 'shuimohua',
    'GONGBI': 'gongbi', '공필화': 'gongbi', 'METICULOUS': 'gongbi', '工筆': 'gongbi',
    'HUANIAOHUA': 'huaniaohua', '화조화': 'huaniaohua', 'FLOWER BIRD': 'huaniaohua', '花鳥': 'huaniaohua',
    'UKIYOE': 'ukiyoe', '우키요에': 'ukiyoe', 'WOODBLOCK': 'ukiyoe', 'UKIYO-E': 'ukiyoe'
  };
  
  // 직접 매칭
  for (const [name, key] of Object.entries(nameToKey)) {
    if (normalized.includes(name)) {
      return ARTIST_STYLES[key];
    }
  }
  
  return null;
}

// 콘솔 로그
console.log('📚 Artist Styles v68 loaded:', Object.keys(ARTIST_STYLES).length, 'artists');
