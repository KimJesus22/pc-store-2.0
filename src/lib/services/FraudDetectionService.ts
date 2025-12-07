import exifr from 'exifr';

export interface FraudAnalysisResult {
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    reasons: string[];
    metadata?: {
        dateTaken?: Date;
        cameraModel?: string;
        software?: string;
    };
}

export class FraudDetectionService {
    /**
     * Analyzes an image file for potential fraud indicators based on EXIF metadata.
     * @param file The image file to analyze.
     * @returns Analysis result including risk level and reasons.
     */
    static async analyzeImage(file: File): Promise<FraudAnalysisResult> {
        const reasons: string[] = [];
        let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
        let metadata: any = {};

        try {
            // Parse limited tags to save performance
            const exif = await exifr.parse(file, ['DateTimeOriginal', 'Make', 'Model', 'Software']);

            if (!exif) {
                riskLevel = 'MEDIUM'; // Suspicious but common in social media downloads
                reasons.push('Metadatos EXIF no encontrados. La imagen podría ser una captura de pantalla o descargada de redes sociales.');
            } else {
                metadata = {
                    dateTaken: exif.DateTimeOriginal,
                    cameraModel: exif.Model ? `${exif.Make || ''} ${exif.Model}`.trim() : undefined,
                    software: exif.Software
                };

                // 1. Check Date Age
                if (exif.DateTimeOriginal) {
                    const dateTaken = new Date(exif.DateTimeOriginal);
                    const oneYearAgo = new Date();
                    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

                    if (dateTaken < oneYearAgo) {
                        riskLevel = 'HIGH';
                        reasons.push(`La foto es antigua (tomada el ${dateTaken.toLocaleDateString()}). Se requiere verificación manual.`);
                    }
                } else {
                    riskLevel = 'MEDIUM';
                    reasons.push('La imagen tiene EXIF, pero no fecha de captura original.');
                }

                // 2. Software Check (Photoshop etc)
                if (exif.Software && (exif.Software.toLowerCase().includes('photoshop') || exif.Software.toLowerCase().includes('gimp'))) {
                    reasons.push(`La imagen fue editada con ${exif.Software}.`);
                    // Editing doesn't always mean fraud, but increases scrutiny
                    if (riskLevel === 'LOW') riskLevel = 'MEDIUM';
                }
            }

        } catch (error) {
            console.error("Error parsing EXIF", error);
            reasons.push('Error al leer el archivo de imagen.');
        }

        return {
            riskLevel,
            reasons,
            metadata
        };
    }

    /**
     * Validates if the seller has attached a timestamp proof photo.
     * Currently checks if the file exists and is labeled correctly (client-side enforcement).
     * @param proofFile The file uploaded as timestamp proof.
     */
    static validateTimestampProof(proofFile: File | null): boolean {
        // In a real scenario, we would use OCR (Tesseract.js) here to read text.
        // For MVP, we enforce that a file is provided.
        if (!proofFile) return false;

        // Basic validation: Size > 10KB (ensure it's not empty)
        if (proofFile.size < 10240) return false;

        return true;
    }
}
