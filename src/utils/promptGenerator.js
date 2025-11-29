const fs = require('fs');
const path = require('path');

class PromptGenerator {
  constructor() {
    this.templatesPath = path.join(__dirname, '../../templates');
  }

  /**
   * 프롬프트 데이터를 받아 완성된 프롬프트를 생성합니다
   * @param {Object} data - 프롬프트 데이터
   * @returns {String} - 생성된 프롬프트
   */
  generate(data) {
    let prompt = '';

    // 1. 참조 이미지 설정 (선택사항)
    if (data.referenceImage) {
      prompt += this._generateReferenceSection(data.referenceImage);
    }

    // 2. 기술 사양
    if (data.technicalSpecs) {
      prompt += this._generateTechnicalSpecs(data.technicalSpecs);
    }

    // 3. 환경 & 배경 설정
    if (data.environment) {
      prompt += this._generateEnvironment(data.environment);
    }

    // 4. 캐릭터 & 의상
    if (data.character) {
      prompt += this._generateCharacter(data.character);
    }

    // 5. 장면 구성
    if (data.scenes) {
      prompt += this._generateScenes(data.scenes);
    }

    // 6. 사운드 디자인
    if (data.sound) {
      prompt += this._generateSound(data.sound);
    }

    // 7. 대사
    if (data.dialogue) {
      prompt += this._generateDialogue(data.dialogue);
    }

    // 8. 특수 지시사항
    if (data.specialInstructions) {
      prompt += this._generateSpecialInstructions(data.specialInstructions);
    }

    return prompt.trim();
  }

  /**
   * 참조 이미지 섹션 생성
   */
  _generateReferenceSection(refData) {
    return `## 참조 이미지 설정\n\n` +
      `업로드된 참조 이미지를 ${refData.usage || '조명/환경 톤/의상/캐릭터 배치'}의 완전한 시각적 참조로 사용하세요.\n` +
      `참조 이미지를 화면에 표시하거나 렌더링하지 마세요.\n\n` +
      `주요 참조 요소:\n` +
      `- 조명: ${refData.lighting || ''}\n` +
      `- 색감: ${refData.colorTone || ''}\n` +
      `- 분위기: ${refData.atmosphere || ''}\n` +
      `- 특정 마커/위치: ${refData.markers || ''}\n\n`;
  }

  /**
   * 기술 사양 섹션 생성
   */
  _generateTechnicalSpecs(specs) {
    return `## 기술 사양\n\n` +
      `${specs.shootingFormat || '실사'} 시네마틱 시퀀스\n\n` +
      `촬영 장비:\n` +
      `- 카메라: ${specs.camera || 'ARRI ALEXA 65'}\n` +
      `- 렌즈: ${specs.lens || '85mm'}\n` +
      `- 촬영 기법: ${specs.technique || '스테디캠'}\n\n` +
      `필름 톤 & 색보정:\n` +
      `- 필름 톤: ${specs.filmTone || 'ARRI LogC4'}\n` +
      `- 색보정 스타일: ${specs.colorGrading || 'deep HDR 대비'}\n` +
      `- 특수 효과: ${specs.specialEffects || ''}\n\n` +
      `조명 & 색상 팔레트:\n` +
      `- 광원: ${specs.lightSource || '자연광'}\n` +
      `- 시간대: ${specs.timeOfDay || '황혼'}\n` +
      `- 주조색: ${specs.primaryColor || ''}\n` +
      `- 보조색: ${specs.secondaryColor || ''}\n\n`;
  }

  /**
   * 환경 섹션 생성
   */
  _generateEnvironment(env) {
    return `## 환경 & 배경 설정\n\n` +
      `장소: ${env.location || ''}\n\n` +
      `환경 디테일:\n` +
      `- 지형: ${env.terrain || ''}\n` +
      `- 날씨: ${env.weather || ''}\n` +
      `- 시간: ${env.time || ''}\n` +
      `- 특징적 요소: ${env.features || ''}\n\n` +
      `분위기: ${env.mood || ''}\n\n`;
  }

  /**
   * 캐릭터 섹션 생성
   */
  _generateCharacter(char) {
    let section = `## 캐릭터 & 의상\n\n` +
      `캐릭터: ${char.description || ''}\n` +
      `역할: ${char.role || ''}\n\n` +
      `의상 구성:\n`;

    if (char.costume) {
      if (char.costume.head) {
        section += `1. 헤드/얼굴:\n   - ${char.costume.head}\n\n`;
      }
      if (char.costume.top) {
        section += `2. 상의:\n   - ${char.costume.top}\n\n`;
      }
      if (char.costume.accessories) {
        section += `3. 액세서리/장비:\n   - ${char.costume.accessories}\n\n`;
      }
      if (char.costume.bottom) {
        section += `4. 하의:\n   - ${char.costume.bottom}\n\n`;
      }
      if (char.costume.shoes) {
        section += `5. 신발:\n   - ${char.costume.shoes}\n\n`;
      }
    }

    return section;
  }

  /**
   * 장면 구성 섹션 생성
   */
  _generateScenes(scenes) {
    let section = `## 장면 구성\n\n`;
    
    if (scenes.overview) {
      section += `총 길이: ${scenes.overview.duration || ''}\n` +
        `시작 상황: ${scenes.overview.startingSituation || ''}\n` +
        `카메라 동선: ${scenes.overview.cameraMovement || ''}\n\n`;
    }

    if (scenes.shots && Array.isArray(scenes.shots)) {
      scenes.shots.forEach((shot, index) => {
        section += `### [${shot.timecode || `${index * 5}-${(index + 1) * 5}초`}] — ${shot.type || 'Medium Shot'}\n\n` +
          `카메라:\n` +
          `- 앵글: ${shot.angle || ''}\n` +
          `- 움직임: ${shot.movement || ''}\n` +
          `- 구도: ${shot.composition || ''}\n\n` +
          `액션: ${shot.action || ''}\n\n` +
          `시각적 디테일: ${shot.visualDetails || ''}\n\n` +
          `감정/분위기: ${shot.mood || ''}\n\n`;
      });
    }

    return section;
  }

  /**
   * 사운드 디자인 섹션 생성
   */
  _generateSound(sound) {
    let section = `## 사운드 디자인\n\n`;

    if (sound.ambient && sound.ambient.length > 0) {
      section += `환경음:\n`;
      sound.ambient.forEach(s => {
        section += `- ${s}\n`;
      });
      section += `\n`;
    }

    if (sound.character && sound.character.length > 0) {
      section += `캐릭터 사운드:\n`;
      sound.character.forEach(s => {
        section += `- ${s}\n`;
      });
      section += `\n`;
    }

    if (sound.mechanical && sound.mechanical.length > 0) {
      section += `기계/전자음:\n`;
      sound.mechanical.forEach(s => {
        section += `- ${s}\n`;
      });
      section += `\n`;
    }

    if (sound.music) {
      section += `음악: ${sound.music}\n\n`;
    }

    return section;
  }

  /**
   * 대사 섹션 생성
   */
  _generateDialogue(dialogue) {
    let section = `## 대사\n\n`;

    if (dialogue.lines && Array.isArray(dialogue.lines)) {
      dialogue.lines.forEach(line => {
        section += `${line.character || 'Character'}:\n` +
          `> "${line.text}"\n`;
        if (line.emotion) {
          section += `[감정 표현: ${line.emotion}]\n`;
        }
        section += `\n`;
      });
    }

    return section;
  }

  /**
   * 특수 지시사항 섹션 생성
   */
  _generateSpecialInstructions(instructions) {
    let section = `## 특수 지시사항\n\n`;

    if (instructions.must && instructions.must.length > 0) {
      section += `필수 준수사항:\n`;
      instructions.must.forEach(inst => {
        section += `- ${inst}\n`;
      });
      section += `\n`;
    }

    if (instructions.emphasize && instructions.emphasize.length > 0) {
      section += `강조할 요소:\n`;
      instructions.emphasize.forEach(inst => {
        section += `- ${inst}\n`;
      });
      section += `\n`;
    }

    if (instructions.avoid && instructions.avoid.length > 0) {
      section += `피해야 할 요소:\n`;
      instructions.avoid.forEach(inst => {
        section += `- ${inst}\n`;
      });
      section += `\n`;
    }

    return section;
  }

  /**
   * 사용 가능한 템플릿 목록 반환
   */
  getTemplates() {
    const templates = [];
    const files = fs.readdirSync(this.templatesPath);
    
    files.forEach(file => {
      if (path.extname(file) === '.json') {
        const templatePath = path.join(this.templatesPath, file);
        const template = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));
        templates.push({
          id: path.basename(file, '.json'),
          name: template.name || file,
          description: template.description || '',
          data: template
        });
      }
    });

    return templates;
  }

  /**
   * 특정 템플릿 로드
   */
  loadTemplate(templateId) {
    const templatePath = path.join(this.templatesPath, `${templateId}.json`);
    if (fs.existsSync(templatePath)) {
      return JSON.parse(fs.readFileSync(templatePath, 'utf-8'));
    }
    return null;
  }

  /**
   * 스토리 텍스트를 분석하여 프롬프트 데이터로 변환
   * @param {String} story - 사용자가 작성한 스토리
   * @returns {Object} - 분석된 프롬프트 데이터
   */
  analyzeStory(story) {
    const analysis = {
      technicalSpecs: {},
      environment: {},
      character: { costume: {} },
      scenes: { overview: {}, shots: [] },
      sound: { ambient: [], character: [], mechanical: [] },
      specialInstructions: { must: [], emphasize: [], avoid: [] }
    };

    const storyLower = story.toLowerCase();
    
    // 분석 결과를 저장할 메타데이터
    const metadata = {
      isAction: false,
      isEmotional: false,
      isDark: false,
      isWide: false,
      pace: 'medium' // slow, medium, fast
    };

    // === 장면 분위기 및 페이스 분석 ===
    
    // 액션 씬 감지
    const actionKeywords = ['달리', '뛰', '싸우', '전투', '추격', '도망', '폭발', '충돌', '공격', '격투', '날아', '점프'];
    actionKeywords.forEach(keyword => {
      if (storyLower.includes(keyword)) {
        metadata.isAction = true;
        metadata.pace = 'fast';
      }
    });

    // 감성적 씬 감지
    const emotionalKeywords = ['눈물', '울', '슬픔', '그리움', '사랑', '회상', '추억', '이별', '만남', '포옹', '미소'];
    emotionalKeywords.forEach(keyword => {
      if (storyLower.includes(keyword)) {
        metadata.isEmotional = true;
        if (metadata.pace !== 'fast') metadata.pace = 'slow';
      }
    });

    // 어두운 톤 감지
    const darkKeywords = ['어둠', '공포', '두려움', '위협', '긴장', '불안', '폐허', '버려진', '죽음', '피'];
    darkKeywords.forEach(keyword => {
      if (storyLower.includes(keyword)) metadata.isDark = true;
    });

    // 광활한 풍경 감지
    const wideKeywords = ['넓은', '광활', '끝없는', '수평선', '지평선', '광야', '대평원', '바다', '하늘'];
    wideKeywords.forEach(keyword => {
      if (storyLower.includes(keyword)) metadata.isWide = true;
    });

    // 시간대 분석 (더 정교하게)
    if (storyLower.includes('석양') || storyLower.includes('황혼') || storyLower.includes('노을') || storyLower.includes('해질녘')) {
      analysis.technicalSpecs.timeOfDay = '황혼/석양';
      analysis.technicalSpecs.lightSource = '따뜻한 황금빛 석양, 낮은 각도의 측면 조명';
      analysis.technicalSpecs.colorGrading = '시네마틱 주황-노랑 톤, 깊은 그림자, 높은 대비';
      analysis.specialInstructions.emphasize.push('석양의 황금빛 빛줄기', '긴 그림자 효과');
    } else if (storyLower.includes('밤') || storyLower.includes('한밤중') || storyLower.includes('자정')) {
      analysis.technicalSpecs.timeOfDay = '밤';
      if (storyLower.includes('달빛') || storyLower.includes('달')) {
        analysis.technicalSpecs.lightSource = '차가운 달빛, 푸른 톤의 자연광';
        analysis.technicalSpecs.colorGrading = '블루 틴트, 네오-누아르 스타일';
      } else if (storyLower.includes('네온') || storyLower.includes('간판')) {
        analysis.technicalSpecs.lightSource = '네온 사인, 인공 조명';
        analysis.technicalSpecs.colorGrading = '강렬한 네온 컬러, 틸-오렌지 또는 퍼플-시안';
      } else {
        analysis.technicalSpecs.lightSource = '인공 조명, 가로등, 실내 조명';
        analysis.technicalSpecs.colorGrading = '어두운 톤, 높은 대비, deep shadows';
      }
    } else if (storyLower.includes('새벽') || storyLower.includes('동틀녘')) {
      analysis.technicalSpecs.timeOfDay = '새벽';
      analysis.technicalSpecs.lightSource = '부드러운 새벽빛, 블루 아워';
      analysis.technicalSpecs.colorGrading = '청량한 블루-시안 톤, 낮은 채도';
      analysis.specialInstructions.emphasize.push('새벽 안개 효과', '부드러운 빛의 확산');
    } else if (storyLower.includes('정오') || storyLower.includes('한낮')) {
      analysis.technicalSpecs.timeOfDay = '정오';
      analysis.technicalSpecs.lightSource = '강렬한 정오의 직사광선';
      analysis.technicalSpecs.colorGrading = '높은 채도, 뚜렷한 대비';
    } else if (storyLower.includes('오후') || storyLower.includes('낮')) {
      analysis.technicalSpecs.timeOfDay = '오후';
      analysis.technicalSpecs.lightSource = '자연광, 부드러운 태양빛';
      analysis.technicalSpecs.colorGrading = '자연스러운 색감, 균형잡힌 톤';
    } else {
      analysis.technicalSpecs.timeOfDay = '낮';
      analysis.technicalSpecs.lightSource = '자연광';
      analysis.technicalSpecs.colorGrading = '자연스러운 색감';
    }

    // 촬영 형식 및 장비 (씬 특성에 따라)
    analysis.technicalSpecs.shootingFormat = '실사';
    
    // 카메라 선택 (씬 특성 기반)
    if (metadata.isAction) {
      analysis.technicalSpecs.camera = 'RED Komodo 6K';
      analysis.technicalSpecs.filmTone = 'RED IPP2';
      analysis.specialInstructions.must.push('빠른 움직임 포착', '높은 프레임레이트');
    } else if (metadata.isEmotional) {
      analysis.technicalSpecs.camera = 'ARRI ALEXA Mini';
      analysis.technicalSpecs.filmTone = 'ARRI LogC3';
      analysis.specialInstructions.must.push('부드러운 피부 톤', '자연스러운 색감');
    } else if (metadata.isWide) {
      analysis.technicalSpecs.camera = 'ARRI ALEXA 65';
      analysis.technicalSpecs.filmTone = 'ARRI LogC4';
      analysis.specialInstructions.emphasize.push('광활한 스케일', '깊은 심도');
    } else {
      analysis.technicalSpecs.camera = 'Sony FX6';
      analysis.technicalSpecs.filmTone = 'Sony S-Log3';
    }

    // 장소 및 환경 분석 (더 세밀하게)
    if (storyLower.includes('사막') || storyLower.includes('모래') || storyLower.includes('황무지')) {
      analysis.environment.location = '외부, 사막 지역';
      analysis.environment.terrain = '끝없는 모래 언덕, 건조한 황무지, 바위 노두';
      analysis.environment.weather = '건조, 강렬한 햇빛';
      if (storyLower.includes('폭풍') || storyLower.includes('모래바람')) {
        analysis.environment.weather = '거대한 모래폭풍, 강풍';
        analysis.sound.ambient.push('포효하는 바람', '모래가 얼굴에 부딪히는 소리', '멀리서 들리는 폭풍');
        analysis.specialInstructions.emphasize.push('모래 입자가 공기 중에 떠다니는 효과', '시야를 가리는 먼지 구름');
      } else {
        analysis.sound.ambient.push('건조한 바람 소리', '발이 모래를 밟는 소리', '정적');
      }
      analysis.environment.features = '황량한 모래 언덕, 먼 수평선, 열기 아지랑이';
      analysis.technicalSpecs.lens = metadata.isWide ? '24mm 광각 (광활함 강조)' : '35mm (환경과 인물 균형)';
      analysis.technicalSpecs.technique = '스테디캠, 드론 샷, 로우 앵글';
      analysis.specialInstructions.emphasize.push('황량함과 고립감', '먼지와 모래의 질감');
      
    } else if (storyLower.includes('도시') || storyLower.includes('거리') || storyLower.includes('빌딩') || storyLower.includes('시내')) {
      analysis.environment.location = '외부, 도심 거리';
      
      if (storyLower.includes('사이버펑크') || storyLower.includes('미래') || storyLower.includes('네온')) {
        analysis.environment.terrain = '고층 빌딩 숲, 좁은 골목, 네온 간판';
        analysis.environment.features = '홀로그램 광고, 네온 사인, 증강현실 인터페이스';
        analysis.sound.ambient.push('전자음', '네온 윙윙거림', '드론 소리', '먼 교통 소음');
        analysis.technicalSpecs.colorGrading = '사이버펑크 틸-오렌지 또는 퍼플-시안, 강렬한 네온 컬러';
        analysis.specialInstructions.emphasize.push('네온 반사 효과', '홀로그램 빛', '미래적 분위기');
      } else if (storyLower.includes('폐허') || storyLower.includes('버려진')) {
        analysis.environment.terrain = '무너진 건물, 부서진 도로, 녹슨 차량';
        analysis.environment.features = '깨진 유리, 덩굴에 뒤덮인 건물, 버려진 물건들';
        analysis.sound.ambient.push('바람에 흔들리는 금속', '먼 곳의 낙하물 소리', '정적');
        analysis.specialInstructions.emphasize.push('폐허의 디스토피아적 분위기', '문명의 흔적');
      } else {
        analysis.environment.terrain = '고층 빌딩, 아스팔트 도로, 보도';
        analysis.environment.features = '간판, 차량, 보행자, 신호등';
        analysis.sound.ambient.push('도시 소음', '자동차 소리', '사람들의 대화', '멀리 들리는 사이렌');
      }
      
      analysis.technicalSpecs.lens = metadata.isAction ? '24mm 광각 (역동성)' : '50mm (자연스러운 시점)';
      analysis.technicalSpecs.technique = metadata.isAction ? '핸드헬드, 빠른 팬' : '스테디캠, 부드러운 추적';
      
    } else if (storyLower.includes('숲') || storyLower.includes('나무') || storyLower.includes('정글') || storyLower.includes('밀림')) {
      analysis.environment.location = '외부, 숲속';
      analysis.environment.terrain = '울창한 나무들, 이끼 낀 바위, 숲길';
      analysis.environment.weather = '습하고 안개 낀';
      analysis.environment.features = '나뭇잎 사이로 스며드는 빛줄기, 덩굴, 야생 식물';
      analysis.sound.ambient.push('새소리', '나뭇잎 바스락거림', '먼 동물 울음', '바람에 흔들리는 나무');
      analysis.technicalSpecs.lens = '35mm';
      analysis.technicalSpecs.technique = '스테디캠, 나무 사이를 누비는 추적샷';
      analysis.specialInstructions.emphasize.push('빛과 그림자의 대비', '자연의 질감');
      
    } else if (storyLower.includes('산') || storyLower.includes('설산') || storyLower.includes('봉우리')) {
      analysis.environment.location = '외부, 산악 지대';
      analysis.environment.terrain = '험준한 산봉우리, 가파른 절벽, 바위 지대';
      if (storyLower.includes('설산') || storyLower.includes('눈')) {
        analysis.environment.weather = '눈보라 또는 맑은 설경';
        analysis.environment.features = '눈 덮인 봉우리, 얼어붙은 절벽';
        analysis.sound.ambient.push('눈 밟는 소리', '차가운 바람', '얼음 갈라지는 소리');
      } else {
        analysis.environment.features = '바위 절벽, 산악 지형';
        analysis.sound.ambient.push('바람 소리', '멀리 들리는 메아리');
      }
      analysis.technicalSpecs.lens = '24mm 광각 (웅장함 강조)';
      analysis.technicalSpecs.technique = '드론, 크레인 샷';
      
    } else if (storyLower.includes('바다') || storyLower.includes('해변') || storyLower.includes('파도') || storyLower.includes('해안')) {
      analysis.environment.location = '외부, 해안/바다';
      analysis.environment.terrain = '모래사장, 파도, 수평선';
      analysis.environment.features = '부서지는 파도, 해안선, 바다의 광활함';
      analysis.sound.ambient.push('파도 소리', '갈매기 울음', '바람 소리', '물결');
      analysis.technicalSpecs.lens = '35mm';
      analysis.technicalSpecs.technique = '스테디캠, 드론';
      analysis.specialInstructions.emphasize.push('물의 움직임', '파도의 질감');
      
    } else if (storyLower.includes('실내') || storyLower.includes('방') || storyLower.includes('건물 안') || storyLower.includes('복도')) {
      analysis.environment.location = '내부, 실내 공간';
      
      if (storyLower.includes('어두운') || storyLower.includes('음침')) {
        analysis.environment.terrain = '어두운 방, 긴 복도';
        analysis.environment.features = '희미한 조명, 그림자진 구석';
        analysis.sound.ambient.push('발소리 메아리', '삐걱거림', '먼 소음');
        analysis.specialInstructions.emphasize.push('어둠과 그림자', '불안한 분위기');
      } else {
        analysis.environment.terrain = '방, 거실, 복도';
        analysis.environment.features = '창문, 가구, 실내 조명, 소품';
        analysis.sound.ambient.push('실내 잔향', '조용한 배경음', '일상의 소리');
      }
      
      analysis.technicalSpecs.lens = '24mm 광각 (공간감 확보)';
      analysis.technicalSpecs.technique = '스테디캠, 고정 샷, 슬라이더';
    }

    // 날씨 분석
    if (storyLower.includes('비') || storyLower.includes('빗') || storyLower.includes('장마')) {
      analysis.environment.weather = '비';
      analysis.sound.ambient.push('빗소리');
      analysis.specialInstructions.emphasize.push('비에 젖은 표면 반사');
    }
    if (storyLower.includes('눈') || storyLower.includes('설')) {
      analysis.environment.weather = '눈';
      analysis.sound.ambient.push('조용한 분위기', '눈 밟는 소리');
    }
    if (storyLower.includes('안개') || storyLower.includes('짙은 구름')) {
      analysis.environment.weather = '안개';
      analysis.specialInstructions.emphasize.push('안개 속 빛 확산 효과');
    }
    if (storyLower.includes('폭풍') || storyLower.includes('강풍')) {
      analysis.environment.weather = '폭풍';
      analysis.sound.ambient.push('강한 바람 소리', '물체가 흔들리는 소리');
    }

    // 분위기 분석
    if (storyLower.includes('황량') || storyLower.includes('고독') || storyLower.includes('쓸쓸')) {
      analysis.environment.mood = '황량하고 고독한';
    } else if (storyLower.includes('긴장') || storyLower.includes('위험') || storyLower.includes('공포')) {
      analysis.environment.mood = '긴장감 있고 위협적인';
    } else if (storyLower.includes('평화') || storyLower.includes('고요') || storyLower.includes('평온')) {
      analysis.environment.mood = '평화롭고 고요한';
    } else if (storyLower.includes('서정') || storyLower.includes('감성') || storyLower.includes('따뜻')) {
      analysis.environment.mood = '서정적이고 따뜻한';
    } else {
      analysis.environment.mood = '분위기 있는';
    }

    // 캐릭터 분석
    const characterKeywords = {
      '남자': '남성',
      '남성': '남성',
      '여자': '여성',
      '여성': '여성',
      '소년': '소년',
      '소녀': '소녀',
      '아이': '어린이',
      '노인': '노인'
    };

    for (const [keyword, description] of Object.entries(characterKeywords)) {
      if (storyLower.includes(keyword)) {
        analysis.character.description = description;
        break;
      }
    }

    // 나이대 추정
    if (storyLower.includes('20대')) {
      analysis.character.description = '20대 ' + (analysis.character.description || '인물');
    } else if (storyLower.includes('30대')) {
      analysis.character.description = '30대 ' + (analysis.character.description || '인물');
    } else if (storyLower.includes('40대')) {
      analysis.character.description = '40대 ' + (analysis.character.description || '인물');
    }

    // 역할 분석
    if (storyLower.includes('구조대') || storyLower.includes('구조원')) {
      analysis.character.role = '구조대원';
    } else if (storyLower.includes('탐험가') || storyLower.includes('탐험')) {
      analysis.character.role = '탐험가';
    } else if (storyLower.includes('생존자')) {
      analysis.character.role = '생존자';
    } else if (storyLower.includes('전사') || storyLower.includes('전투')) {
      analysis.character.role = '전사';
    } else if (storyLower.includes('방랑자') || storyLower.includes('여행자')) {
      analysis.character.role = '방랑자';
    }

    // 의상 분석 (더 정교하게)
    const colorMatch = story.match(/(빨강|빨간|레드|파랑|파란|블루|초록|녹색|그린|노랑|노란|옐로우|검정|검은|블랙|하양|하얀|흰|화이트|회색|그레이|주황|오렌지|보라|퍼플|분홍|핑크|청록|시안|금색|골드|은색|실버|갈색|브라운|베이지)색?/gi);
    
    let detectedColors = [];
    if (colorMatch) {
      detectedColors = [...new Set(colorMatch.map(c => c.replace('색', '').replace('색상', '')))];
    }

    // 의상 종류별 분석
    if (storyLower.includes('구조복') || storyLower.includes('작업복')) {
      const color = detectedColors[0] || '주황';
      analysis.character.costume.top = `${color} 구조복 재킷, 반사 스트립, 실용적 디자인`;
      analysis.character.costume.bottom = `${color} 구조복 바지, 다수의 포켓, 내구성 있는 원단`;
      analysis.specialInstructions.emphasize.push('구조복의 마모된 질감', '실용성 강조');
    } else if (storyLower.includes('정장') || storyLower.includes('수트')) {
      const color = detectedColors[0] || '검정';
      analysis.character.costume.top = `${color} 정장 재킷, 정돈된 실루엣`;
      analysis.character.costume.bottom = `${color} 정장 바지`;
      analysis.specialInstructions.emphasize.push('정장의 깔끔한 라인', '포멀한 분위기');
    } else if (storyLower.includes('가죽') && (storyLower.includes('재킷') || storyLower.includes('점퍼'))) {
      const color = detectedColors[0] || '검정';
      analysis.character.costume.top = `${color} 가죽 재킷, 마모된 질감, 반항적 스타일`;
      analysis.specialInstructions.emphasize.push('가죽의 광택과 질감');
    } else if (storyLower.includes('재킷') || storyLower.includes('점퍼') || storyLower.includes('외투')) {
      const color = detectedColors[0] || '';
      analysis.character.costume.top = `${color} 재킷`;
      if (storyLower.includes('낡은') || storyLower.includes('헤진')) {
        analysis.character.costume.top += ', 마모되고 낡은 상태';
      }
    } else if (storyLower.includes('티셔츠') || storyLower.includes('셔츠')) {
      const color = detectedColors[0] || '';
      analysis.character.costume.top = `${color} ${storyLower.includes('티셔츠') ? '티셔츠' : '셔츠'}`;
    }

    // 머리/얼굴
    if (storyLower.includes('헬멧') || storyLower.includes('투구')) {
      analysis.character.costume.head = '헬멧';
      if (storyLower.includes('바이저')) {
        analysis.character.costume.head += ', 바이저에 먼지와 긁힌 자국';
        analysis.specialInstructions.emphasize.push('헬멧 바이저의 반사와 결로');
      }
      if (storyLower.includes('호흡기')) {
        analysis.character.costume.head += ', 전면 호흡기 장착';
        analysis.sound.character.push('호흡기 소리', '필터 작동음');
      }
    } else if (storyLower.includes('모자')) {
      if (storyLower.includes('야구모자')) {
        analysis.character.costume.head = '야구모자';
      } else if (storyLower.includes('비니')) {
        analysis.character.costume.head = '비니';
      } else {
        analysis.character.costume.head = '모자';
      }
    } else if (storyLower.includes('고글') || storyLower.includes('선글라스')) {
      analysis.character.costume.head = storyLower.includes('고글') ? '보호 고글' : '선글라스';
    }

    // 액세서리
    const accessories = [];
    if (storyLower.includes('배낭') || storyLower.includes('가방')) {
      let backpack = '배낭';
      if (storyLower.includes('낡은') || storyLower.includes('헤진')) {
        backpack = '낡은 ' + backpack + ', 여러 곳이 해진';
      }
      if (detectedColors.length > 0) {
        backpack = detectedColors[0] + ' ' + backpack;
      }
      accessories.push(backpack);
    }
    
    if (storyLower.includes('무기') || storyLower.includes('총') || storyLower.includes('칼')) {
      accessories.push('무기');
      analysis.sound.mechanical.push('무기 소리');
    }
    
    if (storyLower.includes('장비')) {
      accessories.push('각종 장비');
    }
    
    if (storyLower.includes('무전기') || storyLower.includes('통신기')) {
      accessories.push('어깨 무전기');
      analysis.sound.mechanical.push('무전기 잡음');
    }

    if (storyLower.includes('시계')) {
      accessories.push('손목시계');
    }

    if (accessories.length > 0) {
      analysis.character.costume.accessories = accessories.join(', ');
    }

    // 장면 구성 (시네마틱 로직 적용)
    const sentences = story.split(/[.!?。]/g).filter(s => s.trim().length > 0);
    analysis.scenes.overview.startingSituation = sentences[0]?.trim() || '장면 시작';
    
    // 페이스에 따른 총 길이 결정
    const baseDuration = metadata.pace === 'fast' ? 12 : (metadata.pace === 'slow' ? 20 : 15);
    analysis.scenes.overview.duration = `${baseDuration}초`;

    // 샷 구성 생성 (시네마틱 원칙 적용)
    const shotCount = Math.min(Math.max(sentences.length, 3), 5); // 최소 3개, 최대 5개
    const shotDuration = baseDuration / shotCount;

    // 샷 시퀀스 디자인
    const shotSequence = this._designShotSequence(shotCount, metadata);

    for (let i = 0; i < shotCount; i++) {
      const startTime = Math.floor(i * shotDuration);
      const endTime = Math.floor((i + 1) * shotDuration);
      
      const shot = {
        timecode: `${startTime}-${endTime}초`,
        type: shotSequence[i].type,
        angle: shotSequence[i].angle,
        movement: shotSequence[i].movement,
        composition: shotSequence[i].composition,
        action: sentences[i]?.trim() || this._generateDefaultAction(i, shotCount),
        visualDetails: this._generateVisualDetails(analysis.environment, i, shotCount),
        mood: analysis.environment.mood
      };
      
      analysis.scenes.shots.push(shot);
    }

    // 사운드 - 캐릭터 관련
    if (storyLower.includes('걷') || storyLower.includes('발걸음')) {
      analysis.sound.character.push('발걸음 소리');
    }
    if (storyLower.includes('숨') || storyLower.includes('호흡')) {
      analysis.sound.character.push('호흡 소리');
    }

    // 사운드 - 음악
    if (analysis.environment.mood.includes('긴장')) {
      analysis.sound.music = '긴장감 있는 오케스트라 스코어';
    } else if (analysis.environment.mood.includes('서정')) {
      analysis.sound.music = '부드러운 피아노 앰비언트';
    } else if (analysis.environment.mood.includes('황량')) {
      analysis.sound.music = '미니멀한 드론 사운드';
    } else {
      analysis.sound.music = '분위기에 맞는 앰비언트 음악';
    }

    // 특수 지시사항
    analysis.specialInstructions.must.push(
      '스토리의 분위기 정확히 반영',
      '사실적인 디테일 표현'
    );

    if (storyLower.includes('먼지') || storyLower.includes('모래')) {
      analysis.specialInstructions.emphasize.push('먼지/모래 입자 효과');
    }
    if (storyLower.includes('빛') || storyLower.includes('햇살')) {
      analysis.specialInstructions.emphasize.push('빛의 방향과 강도');
    }

    analysis.specialInstructions.avoid.push(
      '과도한 CGI 느낌',
      '부자연스러운 색보정'
    );

    return analysis;
  }

  /**
   * 시네마틱 샷 시퀀스 디자인
   */
  _designShotSequence(shotCount, metadata) {
    const sequence = [];

    if (metadata.isAction) {
      // 액션 씬: 빠른 컷, 역동적 움직임
      sequence.push({
        type: 'Wide Shot',
        angle: 'Low Angle',
        movement: 'Rapid Pan',
        composition: '역동적 구도'
      });
      
      for (let i = 1; i < shotCount - 1; i++) {
        sequence.push({
          type: i % 2 === 0 ? 'Medium Shot' : 'Medium Close-up',
          angle: i % 2 === 0 ? 'Dutch Angle' : 'Eye Level',
          movement: 'Handheld Tracking',
          composition: '불안정한 프레임'
        });
      }
      
      sequence.push({
        type: 'Close-up',
        angle: 'Eye Level',
        movement: 'Quick Zoom In',
        composition: '중앙 집중'
      });
      
    } else if (metadata.isEmotional) {
      // 감성 씬: 느린 움직임, 클로즈업 중심
      sequence.push({
        type: 'Medium Shot',
        angle: 'Eye Level',
        movement: 'Slow Push In',
        composition: 'Rule of Thirds'
      });
      
      for (let i = 1; i < shotCount - 1; i++) {
        sequence.push({
          type: 'Medium Close-up',
          angle: 'Slightly High Angle',
          movement: 'Static',
          composition: '대칭적 구도'
        });
      }
      
      sequence.push({
        type: 'Extreme Close-up',
        angle: 'Eye Level',
        movement: 'Very Slow Dolly',
        composition: '중앙 배치'
      });
      
    } else if (metadata.isWide) {
      // 광활한 풍경: 와이드 샷 중심
      sequence.push({
        type: 'Extreme Wide Shot',
        angle: 'High Angle',
        movement: 'Slow Drone Descent',
        composition: '수평선 강조'
      });
      
      for (let i = 1; i < shotCount - 1; i++) {
        sequence.push({
          type: i % 2 === 0 ? 'Wide Shot' : 'Medium Shot',
          angle: 'Eye Level',
          movement: 'Slow Pan',
          composition: 'Rule of Thirds'
        });
      }
      
      sequence.push({
        type: 'Medium Close-up',
        angle: 'Eye Level',
        movement: 'Static',
        composition: '인물과 배경의 조화'
      });
      
    } else {
      // 일반 씬: 클래식 시네마틱 구성
      sequence.push({
        type: 'Wide Shot',
        angle: 'Eye Level',
        movement: 'Slow Dolly Forward',
        composition: 'Rule of Thirds'
      });
      
      for (let i = 1; i < shotCount - 1; i++) {
        const types = ['Medium Shot', 'Medium Close-up'];
        const movements = ['Tracking', 'Slow Pan', 'Static'];
        sequence.push({
          type: types[i % types.length],
          angle: 'Eye Level',
          movement: movements[i % movements.length],
          composition: 'Rule of Thirds'
        });
      }
      
      sequence.push({
        type: 'Close-up',
        angle: 'Slightly Low Angle',
        movement: 'Static',
        composition: '중앙 배치'
      });
    }

    // shotCount에 맞게 조정
    while (sequence.length < shotCount) {
      sequence.push(sequence[sequence.length - 1]);
    }
    
    return sequence.slice(0, shotCount);
  }

  /**
   * 기본 액션 생성
   */
  _generateDefaultAction(index, total) {
    const actions = [
      '장면이 시작되고 환경이 드러남',
      '캐릭터의 움직임과 행동',
      '주요 동작이 진행됨',
      '클라이막스 또는 전환점',
      '여운을 남기며 마무리'
    ];
    return actions[Math.min(index, actions.length - 1)];
  }

  /**
   * 시각적 디테일 생성
   */
  _generateVisualDetails(environment, index, total) {
    const details = [];
    
    if (index === 0) {
      // 첫 샷: 환경 설정
      details.push(`${environment.location}의 전체적인 분위기`);
      if (environment.weather) {
        details.push(`${environment.weather} 상태가 드러남`);
      }
    } else if (index === total - 1) {
      // 마지막 샷: 감정과 여운
      details.push('캐릭터의 감정이 얼굴에 드러남');
      if (environment.features) {
        details.push(`배경의 ${environment.features}가 희미하게 보임`);
      }
    } else {
      // 중간 샷: 액션과 환경의 조합
      details.push('캐릭터와 환경의 상호작용');
      if (environment.features) {
        details.push(environment.features);
      }
    }
    
    return details.join(', ');
  }
}

module.exports = new PromptGenerator();
