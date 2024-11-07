  // 임시 키워드 데이터 (나중에 백엔드에서 받아올 예정)
  export const recommendedKeywords = ["오운완", "식단", "추천", "운동고민", "중고장터"];

  //카테고리
  export const post_up_sports = ["헬스 및 피트니스", "단체 스포츠", "개인  스포츠", "레저 및 아웃도어 스포츠", "댄스 및 퍼포먼스 운동"];
  // 카테고리 소분류
  export const post_sports: { [key: string]: string[] } = {
    "헬스 및 피트니스": [
      "헬스(웨이트 트레이닝)",
      "필라테스",
      "요가",
      "크로스핏",
      "사이클(스피닝)",
      "홈 트레이닝",
      "러닝/조깅",
      "HIIT"
    ],
    "단체 스포츠": [
      "축구",
      "농구",
      "배구",
      "풋살",
      "핸드볼",
      "럭비",
      "야구"
    ],
    "개인  스포츠": [
      "테니스",
      "배드민턴",
      "탁구",
      "골프",
      "스쿼시",
      "클라이밍",
      "격투기"
    ],
    "레저 및 아웃도어 스포츠": [
      "수영",
      "서핑",
      "스킨스쿠버",
      "스케이트보드 / 롱보드",
      "하이킹 / 트레킹",
      "스키 / 스노보드",
      "카약 / 래프팅",
      "패러글라이딩"
    ],
    "댄스 및 퍼포먼스 운동": [
      "줌바",
      "힙합댄스",
      "라틴댄스",
      "발레",
      "스트릿 댄스"
    ]
  };