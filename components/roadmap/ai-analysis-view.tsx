'use client';

import React, { useState } from 'react';
import { Button } from "../ui/Button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/Card";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { ArrowLeft, Send, Edit, Save } from 'lucide-react';
import RespuestaIA from './RespuestaIA';
import { useToast } from "../ui/use-toast";
import { ScrollArea } from "../ui/scroll-area";

const promptPredefinido = `Analiza la siguiente información del proyecto y proporciona un informe detallado que incluya:

1. Resumen general del proyecto:
   - Número total de tareas
   - Distribución de tareas por estado (No iniciado, En Progreso, Implementado, etc.)
   - Porcentaje de tareas completadas vs. pendientes

2. Análisis de tiempos:
   - Tiempo promedio de completación de tareas por ambiente (DEV, TEST, UAT, PROD)
   - Identificación de cuellos de botella o retrasos significativos
   - Comparación entre fechas estimadas y fechas reales de implementación

3. Análisis de equipos y asignaciones:
   - Distribución de tareas por equipo o persona asignada
   - Identificación de equipos o personas con mayor carga de trabajo

4. Análisis de prioridades y tipos de migración:
   - Distribución de tareas por prioridad
   - Distribución de tareas por tipo de migración
   - Correlación entre prioridad y tiempo de completación

5. Identificación de riesgos:
   - Tareas bloqueadas o con problemas recurrentes
   - Áreas del proyecto con mayor probabilidad de retrasos

6. Recomendaciones:
   - Sugerencias para mejorar la eficiencia del proyecto
   - Áreas que requieren atención inmediata
   - Estrategias para optimizar el flujo de trabajo

Por favor, proporciona este análisis en un formato claro y estructurado, utilizando datos cuantitativos cuando sea posible y ofreciendo insights cualitativos basados en la información proporcionada.`;

interface AIAnalysisViewProps {
  data: any;
  onVolverTimeline: () => void;
}

export default function AIAnalysisView({ data, onVolverTimeline }: AIAnalysisViewProps) {
  const [prompt, setPrompt] = useState(promptPredefinido);
  const [respuestaIA, setRespuestaIA] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [editandoPrompt, setEditandoPrompt] = useState(false);
  const { toast } = useToast();

  const handleEnviar = async () => {
    setCargando(true);
    try {
      const textoCompleto = `${prompt}\n\nDatos del proyecto:\n${JSON.stringify(data, null, 2)}`;
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: textoCompleto }],
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta de la API');
      }

      const responseData = await response.json();
      setRespuestaIA(responseData.choices[0].message.content);
    } catch (error) {
      console.error('Error al enviar a la API:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al procesar tu solicitud. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setCargando(false);
    }
  };

  const toggleEditPrompt = () => {
    setEditandoPrompt(!editandoPrompt);
  };

  if (respuestaIA) {
    return <RespuestaIA respuesta={respuestaIA} onVolver={() => setRespuestaIA(null)} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 p-4">
      <Card className="w-full max-w-4xl bg-white/10 backdrop-blur-md border-none shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl md:text-4xl font-bold text-center text-white mb-8">
            Análisis del Proyecto con IA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="prompt" className="text-white">Prompt</Label>
              <Button
                onClick={toggleEditPrompt}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                {editandoPrompt ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
              </Button>
            </div>
            <ScrollArea className="h-[200px] w-full rounded-md border border-white/20">
              {editandoPrompt ? (
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[200px] w-full bg-white/5 text-white placeholder-white/50 border-none resize-none"
                />
              ) : (
                <div className="p-4 text-white">
                  {prompt}
                </div>
              )}
            </ScrollArea>
          </div>
          <div className="space-y-2">
            <Label htmlFor="projectData" className="text-white">Datos del Proyecto</Label>
            <ScrollArea className="h-[200px] w-full rounded-md border border-white/20">
              <div className="p-4 font-mono text-white">
                {JSON.stringify(data, null, 2)}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={onVolverTimeline} variant="outline" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a la línea de tiempo
          </Button>
          <Button 
            onClick={handleEnviar} 
            disabled={cargando} 
            className="bg-white/20 text-white hover:bg-white/30"
          >
            {cargando ? 'Analizando...' : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Enviar a IA
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}