# English Everyday (매일영어)

매일 3문장 영어 작문 연습을 위한 Progressive Web App (PWA)

## 🌐 Live Demo
https://everyday-english-writing.vercel.app

## 기능

- 📱 PWA - 아이폰/안드로이드 홈 화면에 추가 가능
- 📝 매일 3문장 한국어→영어 작문 연습 (자정 기준 새 과제)
- 🤖 Claude 3 Haiku를 통한 실시간 피드백:
  - 문법 교정 (한국어 설명)
  - 개선된 버전 (최소한의 수정)
  - 자연스러운 버전 (원어민 표현)
- 🔔 매일 오전 7시 브라우저 알림
- 📊 연속 학습 일수 추적 및 동기부여
- 💾 브라우저 로컬 스토리지에 진행상황 저장
- 📖 완료 후 복습 가능 (회색 처리로 시각적 구분)

## 설치 및 실행

### 로컬 개발

1. 저장소 클론
```bash
git clone https://github.com/elecsonJ/everyday-english-writing.git
cd everyday-english-writing
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
3. GitHub 저장소 연결 및 `everyday-english-writing` 선택

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

1. **작문하기**: 한국어 문장을 영어로 번역
2. **피드백 받기**: 제출 후 3가지 피드백 확인
   - 문법 체크 (한국어로 설명)
   - 개선된 문장 (최소 수정)
   - 원어민 스타일 (자연스러운 표현)
3. **학습하기**: 개선된 문장과 원어민 표현을 직접 입력하여 학습 완료
4. **완료하기**: 3문장 모두 완료 시 연속 일수 업데이트
5. **복습하기**: 완료된 내용은 회색으로 표시되며 언제든 다시 볼 수 있음

> 💡 **팁**: 자정 이후 접속하면 새로운 주제의 문장 3개가 자동 생성됩니다!

## Claude API 키 발급

1. [Anthropic Console](https://console.anthropic.com) 접속
2. 가입 또는 로그인
3. API Keys 메뉴 → Create Key
4. 키 복사 후 안전하게 보관

## 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **PWA**: next-pwa, Service Workers
- **AI**: Claude 3 Haiku (Anthropic)
- **Storage**: Browser Local Storage
- **Deployment**: Vercel
- **Notifications**: Web Push API

## 문제 해결

### 알림이 안 뜰 때
- Safari: 설정 → Safari → 알림 → 허용 확인
- Chrome: 브라우저 설정 → 개인정보 보호 및 보안 → 사이트 설정 → 알림
- PWA 재설치 후 알림 권한 재설정

### API 에러 발생 시
- Claude API 키가 올바른지 확인
- Anthropic Console에서 API 사용량 한도 체크
- 네트워크 연결 상태 확인

### 데이터가 사라졌을 때
- 브라우저 캐시/쿠키 삭제 시 로컬 데이터 초기화됨
- 시크릿 모드에서는 데이터가 저장되지 않음
- 디바이스/브라우저별로 독립적인 진행상황 유지

## License

MIT
