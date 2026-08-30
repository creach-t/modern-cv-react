/**
 * Télécharge le CV en PDF (même moteur que l'ancien portfolio, @react-pdf/renderer).
 * Import dynamique : les libs PDF (lourdes) restent dans un chunk séparé.
 */
export const downloadCV = async (language, secondaryColor) => {
  const mod = await import("../services/PDFService");
  const generatePDF = mod.default;
  return generatePDF(language, {
    style: { colors: { secondary: secondaryColor } },
  });
};
