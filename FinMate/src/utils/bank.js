import kbLogo from '@/assets/images/banks/kb.png';
import shinhanLogo from '@/assets/images/banks/shinhan.png';
import hanaLogo from '@/assets/images/banks/hana.png';
import wooriLogo from '@/assets/images/banks/woori.png';
import nhLogo from '@/assets/images/banks/nh.png';
import ibkLogo from '@/assets/images/banks/ibk.png';
import kakaoLogo from '@/assets/images/banks/kakao.png';
import kbankLogo from '@/assets/images/banks/kbank.png';
import scLogo from '@/assets/images/banks/sc.png';
import tossLogo from '@/assets/images/banks/toss.png';
import bnkLogo from '@/assets/images/banks/bnk.png';
import imLogo from '@/assets/images/banks/im.png';

const BANK_LOGOS = {
  // KB 그룹
  국민은행: kbLogo,
  KB증권: kbLogo,
  케이비자산운용: kbLogo,

  // 신한 그룹
  신한은행: shinhanLogo,
  신한투자증권: shinhanLogo,
  제주은행: shinhanLogo,

  // 하나 그룹
  하나은행: hanaLogo,
  하나증권: hanaLogo,
  하나자산운용: hanaLogo,

  // 우리 그룹
  우리은행: wooriLogo,
  우리투자증권: wooriLogo,

  // NH 농협 그룹
  농협은행: nhLogo,
  NH농협은행: nhLogo,
  NH투자증권: nhLogo,

  // IBK 그룹
  IBK기업은행: ibkLogo,
  IBK투자증권: ibkLogo,
  아이비케이투자증권: ibkLogo,
  아이비케이기업은행: ibkLogo,

  // 기타 은행들
  카카오뱅크: kakaoLogo,
  케이뱅크: kbankLogo,
  SC제일은행: scLogo,
  토스뱅크: tossLogo,
  토스증권: tossLogo,
  BNK부산은행: bnkLogo,
  부산은행: bnkLogo,
  iM뱅크: imLogo,
};

export const getBankLogo = (bankName) => {
  return BANK_LOGOS[bankName] || '/assets/images/banks/default.png';
};

export const handleImageError = (event, bankName) => {
  const bankIcon = event.target.parentElement;
  event.target.style.display = 'none';
  bankIcon.style.backgroundColor = '#f0f0f0';
  bankIcon.style.color = '#666';
  bankIcon.style.display = 'flex';
  bankIcon.style.alignItems = 'center';
  bankIcon.style.justifyContent = 'center';
  bankIcon.style.fontSize = '1.2vw';
  bankIcon.style.fontWeight = '700';
  bankIcon.textContent = bankName.charAt(0);
};

export default {
  getBankLogo,
  handleImageError,
};
