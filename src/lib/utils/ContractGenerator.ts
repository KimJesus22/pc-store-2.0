import { jsPDF } from "jspdf";

interface ContractData {
    orderId: string;
    buyerName: string;
    sellerName: string;
    productTitle: string;
    productSerial?: string;
    price: number;
    date: Date;
}

export const generateContract = (data: ContractData) => {
    const doc = new jsPDF();
    const margin = 20;
    let y = margin;

    // --- HEADER ---
    doc.setFont("courier", "bold");
    doc.setFontSize(22);
    doc.text("GHOSTWIRE MX", margin, y);

    doc.setFontSize(10);
    doc.setFont("courier", "normal");
    const dateStr = data.date.toLocaleString('es-MX', { timeZone: 'America/Mexico_City' });
    doc.text(`FECHA DE EMISIÓN: ${dateStr.toUpperCase()}`, margin, y + 8);

    doc.setLineWidth(0.5);
    doc.line(margin, y + 12, 190, y + 12);

    y += 30;

    // --- TITLE ---
    doc.setFont("times", "bold");
    doc.setFontSize(16);
    doc.text("CONTRATO DE COMPRAVENTA MERCANTIL SIMPLIFICADO", 105, y, { align: "center" });

    y += 20;

    // --- BODY ---
    doc.setFont("times", "normal");
    doc.setFontSize(12);
    const lineHeight = 7;

    const text = `
    Por medio del presente documento digital, se certifica la transacción de compraventa realizada a través de la plataforma GhostWire MX.
    
    EL VENDEDOR: ${data.sellerName.toUpperCase()}
    EL COMPRADOR: ${data.buyerName.toUpperCase()}
    
    OBJETO DE LA TRANSACCIÓN:
    Se transmite la propiedad del bien descrito a continuación, libre de todo gravamen y vicios ocultos conocidos al momento de la venta, salvo los descritos explícitamente en la publicación.
    
    PRODUCTO: ${data.productTitle.toUpperCase()}
    ${data.productSerial ? `NÚMERO DE SERIE: ${data.productSerial}` : "NÚMERO DE SERIE: N/A"}
    
    VALOR DE LA OPERACIÓN:
    $${data.price.toLocaleString('es-MX')} MXN (Pesos Mexicanos).
    
    DECLARACIONES:
    1. Ambas partes reconocen la validez de este contrato digital generado por GhostWire MX.
    2. El VENDEDOR garantiza que el producto es de su legítima propiedad.
    3. El COMPRADOR acepta el estado del producto tal cual se presentó en la plataforma.
    `;

    const splitText = doc.splitTextToSize(text, 170);
    doc.text(splitText, margin, y);

    // --- SIGNATURES (SIMULATED) ---
    y += 120; // Move down

    doc.setLineWidth(0.2);
    doc.line(margin, y, 90, y);
    doc.line(120, y, 190, y);

    doc.setFontSize(10);
    doc.text("FIRMA DIGITAL DEL VENDEDOR", margin + 10, y + 5);
    doc.text("FIRMA DIGITAL DEL COMPRADOR", 130, y + 5);

    // --- FOOTER (HASH) ---
    const pageHeight = doc.internal.pageSize.height;
    doc.setFont("courier", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100);

    doc.text(`HASH DE TRANSACCIÓN INDELEBLE: ${data.orderId}`, margin, pageHeight - 20);
    doc.text("Documento generado automáticamente por GhostWire MX secure systems.", margin, pageHeight - 15);
    doc.text("Este archivo representa prueba legal de propiedad bajo el Código Civil Federal.", margin, pageHeight - 10);

    // --- EASTER EGG ---
    doc.setFontSize(5);
    doc.setTextColor(200);
    doc.text('"Promises and contracts I used to keep. - Breach Protocol v.2025"', margin, pageHeight - 5);

    // Save
    doc.save(`GW_Contract_${data.orderId.substring(0, 8)}.pdf`);
};
