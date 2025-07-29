export const bankNameMap = {
  KB국민은행: "kb",
  신한은행: "shinhan",
  하나은행: "hana",
  우리은행: "woori",
  NH농협은행: "nh",
  IBK기업은행: "ibk",
  카카오뱅크: "kakao",
  케이뱅크: "kbank",
  SC제일은행: "sc",
  토스뱅크: "toss",
  BNK부산은행: "bnk",
  iM뱅크: "im",
};

export function getBankCodeFromName(bankName) {
  if (bankNameMap[bankName]) return bankNameMap[bankName];

  for (const [full, code] of Object.entries(bankNameMap)) {
    if (bankName.includes(full.replace("은행", "")) || full.includes(bankName))
      return code;
  }
  return bankName.charAt(0).toLowerCase();
}

export function getBankLogoPath(bankName) {
  const code = getBankCodeFromName(bankName);
  return new URL(`/src/assets/images/banks/${code}.png`, import.meta.url).href;
}
