
export const getBadgeGrade = (score: number): string => {
    if (score >= 100) return "다이아";
    if (score >= 70) return "플래티넘";
    if (score >= 50) return "골드";
    if (score >= 30) return "실버";
    if (score >= 10) return "브론즈";
    return "등급 없음"; 
};
