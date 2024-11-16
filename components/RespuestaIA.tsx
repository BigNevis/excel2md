'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { ArrowLeft } from 'lucide-react';

interface RespuestaIAProps {
  respuesta: string;
  onVolver: () => void;
}

export default function RespuestaIA({ respuesta, onVolver }: RespuestaIAProps) {
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
          <div className="mt-6 flex justify-center">
            <Button onClick={onVolver} variant="outline" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Análisis
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}