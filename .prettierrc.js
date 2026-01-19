module.exports = {
  semi: false,
  trailingComma: "es5",
  printWidth: 80, //  줄 바꿈 할 폭 길이
  proseWrap: "preserve", // markdown 텍스트의 줄바꿈 방식 (v1.8.2)
  jsxBracketSameLine: true, // JSX의 마지막 `>`를 다음 줄로 내릴지 여부
  arrowParens: "avoid", // 화살표 함수 괄호 사용 방식
  bracketSpacing: true, // 객체 리터럴에서 괄호에 공백 삽입 여부
  filepath: "", // parser를 유추할 수 있는 파일을 지정
  rangeStart: 0, // 포맷팅을 부분 적용할 파일의 시작 라인 지정
  rangeEnd: Infinity, // 포맷팅 부분 적용할 파일의 끝 라인 지정,
  //plugins: [require.resolve("tailwind-prettier")],
}
