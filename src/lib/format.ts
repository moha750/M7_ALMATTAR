const ar = new Intl.NumberFormat("ar-SA");

/** «عمل واحد»، «عملان»، «٣ أعمال»، «١٦ عملًا». */
export function worksLabel(n: number): string {
  if (n === 0) return "قريبًا";
  if (n === 1) return "عمل واحد";
  if (n === 2) return "عملان";
  if (n <= 10) return `${ar.format(n)} أعمال`;
  return `${ar.format(n)} عملًا`;
}

/** ١، ٢… (بلا صفر بادئ — «٠» العربي يُقرأ نقطة) */
export function indexLabel(i: number): string {
  return ar.format(i);
}
