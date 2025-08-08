// 가치관
export const VALUE_ENUM_TO_LABEL = {
  SURVIVAL: "생존형",
  STABILITY: "안정형",
  GROWTH: "성장형",
  HIGH_RETURN: "고수익형",
};

export const VALUE_LABEL_TO_ENUM = Object.fromEntries(
  Object.entries(VALUE_ENUM_TO_LABEL).map(([k, v]) => [v, k])
);

export const VALUE_CHIPS = ["생존형", "안정형", "성장형", "고수익형"];

export const VALUE_SECTION_SUMMARY =
  "투자 목적(가치관): 앞으로 어떤 방향으로 투자하고 싶은지를 나타내요. 낮은 값일수록 낮은 위험/낮은 수익, 높은 값일수록 높은 위험/높은 수익을 선호해요.";

// 각 타입 설명
export const VALUE_DESCRIPTIONS = {
  생존형:
    "낮은 수익률이더라도 손실 없는 상품을 선택하는 것이 더 중요하다고 생각해요.",
  안정형: "높은 수익률을 원하지만 손실이 적은 안정적인 상품을 선택하고 싶어요.",
  성장형: "높은 수익률을 원하지만 아직 과감한 투자는 망설여져요. 계속 도전 중…",
  고수익형: "높은 수익률을 위해 과감한 투자도 마다하지 않는 성향이에요.",
};

// 재정 체력
export const FINANCE_TOLERANCE_PERCENT_BY_LEVEL = {
  0: 0,
  1: 5,
  2: 10,
  3: 20,
};

export const FINANCE_SECTION_SUMMARY =
  "리스크 허용도(재정 체력): 잃어도 되는 돈의 범위를 의미해요. 수치가 높을수록 더 큰 손실도 감수할 수 있어요.";

export const FINANCE_LEVEL_DESCRIPTIONS = {
  0: "리스크는 하나도 허용할 수 없어!",
  1: "조금은 괜찮아요. 5% 정도 손해까지는 감수할 수 있어요!",
  2: "약간의 손해는 괜찮아요. 10% 정도는 괜찮다고 생각해요.",
  3: "나는 강심장이니까… 20% 잃어도 울지 않아!",
};

export const getFinanceDescription = (level) =>
  FINANCE_LEVEL_DESCRIPTIONS?.[level] ?? "";

// 속도
export const SPEED_ENUM_TO_LABEL = {
  FAST: "빠름",
  MEDIUM: "중간",
  SLOW: "느림",
  VERY_SLOW: "매우 느림",
};

export const SPEED_LABEL_TO_ENUM = Object.fromEntries(
  Object.entries(SPEED_ENUM_TO_LABEL).map(([k, v]) => [v, k])
);

export const SPEED_CHIPS = ["매우 느림", "느림", "중간", "빠름"];

export const SPEED_SECTION_SUMMARY =
  "투자 기간(속도): 단타/장타 등 보유 기간 선호를 의미해요. 아주 느릴수록 장기투자, 빠를수록 단기 매매를 선호해요.";

export const SPEED_RANGE_HINT = {
  "매우 느림": "3년 초과",
  느림: "1년 초과 ~ 3년 이하",
  중간: "1개월 초과 ~ 1년 이하",
  빠름: "1개월 이하",
};

export const SPEED_DESCRIPTIONS = {
  빠름: "한 달 안에 빨리빨리 거래하고 싶어요.",
  중간: "1년 정도라면 기다릴 수 있어요. 너무 짧지도, 길지도 않은 게 좋아요.",
  느림: "3년까지는 괜찮아요. 어느 정도 시간이 걸려도 기다릴 수 있어요.",
  "매우 느림": "3년 넘게 푹 묵혀도 괜찮아요.",
};

// 운/전략
export const LUCK_STRATEGY_ENUM_TO_LABEL = {
  LUCK: "운",
  STRATEGY: "전략",
};

export const LUCK_STRATEGY_LABEL_TO_ENUM = Object.fromEntries(
  Object.entries(LUCK_STRATEGY_ENUM_TO_LABEL).map(([k, v]) => [v, k])
);

export const LUCK_STRATEGY_CHIPS = ["운", "전략"];

export const LUCK_STRATEGY_SECTION_SUMMARY =
  "투자 전략(운/전략): 낮은 값은 손절 라인을 정해두는 전략형, 높은 값은 손절 없이 기다리는 운형에 가까워요.";

export const LUCK_STRATEGY_DESCRIPTIONS = {
  운: "나는 딱히 전략이 없어. 운도 실력이야. 언젠가는 괜찮아지겠지~",
  전략: "저는 저만의 기준이 정해져 있어요. 일정 수준을 넘으면 손절하겠습니다.",
};

// 모험 성향
export const ADVENTURE_SECTION_SUMMARY =
  "모험 성향: 투자 이해도와 위험 선호도를 나타내요. 낮을수록 안전자산 위주, 높을수록 고위험 자산도 적극적으로 고려해요.";

export const ADVENTURE_UNDERSTANDING_DESCRIPTIONS = {
  0: "무슨 상품이 좋은지도 잘 모르겠어요... 그래서 일단은 안전한 쪽으로만 골라두고 있어요.",
  1: "아직은 투자에 확신이 없지만, 조금씩 관심을 갖고 있어요. 너무 위험한 건 불안해서 피하고, 안정성과 수익 사이에서 고민 중이에요.",
  2: "정확히는 모르겠어요. 그냥 적당한 리스크까지는 괜찮을 것 같아요. 너무 높으면 무섭고…",
  3: "나는 거의 투자 전문가~ 투자 경험도 많고, 투자에 대한 이해도도 뛰어나지!",
};

export const ADVENTURE_RISK_PREFERENCE_HINT =
  "낮은 값: 예·적금 등 안정자산 선호 / 높은 값: 펀드 등 고위험 자산도 고려";

export const userStatDescriptions = {
  value: {
    summary: VALUE_SECTION_SUMMARY,
    chips: VALUE_CHIPS,
    descriptions: VALUE_DESCRIPTIONS,
    enumToLabel: VALUE_ENUM_TO_LABEL,
    labelToEnum: VALUE_LABEL_TO_ENUM,
  },
  speed: {
    summary: SPEED_SECTION_SUMMARY,
    chips: SPEED_CHIPS,
    descriptions: SPEED_DESCRIPTIONS,
    enumToLabel: SPEED_ENUM_TO_LABEL,
    labelToEnum: SPEED_LABEL_TO_ENUM,
    rangeHint: SPEED_RANGE_HINT,
  },
  luckStrategy: {
    summary: LUCK_STRATEGY_SECTION_SUMMARY,
    chips: LUCK_STRATEGY_CHIPS,
    descriptions: LUCK_STRATEGY_DESCRIPTIONS,
    enumToLabel: LUCK_STRATEGY_ENUM_TO_LABEL,
    labelToEnum: LUCK_STRATEGY_LABEL_TO_ENUM,
  },
  finance: {
    summary: FINANCE_SECTION_SUMMARY,
    percentByLevel: FINANCE_TOLERANCE_PERCENT_BY_LEVEL,
    getDescription: getFinanceDescription,
  },
  adventure: {
    summary: ADVENTURE_SECTION_SUMMARY,
    understandingDescriptions: ADVENTURE_UNDERSTANDING_DESCRIPTIONS,
    riskPreferenceHint: ADVENTURE_RISK_PREFERENCE_HINT,
  },
};
