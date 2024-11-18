'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { ArrowLeft, Download } from 'lucide-react';

interface RespuestaIAProps {
  respuesta: string;
  onVolver: () => void;
}

export default function RespuestaIA({ respuesta, onVolver }: RespuestaIAProps) {
  const extractServiceAndEndpoint = (text: string): { service: string; endpoint: string } => {
    const lines = text.split('\n');
    let service = 'UnknownService';
    let endpoint = 'UnknownEndpoint';

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim() === '# Nombre del servicio' && i + 1 < lines.length) {
        service = lines[i + 1].trim();
      }
      if (lines[i].trim() === '# Endpoint' && i + 1 < lines.length) {
        endpoint = lines[i + 1].trim().replace(/^\//, ''); // Remove leading slash if present
      }
      if (service !== 'UnknownService' && endpoint !== 'UnknownEndpoint') {
        break;
      }
    }

    return { service, endpoint };
  };

  const downloadMarkdown = () => {
    const { service, endpoint } = extractServiceAndEndpoint(respuesta);
    const filename = `${service}-${endpoint}.md`;
    const blob = new Blob([respuesta], { type: 'text/markdown;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 p-4">
      <Card className="w-full max-w-4xl bg-white/10 backdrop-blur-md border-none shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl md:text-4xl font-bold text-center text-white mb-8">
            Respuesta de la IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh] w-full rounded-md border border-white/20 p-4">
            <div className="text-white whitespace-pre-wrap">
              {respuesta}
            </div>
          </ScrollArea>
          <div className="mt-6 flex justify-center space-x-4">
            <Button onClick={onVolver} variant="outline" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Análisis
            </Button>
            <Button onClick={downloadMarkdown} variant="outline" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              <Download className="w-4 h-4 mr-2" />
              Descargar MD
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}