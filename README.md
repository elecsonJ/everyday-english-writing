# 영어 작문 연습 PWA

매일 3문장 영어 작문 연습 Progressive Web App

## 기능

- 📱 PWA - 아이폰 홈 화면에 추가 가능
- 📝 매일 3문장 한국어→영어 작문 연습
- 🤖 Claude API를 통한 실시간 피드백
- 🔔 매일 오전 7시 알림
- 📊 연속 학습 일수 추적
- 💾 로컬 스토리지 데이터 저장

## 설치 및 실행

1. 의존성 설치
```bash
npm install
```

2. 환경 변수 설정
`.env.local` 파일에 Claude API 키 추가:
```
ANTHROPIC_API_KEY=your-api-key-here
```

3. 개발 서버 실행
```bash
npm run dev
```

4. 빌드 및 배포
```bash
npm run build
npm start
```

## 아이폰에서 설치하기

1. Safari에서 앱 접속
2. 공유 버튼 탭
3. "홈 화면에 추가" 선택
4. 추가 버튼 탭

## 사용 방법

1. 한국어 문장을 영어로 작문
2. 제출 후 피드백 확인
   - 문법 체크
   - 개선된 문장
   - 원어민 스타일 문장
3. 제시된 문장 입력하여 학습 완료
4. 3문장 완료 시 축하 메시지 및 연속 일수 확인

## 기술 스택

- Next.js 14
- TypeScript
- Tailwind CSS
- PWA (next-pwa)
- Claude API
- Local Storage
