# DWLLCH_FE

## 기술 스택
- React (CRA)

## 시작하기

### 1. 클론
```bash
git clone https://github.com/DWLLCH/DWLLCH_FE.git
cd DWLLCH_FE
```

### 2. 의존성 설치
```bash
yarn install
```

### 3. 개발 서버 실행
```bash
yarn start
```

---

## 개발 도구
- **ESLint + Prettier** — 코드 스타일 검사 및 자동 정리
  - `yarn lint` / `yarn lint:fix`
  - `yarn format` / `yarn format:check`
- **Husky + Commitlint** — 커밋 시 아래 [커밋 컨벤션](#커밋-컨벤션) 형식이 아니면 커밋이 자동으로 막힘 (`.husky/commit-msg`)
  - 커밋 전 `.husky/pre-commit`에서 lint-staged가 변경된 파일에 대해 ESLint/Prettier를 자동 실행
- **Vitest + Testing Library** — 컴포넌트 테스트
  - `yarn test` (1회 실행) / `yarn test:watch` (watch 모드)
- **CodeRabbit** — PR 생성 시 (draft 제외) GitHub에서 자동으로 코드 리뷰

---

## 폴더 구조
```text
src/
  components/     # 공통 컴포넌트
  pages/          # 라우트 단위 페이지
  hooks/          # 커스텀 훅
  api/            # axios 등 API 요청 함수
  styles/         # 전역 스타일, 테마
  utils/          # 공통 유틸 함수
  constants/      # 상수
  assets/         # 이미지, 폰트 등
```

---

## 브랜치 전략
- `main` — 배포 브랜치. 직접 push 금지
- `develop` — 개발 통합 브랜치
- `feat/#이슈번호-기능명` — 기능 개발
- `fix/#이슈번호-버그명` — 버그 수정
- `chore/#이슈번호-작업명` — 설정, 빌드, 문서 등

## 이슈 규칙
- 작업 시작 전 이슈 먼저 생성 (`chore` 포함, 예외 없음)
- 이슈 제목 형식: `[FEAT] 기능명` / `[FIX] 버그명` / `[CHORE] 작업명`
- 이슈 템플릿(`.github/ISSUE_TEMPLATE`) 사용
  - 기능 요청 → `feature.md`
  - 버그 리포트 → `bug.md`
  - 설정/빌드 등 → `chore.md`

## PR 규칙
- PR 제목은 커밋 컨벤션과 동일한 형식
- 이슈 없이 PR 금지 (`closes #이슈번호` 필수)
- PR 템플릿(`.github/pull_request_template.md`) 양식에 맞춰 작성
- `feat` / `fix` / `chore` 브랜치 → `develop`으로 PR
- `develop` → `main`은 배포 시점에만 머지

## 커밋 컨벤션
> `태그명: 커밋 메시지` 형식이 아니면 커밋이 막힙니다. (예: `feat: 로그인 페이지 UI 구현`)

| 태그명 | 설명 |
| --- | --- |
| feat | 새로운 기능 추가 |
| fix | 버그 해결 |
| design | css 등 사용자 UI 변경 |
| !BREAKING CHANGE | 커다란 API 변경 |
| hotfix | 급하게 치명적인 버그를 고쳐야 하는 경우 |
| style | 코드 포맷 변경, 세미콜론 누락, 코드 수정이 없는 경우 |
| refactor | 프로덕션 코드 리팩토링 |
| comment | 필요한 주석 추가 및 변경 |
| docs | 문서를 수정 |
| test | 테스트 추가 |
| chore | 빌드, 테스트, 설정 업데이트 등 |
| rename | 파일 및 폴더명 수정, 옮기기 |
| remove | 파일 삭제만 진행 |
