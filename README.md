# 영어 작문 연습 PWA

매일 3문장 영어 작문 연습 Progressive Web App

## 🌐 Live Demo
https://english-everyday.vercel.app (배포 후 URL)

## 기능

- 📱 PWA - 아이폰 홈 화면에 추가 가능
- 📝 매일 3문장 한국어→영어 작문 연습
- 🤖 Claude API를 통한 실시간 피드백
- 🔔 매일 오전 7시 알림
- 📊 연속 학습 일수 추적
- 💾 로컬 스토리지 데이터 저장

## 설치 및 실행

### 로컬 개발

1. 저장소 클론
```bash
git clone https://github.com/elecsonJ/english-everyday.git
cd english-everyday
```

2. 의존성 설치
```bash
npm install
```

3. 환경 변수 설정
`.env.local` 파일 생성 후 Claude API 키 추가:
```
ANTHROPIC_API_KEY=your-api-key-here
```

4. 개발 서버 실행
```bash
npm run dev
```

## 🚀 Vercel 배포 가이드

### 1단계: Vercel 가입 및 연결
1. [Vercel](https://vercel.com) 가입 (GitHub 계정으로 로그인 가능)
2. "Add New..." → "Project" 클릭
3. GitHub 저장소 연결 및 `english-everyday` 선택

### 2단계: 환경 변수 설정
1. "Environment Variables" 섹션
2. Key: `ANTHROPIC_API_KEY`
3. Value: Claude API 키 입력
4. "Add" 클릭

### 3단계: 배포
1. "Deploy" 버튼 클릭
2. 2-3분 후 배포 완료
3. 제공된 URL로 접속 (예: `https://your-app-name.vercel.app`)

### 4단계: 커스텀 도메인 (선택사항)
1. Project Settings → Domains
2. 도메인 추가 및 DNS 설정

## 📱 아이폰에서 설치하기

1. Safari에서 배포된 URL 접속
2. 공유 버튼 탭 (하단 가운데)
3. "홈 화면에 추가" 선택
4. "추가" 버튼 탭

## 사용 방법

1. 한국어 문장을 영어로 작문
2. 제출 후 피드백 확인
   - 문법 체크
   - 개선된 문장
   - 원어민 스타일 문장
3. 제시된 문장 입력하여 학습 완료
4. 3문장 완료 시 축하 메시지 및 연속 일수 확인

## Claude API 키 발급

1. [Anthropic Console](https://console.anthropic.com) 접속
2. 가입 또는 로그인
3. API Keys 메뉴 → Create Key
4. 키 복사 후 안전하게 보관

## 기술 스택

- Next.js 14
- TypeScript
- Tailwind CSS
- PWA (next-pwa)
- Claude API (Haiku model)
- Local Storage

## 문제 해결

### 알림이 안 뜰 때
- 설정 → Safari → 알림 → 허용 확인
- PWA 재설치

### API 에러 발생 시
- Claude API 키 확인
- API 사용량 한도 체크

## License

MIT
