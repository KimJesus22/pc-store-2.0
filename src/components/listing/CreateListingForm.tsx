"use client";

import React, { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Upload, AlertTriangle, Monitor, Cpu, Box, Image as ImageIcon } from "lucide-react";
import { FraudDetectionService } from "@/lib/services/FraudDetectionService";

// --- VALIDATION SCHEMAS ---
const baseSchema = z.object({
    title: z.string().min(10, "El título debe tener al menos 10 caracteres").max(80),
    price: z.number().min(100, "El precio mínimo es $100"),
    category: z.enum(["GPU", "CPU", "RAM", "MOTHERBOARD", "OTHER"]),
    condition: z.enum(["NEW", "USED"]),
    description: z.string().min(20, "Describe tu producto con detalle (mínimo 20 caracteres)"),
    validationLink: z.string().url("Debe ser una URL válida").optional().or(z.literal("")),
});

// Dynamic Fields Schema Extensions
const gpuSchema = z.object({
    vram: z.string().min(1, "Especifica la VRAM (ej. 8GB)"),
    chipset: z.string().min(1, "Especifica el chipset (ej. RTX 3060)"),
    lhr: z.boolean().optional(),
});

const cpuSchema = z.object({
    socket: z.string().min(1, "Especifica el socket (ej. AM4)"),
    coreCount: z.number().min(1, "Número de núcleos inválido"),
});

// Union type for the full form
const formSchema = z.discriminatedUnion("category", [
    baseSchema.extend({ category: z.literal("GPU"), ...gpuSchema.shape }),
    baseSchema.extend({ category: z.literal("CPU"), ...cpuSchema.shape }),
    baseSchema.extend({ category: z.literal("RAM") }),
    baseSchema.extend({ category: z.literal("MOTHERBOARD") }),
    baseSchema.extend({ category: z.literal("OTHER") }),
]);

type ListingsFormValues = z.infer<typeof formSchema>;

export function CreateListingForm() {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [watermarkProcessing, setWatermarkProcessing] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const form = useForm<ListingsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            condition: "USED",
            category: "GPU",
        }
    });

    const category = form.watch("category");
    const condition = form.watch("condition");

    const processWatermark = (file: File) => {
        setWatermarkProcessing(true);
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = canvasRef.current;
                if (!canvas) return;
                const ctx = canvas.getContext("2d");
                if (!ctx) return;

                // Resize for preview/upload (max 800px width)
                const scale = 800 / img.width;
                canvas.width = 800;
                canvas.height = img.height * scale;

                // Draw Image
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // Add Watermark
                ctx.save();
                ctx.globalAlpha = 0.5;
                ctx.fillStyle = "rgba(252, 227, 0, 0.3)"; // Trench yellow transparent
                ctx.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);

                ctx.globalAlpha = 1.0;
                ctx.font = "bold 30px monospace";
                ctx.fillStyle = "#FCE300";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText("GHOSTWIRE PROTECTED // " + new Date().toISOString().split('T')[0], canvas.width / 2, canvas.height / 2);
                ctx.restore();

                setImagePreview(canvas.toDataURL("image/jpeg"));
                setWatermarkProcessing(false);
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            processWatermark(file);
            // In a real app, verify EXIF here too using FraudDetectionService
            await FraudDetectionService.analyzeImage(file);
        }
    };

    const onSubmit = (data: ListingsFormValues) => {
        console.log("Form Data:", data);
        alert("Publicación creada (simulación). Revisa la consola.");
    };

    return (
        <div className="max-w-2xl mx-auto p-1">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                {/* 1. BASIC INFO */}
                <div className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Título del Producto</Label>
                        <Input placeholder="Ej. NVIDIA RTX 3080 Founders Edition" {...form.register("title")} />
                        {form.formState.errors.title && <p className="text-red-500 text-xs">{form.formState.errors.title.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Precio (MXN)</Label>
                            <Input type="number" placeholder="0.00" {...form.register("price", { valueAsNumber: true })} />
                            {form.formState.errors.price && <p className="text-red-500 text-xs">{form.formState.errors.price.message}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label>Categoría</Label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                {...form.register("category")}
                            >
                                <option value="GPU">Tarjeta Gráfica</option>
                                <option value="CPU">Procesador</option>
                                <option value="RAM">Memoria RAM</option>
                                <option value="MOTHERBOARD">Tarjeta Madre</option>
                                <option value="OTHER">Otro</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 2. DYNAMIC FIELDS */}
                {category === "GPU" && (
                    <Card className="bg-slate-900 border-trench/20">
                        <CardContent className="p-4 grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label className="text-trench">Modelo Chipset</Label>
                                <Input placeholder="Ej. RTX 3060" {...form.register("chipset")} />
                                {/* @ts-ignore */}
                                {form.formState.errors.chipset && <p className="text-red-500 text-xs">{form.formState.errors.chipset.message}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-trench">VRAM</Label>
                                <Input placeholder="Ej. 12GB GDDR6" {...form.register("vram")} />
                                {/* @ts-ignore */}
                                {form.formState.errors.vram && <p className="text-red-500 text-xs">{form.formState.errors.vram.message}</p>}
                            </div>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="lhr" className="h-4 w-4 rounded border-gray-300 text-trench focus:ring-trench" {...form.register("lhr")} />
                                <Label htmlFor="lhr" className="font-normal text-xs text-gray-400">Es versión LHR (Lite Hash Rate)?</Label>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {category === "CPU" && (
                    <Card className="bg-slate-900 border-trench/20">
                        <CardContent className="p-4 grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label className="text-trench">Socket</Label>
                                <Input placeholder="Ej. AM4" {...form.register("socket")} />
                                {/* @ts-ignore */}
                                {form.formState.errors.socket && <p className="text-red-500 text-xs">{form.formState.errors.socket.message}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-trench">Núcleos</Label>
                                <Input type="number" placeholder="6" {...form.register("coreCount", { valueAsNumber: true })} />
                                {/* @ts-ignore */}
                                {form.formState.errors.coreCount && <p className="text-red-500 text-xs">{form.formState.errors.coreCount.message}</p>}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* 3. VISUAL CONDITION SELECTOR */}
                <div className="grid gap-2">
                    <Label>Condición del Hardware</Label>
                    <div className="grid grid-cols-2 gap-4">
                        <label className={`cursor-pointer border-2 rounded-lg p-4 flex flex-col items-center gap-2 transition-all ${condition === 'NEW' ? 'border-primary bg-primary/10' : 'border-input hover:border-primary/50'}`}>
                            <input type="radio" value="NEW" className="hidden" {...form.register("condition")} />
                            <Box size={32} className={condition === 'NEW' ? 'text-primary' : 'text-gray-500'} />
                            <span className="font-bold">Nuevo (Sellado)</span>
                        </label>
                        <label className={`cursor-pointer border-2 rounded-lg p-4 flex flex-col items-center gap-2 transition-all ${condition === 'USED' ? 'border-trench bg-trench/10' : 'border-input hover:border-trench/50'}`}>
                            <input type="radio" value="USED" className="hidden" {...form.register("condition")} />
                            <Cpu size={32} className={condition === 'USED' ? 'text-trench' : 'text-gray-500'} />
                            <span className="font-bold">Usado</span>
                        </label>
                    </div>
                </div>

                {/* 4. VALIDATION LINK (OPTIONAL) */}
                <div className="grid gap-2">
                    <Label>Link de Validación (Opcional)</Label>
                    <div className="relative">
                        <ShieldCheck className="absolute left-3 top-2.5 h-5 w-5 text-green-500" />
                        <Input className="pl-10" placeholder="https://valid.x86.fr/..." {...form.register("validationLink")} />
                    </div>
                    <p className="text-xs text-muted-foreground">URL de CPU-Z, 3DMark o similar.</p>
                    {/* @ts-ignore */}
                    {form.formState.errors.validationLink && <p className="text-red-500 text-xs">{form.formState.errors.validationLink.message}</p>}
                </div>

                {/* 5. IMAGE WATERMARKING */}
                <div className="grid gap-2">
                    <Label>Fotografías (Protección Automática)</Label>
                    <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 flex flex-col items-center justify-center bg-black/50">
                        <canvas ref={canvasRef} className="hidden" />
                        {imagePreview ? (
                            <div className="relative w-full">
                                <img src={imagePreview} alt="Preview" className="w-full rounded border border-trench shadow-lg mb-4" />
                                <Button type="button" variant="secondary" size="sm" onClick={() => setImagePreview(null)}>Cambiar Imagen</Button>
                            </div>
                        ) : (
                            <>
                                <Upload className="h-10 w-10 text-gray-400 mb-4" />
                                <p className="text-sm text-gray-500 mb-2">Arrastra tus fotos aquí o haz clic para subir</p>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    id="image-upload"
                                    onChange={handleImageUpload}
                                />
                                <Button type="button" variant="outline" onClick={() => document.getElementById('image-upload')?.click()}>
                                    Seleccionar Archivos
                                </Button>
                            </>
                        )}
                        {watermarkProcessing && <p className="text-trench text-sm mt-2 animate-pulse">Aplicando Marca de Agua Segura...</p>}
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label>Descripción</Label>
                    <Textarea placeholder="Incluye detalles sobre tiempo de uso, mantenimiento, etc." {...form.register("description")} />
                    {form.formState.errors.description && <p className="text-red-500 text-xs">{form.formState.errors.description.message}</p>}
                </div>

                <Button type="submit" className="w-full bg-trench text-black font-bold h-12 text-lg hover:bg-yellow-400">
                    PUBLICAR ANUNCIO
                </Button>
            </form>
        </div>
    );
}
