// 전역 변수
let shotCounter = 1;
let currentPrompt = '';
let currentPromptData = null;
let isAnalyzing = false;

// 촬영 컨셉 프리셋 데이터
const conceptPresets = {
    portrait: {
        name: "인물 사진",
        camera: "Sony Alpha 7 III",
        lens: "85mm",
        technique: "스테디캠",
        filmTone: "Kodak Portra 800",
        lightSource: "부드러운 자연광, 측면 조명",
        timeOfDay: "오후",
        settings: "f/2.8, 1/125s, ISO 400"
    },
    child: {
        name: "아동 사진",
        camera: "Canon EOS 90D",
        lens: "50mm 표준",
        technique: "핸드헬드",
        filmTone: "Kodak Gold 200",
        lightSource: "밝고 따뜻한 자연광",
        timeOfDay: "아침",
        settings: "f/3.5, 1/250s, ISO 200"
    },
    landscape: {
        name: "풍경 사진",
        camera: "Canon EOS 5D Mark IV",
        lens: "24mm 광각",
        technique: "고정 샷",
        filmTone: "Kodak Ektar 100",
        lightSource: "맑은 자연광",
        timeOfDay: "황혼",
        settings: "f/11, 1/30s, ISO 100"
    },
    nature: {
        name: "고요한 자연",
        camera: "Nikon D850",
        lens: "50mm 표준",
        technique: "고정 샷",
        filmTone: "Kodak Portra 160",
        lightSource: "부드러운 산광",
        timeOfDay: "오후",
        settings: "f/11, 1/125s, ISO 400"
    },
    street: {
        name: "스트리트 포토",
        camera: "Leica M10",
        lens: "35mm",
        technique: "핸드헬드",
        filmTone: "Kodak Tri-X 400",
        lightSource: "도시 자연광, 인공 조명 혼합",
        timeOfDay: "석양",
        settings: "f/2.8, 1/500s, ISO 800"
    },
    night: {
        name: "야경 사진",
        camera: "Sony Alpha 7R IV",
        lens: "24mm 광각",
        technique: "고정 샷",
        filmTone: "CineStill 800T",
        lightSource: "도시 야경 조명, 네온 사인",
        timeOfDay: "밤",
        settings: "f/11, 15s, ISO 800"
    },
    macro: {
        name: "매크로 사진",
        camera: "Canon EOS 90D",
        lens: "100mm 망원",
        technique: "고정 샷",
        filmTone: "Kodak Ektar 100",
        lightSource: "직사광선, 명확한 디테일",
        timeOfDay: "정오",
        settings: "f/4, 1/2000s, ISO 200"
    },
    food: {
        name: "식품 사진",
        camera: "Canon EOS 5D Mark IV",
        lens: "50mm 표준",
        technique: "고정 샷",
        filmTone: "Kodak Ektar 100",
        lightSource: "자연광, 반사판 활용",
        timeOfDay: "오후",
        settings: "f/6.3, 1/200s, ISO 100"
    },
    sports: {
        name: "스포츠 사진",
        camera: "Canon EOS-1D X Mark III",
        lens: "70-200mm 망원 줌",
        technique: "핸드헬드",
        filmTone: "Ilford Delta 3200",
        lightSource: "경기장 조명",
        timeOfDay: "밤",
        settings: "f/3.5, 1/1000s, ISO 1600"
    }
};

// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * 앱 초기화
 */
function initializeApp() {
    // 폼 제출 이벤트
    const form = document.getElementById('promptForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        generatePrompt();
    });

    // 폼 리셋 이벤트
    form.addEventListener('reset', function() {
        setTimeout(() => {
            document.getElementById('promptPreview').textContent = '프롬프트가 여기에 표시됩니다...';
            currentPrompt = '';
        }, 100);
    });
}

/**
 * 촬영 컨셉 프리셋 적용
 */
function applyConceptPreset(conceptId) {
    if (!conceptId) return;
    
    const preset = conceptPresets[conceptId];
    if (!preset) return;
    
    // 폼 필드에 프리셋 값 적용
    document.getElementById('camera').value = preset.camera;
    document.getElementById('lens').value = preset.lens;
    document.getElementById('technique').value = preset.technique;
    document.getElementById('filmTone').value = preset.filmTone;
    document.getElementById('lightSource').value = preset.lightSource;
    document.getElementById('timeOfDay').value = preset.timeOfDay;
    
    // 알림 표시
    showNotification(`${preset.name} 프리셋이 적용되었습니다 (${preset.settings})`);
}

/**
 * 알림 표시
 */
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        font-family: 'Inter', sans-serif;
        font-weight: 500;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(400px)';
        notification.style.transition = 'all 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * 스토리 분석 및 자동 적용
 */
async function analyzeStory() {
    const storyText = document.getElementById('storyInput').value.trim();
    
    if (!storyText) {
        alert('스토리를 먼저 작성해주세요.');
        return;
    }

    if (isAnalyzing) {
        alert('이미 분석 중입니다. 잠시만 기다려주세요.');
        return;
    }

    try {
        isAnalyzing = true;
        document.body.classList.add('loading');

        console.log('스토리 분석 시작:', storyText.substring(0, 50) + '...');

        const response = await fetch('/api/analyze-story', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ story: storyText })
        });

        console.log('응답 상태:', response.status);

        if (!response.ok) {
            throw new Error(`서버 응답 오류: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log('분석 결과:', result);

        if (result.success && result.analysis) {
            fillFormWithAnalysis(result.analysis);
            alert('✅ 스토리 분석이 완료되었습니다!\n각 항목을 확인하고 수정해주세요.');
            
            // 폼으로 스크롤
            setTimeout(() => {
                document.querySelector('.form-container').scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }, 300);
        } else {
            throw new Error(result.error || '알 수 없는 오류가 발생했습니다.');
        }
    } catch (error) {
        console.error('스토리 분석 오류:', error);
        alert('❌ 스토리 분석 중 오류가 발생했습니다.\n\n오류 내용: ' + error.message + '\n\n서버가 실행 중인지 확인해주세요.');
    } finally {
        isAnalyzing = false;
        document.body.classList.remove('loading');
    }
}

/**
 * 분석 결과로 폼 채우기
 */
function fillFormWithAnalysis(analysis) {
    // 기술 사양
    if (analysis.technicalSpecs) {
        const specs = analysis.technicalSpecs;
        if (specs.shootingFormat) document.getElementById('shootingFormat').value = specs.shootingFormat;
        if (specs.camera) document.getElementById('camera').value = specs.camera;
        if (specs.lens) document.getElementById('lens').value = specs.lens;
        if (specs.technique) document.getElementById('technique').value = specs.technique;
        if (specs.filmTone) document.getElementById('filmTone').value = specs.filmTone;
        if (specs.colorGrading) document.getElementById('colorGrading').value = specs.colorGrading;
        if (specs.lightSource) document.getElementById('lightSource').value = specs.lightSource;
        if (specs.timeOfDay) document.getElementById('timeOfDay').value = specs.timeOfDay;
    }

    // 환경
    if (analysis.environment) {
        const env = analysis.environment;
        if (env.location) document.getElementById('location').value = env.location;
        if (env.terrain) document.getElementById('terrain').value = env.terrain;
        if (env.weather) document.getElementById('weather').value = env.weather;
        if (env.features) document.getElementById('features').value = env.features;
        if (env.mood) document.getElementById('mood').value = env.mood;
    }

    // 캐릭터
    if (analysis.character) {
        const char = analysis.character;
        if (char.description) document.getElementById('charDescription').value = char.description;
        if (char.role) document.getElementById('charRole').value = char.role;
        
        if (char.costume) {
            if (char.costume.head) document.getElementById('costumeHead').value = char.costume.head;
            if (char.costume.top) document.getElementById('costumeTop').value = char.costume.top;
            if (char.costume.accessories) document.getElementById('costumeAccessories').value = char.costume.accessories;
        }
    }

    // 장면
    if (analysis.scenes) {
        if (analysis.scenes.overview) {
            if (analysis.scenes.overview.duration) document.getElementById('duration').value = analysis.scenes.overview.duration;
            if (analysis.scenes.overview.startingSituation) document.getElementById('startingSituation').value = analysis.scenes.overview.startingSituation;
        }

        // 샷 목록 초기화 및 추가
        if (analysis.scenes.shots && analysis.scenes.shots.length > 0) {
            // 기존 샷 제거 (첫 번째 제외)
            const container = document.getElementById('shotsContainer');
            const existingShots = container.querySelectorAll('.shot-item');
            existingShots.forEach((shot, index) => {
                if (index > 0) shot.remove();
            });
            shotCounter = 1;

            analysis.scenes.shots.forEach((shot, index) => {
                if (index === 0) {
                    // 첫 번째 샷 업데이트
                    document.querySelector('[name="shot_timecode_0"]').value = shot.timecode || '';
                    document.querySelector('[name="shot_type_0"]').value = shot.type || 'Wide Shot';
                    document.querySelector('[name="shot_angle_0"]').value = shot.angle || '';
                    document.querySelector('[name="shot_movement_0"]').value = shot.movement || '';
                    document.querySelector('[name="shot_action_0"]').value = shot.action || '';
                    document.querySelector('[name="shot_details_0"]').value = shot.visualDetails || '';
                } else {
                    addShot(shot);
                }
            });
        }
    }

    // 사운드
    if (analysis.sound) {
        if (analysis.sound.ambient) document.getElementById('soundAmbient').value = Array.isArray(analysis.sound.ambient) ? analysis.sound.ambient.join(', ') : analysis.sound.ambient;
        if (analysis.sound.character) document.getElementById('soundCharacter').value = Array.isArray(analysis.sound.character) ? analysis.sound.character.join(', ') : analysis.sound.character;
        if (analysis.sound.music) document.getElementById('soundMusic').value = analysis.sound.music;
    }

    // 특수 지시사항
    if (analysis.specialInstructions) {
        if (analysis.specialInstructions.must) document.getElementById('instructionsMust').value = Array.isArray(analysis.specialInstructions.must) ? analysis.specialInstructions.must.join(', ') : analysis.specialInstructions.must;
        if (analysis.specialInstructions.emphasize) document.getElementById('instructionsEmphasize').value = Array.isArray(analysis.specialInstructions.emphasize) ? analysis.specialInstructions.emphasize.join(', ') : analysis.specialInstructions.emphasize;
        if (analysis.specialInstructions.avoid) document.getElementById('instructionsAvoid').value = Array.isArray(analysis.specialInstructions.avoid) ? analysis.specialInstructions.avoid.join(', ') : analysis.specialInstructions.avoid;
    }
}

/**
 * 스토리 입력란 지우기
 */
function clearStory() {
    if (confirm('스토리를 지우시겠습니까?')) {
        document.getElementById('storyInput').value = '';
    }
}

/**
 * 샷 추가
 */
function addShot(shotData = null) {
    const container = document.getElementById('shotsContainer');
    const shotDiv = document.createElement('div');
    shotDiv.className = 'shot-item';
    shotDiv.dataset.shot = shotCounter;
    
    shotDiv.innerHTML = `
        <div class="form-grid">
            <div class="form-group">
                <label>타임코드</label>
                <input type="text" name="shot_timecode_${shotCounter}" placeholder="예: 0-5초" value="${shotData?.timecode || ''}">
            </div>
            <div class="form-group">
                <label>샷 타입</label>
                <select name="shot_type_${shotCounter}">
                    <option value="Wide Shot" ${shotData?.type === 'Wide Shot' ? 'selected' : ''}>Wide Shot</option>
                    <option value="Medium Shot" ${shotData?.type === 'Medium Shot' ? 'selected' : ''}>Medium Shot</option>
                    <option value="Close-up" ${shotData?.type === 'Close-up' ? 'selected' : ''}>Close-up</option>
                    <option value="Extreme Close-up" ${shotData?.type === 'Extreme Close-up' ? 'selected' : ''}>Extreme Close-up</option>
                </select>
            </div>
            <div class="form-group">
                <label>카메라 앵글</label>
                <input type="text" name="shot_angle_${shotCounter}" placeholder="예: Eye Level" value="${shotData?.angle || ''}">
            </div>
            <div class="form-group">
                <label>카메라 움직임</label>
                <input type="text" name="shot_movement_${shotCounter}" placeholder="예: Dolly Forward" value="${shotData?.movement || ''}">
            </div>
            <div class="form-group full-width">
                <label>액션</label>
                <textarea name="shot_action_${shotCounter}" rows="2" placeholder="캐릭터의 동작 설명">${shotData?.action || ''}</textarea>
            </div>
            <div class="form-group full-width">
                <label>시각적 디테일</label>
                <textarea name="shot_details_${shotCounter}" rows="2" placeholder="시각적 요소 설명">${shotData?.visualDetails || ''}</textarea>
            </div>
            <div class="form-group full-width">
                <button type="button" class="btn-small btn-secondary" onclick="removeShot(${shotCounter})">🗑️ 삭제</button>
            </div>
        </div>
    `;
    
    container.appendChild(shotDiv);
    shotCounter++;
}

/**
 * 샷 삭제
 */
function removeShot(shotId) {
    const shotItem = document.querySelector(`[data-shot="${shotId}"]`);
    if (shotItem) {
        shotItem.remove();
    }
}

/**
 * 프롬프트 생성
 */
async function generatePrompt() {
    const form = document.getElementById('promptForm');
    const formData = new FormData(form);
    
    // 폼 데이터를 객체로 변환
    const data = {
        technicalSpecs: {
            shootingFormat: formData.get('shootingFormat'),
            camera: formData.get('camera'),
            lens: formData.get('lens'),
            technique: formData.get('technique'),
            filmTone: formData.get('filmTone'),
            colorGrading: formData.get('colorGrading'),
            lightSource: formData.get('lightSource'),
            timeOfDay: formData.get('timeOfDay')
        },
        environment: {
            location: formData.get('location'),
            terrain: formData.get('terrain'),
            weather: formData.get('weather'),
            features: formData.get('features'),
            mood: formData.get('mood')
        },
        character: {
            description: formData.get('charDescription'),
            role: formData.get('charRole'),
            costume: {
                head: formData.get('costumeHead'),
                top: formData.get('costumeTop'),
                accessories: formData.get('costumeAccessories')
            }
        },
        scenes: {
            overview: {
                duration: formData.get('duration'),
                startingSituation: formData.get('startingSituation')
            },
            shots: []
        },
        sound: {
            ambient: formData.get('soundAmbient')?.split(',').map(s => s.trim()).filter(s => s) || [],
            character: formData.get('soundCharacter')?.split(',').map(s => s.trim()).filter(s => s) || [],
            music: formData.get('soundMusic')
        },
        specialInstructions: {
            must: formData.get('instructionsMust')?.split(',').map(s => s.trim()).filter(s => s) || [],
            emphasize: formData.get('instructionsEmphasize')?.split(',').map(s => s.trim()).filter(s => s) || [],
            avoid: formData.get('instructionsAvoid')?.split(',').map(s => s.trim()).filter(s => s) || []
        }
    };

    // 샷 데이터 수집
    for (let i = 0; i < shotCounter; i++) {
        const timecode = formData.get(`shot_timecode_${i}`);
        if (timecode) {
            data.scenes.shots.push({
                timecode: timecode,
                type: formData.get(`shot_type_${i}`),
                angle: formData.get(`shot_angle_${i}`),
                movement: formData.get(`shot_movement_${i}`),
                action: formData.get(`shot_action_${i}`),
                visualDetails: formData.get(`shot_details_${i}`)
            });
        }
    }

    try {
        // 로딩 상태 표시
        document.body.classList.add('loading');

        const response = await fetch('/api/generate-prompt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            currentPrompt = result.prompt;
            currentPromptData = data; // JSON 형식 데이터 저장
            document.getElementById('promptPreview').textContent = currentPrompt;
        } else {
            alert('프롬프트 생성에 실패했습니다: ' + result.error);
        }
    } catch (error) {
        console.error('프롬프트 생성 오류:', error);
        alert('프롬프트 생성 중 오류가 발생했습니다.');
    } finally {
        // 로딩 상태 해제
        document.body.classList.remove('loading');
    }
}

/**
 * 프롬프트 복사
 */
function copyPrompt() {
    const preview = document.getElementById('promptPreview');
    const text = preview.textContent;
    
    if (!text || text === '프롬프트가 여기에 표시됩니다...') {
        alert('복사할 프롬프트가 없습니다.');
        return;
    }

    navigator.clipboard.writeText(text).then(() => {
        alert('프롬프트가 클립보드에 복사되었습니다!');
    }).catch(err => {
        console.error('복사 실패:', err);
        alert('복사에 실패했습니다.');
    });
}

/**
 * 프롬프트 다운로드
 */
function downloadPrompt() {
    const preview = document.getElementById('promptPreview');
    const text = preview.textContent;
    
    if (!text || text === '프롬프트가 여기에 표시됩니다...') {
        alert('다운로드할 프롬프트가 없습니다.');
        return;
    }

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sora-prompt-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * JSON 형식으로 다운로드
 */
function downloadJSON() {
    if (!currentPromptData) {
        alert('다운로드할 프롬프트 데이터가 없습니다.');
        return;
    }

    // 텍스트 프롬프트도 JSON에 포함
    const jsonData = {
        textPrompt: currentPrompt,
        structuredData: currentPromptData,
        metadata: {
            generatedAt: new Date().toISOString(),
            version: '1.0',
            generator: 'Sora Video Prompt Generator'
        }
    };

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sora-prompt-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('JSON 파일이 다운로드되었습니다!');
}
