# 🎬 Sora 영상 프롬프트 자동 생성기

OpenAI Sora를 위한 전문적인 시네마틱 영상 프롬프트를 자동으로 생성하는 웹 애플리케이션입니다.

## 📋 주요 기능

- ✅ 구조화된 폼 기반 프롬프트 작성
- ✅ 템플릿 기반 자동 생성
- ✅ 실시간 프리뷰
- ✅ 프롬프트 내보내기 (TXT, Markdown)
- ✅ 사전 정의된 프리셋 제공

## 🚀 시작하기

### 설치

```bash
npm install
```

### 실행

```bash
npm start
```

개발 모드 (자동 재시작):
```bash
npm run dev
```

서버가 시작되면 브라우저에서 `http://localhost:3000`으로 접속하세요.

## 📁 프로젝트 구조

```
Video Prompt Writing/
├── src/
│   ├── index.js                 # 메인 서버 파일
│   ├── components/              # UI 컴포넌트
│   │   ├── PromptForm.js        # 프롬프트 입력 폼
│   │   └── PromptPreview.js     # 프롬프트 미리보기
│   └── utils/
│       ├── promptGenerator.js   # 프롬프트 생성 로직
│       └── templateLoader.js    # 템플릿 로더
├── templates/
│   ├── base-template.json       # 기본 템플릿
│   ├── cinematic-template.json  # 시네마틱 프리셋
│   └── action-template.json     # 액션 프리셋
├── public/
│   ├── css/
│   │   └── style.css            # 스타일시트
│   ├── js/
│   │   └── app.js               # 클라이언트 스크립트
│   └── index.html               # 메인 페이지
├── config/
│   └── settings.json            # 애플리케이션 설정
├── package.json
└── README.md
```

## 🎯 사용 방법

1. 웹 인터페이스에서 프롬프트 섹션별로 정보 입력
2. 프리셋 선택 또는 직접 커스터마이징
3. 실시간 프리뷰로 확인
4. 생성된 프롬프트 복사 또는 다운로드

## 📝 템플릿 섹션

1. **기술 사양** - 카메라, 렌즈, 필름 톤
2. **환경 설정** - 장소, 날씨, 조명
3. **캐릭터** - 외모, 의상 디테일
4. **장면 구성** - 타임코드별 샷 구성
5. **사운드** - 환경음, 음악
6. **대사** - 대화 및 내레이션

## 🛠️ 기술 스택

- **Backend**: Node.js + Express
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Template Engine**: EJS
- **Data Format**: JSON

## 📄 라이선스

MIT License
