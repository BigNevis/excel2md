'use client';

import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { ArrowLeft, Send, Edit, Save } from 'lucide-react';
import RespuestaIA from './RespuestaIA';
import { useToast } from "./ui/use-toast";

const promptPredefinido = `Eres un analista experto en PL/SQL. Analiza el siguiente código y genera una respuesta en formato Markdown con los siguientes apartados: Nombre de servicio (proponer un nombre descriptivo según el propósito del PL/SQL), Endpoint (proponer un endpoint basado en la lógica del PL/SQL), Tipo (determinar el tipo de operación HTTP que corresponde: GET, POST, PUT, DELETE, etc.), Consideraciones de seguridad (si incluye "permiso=", listar los permisos y el contexto en que aparecen), Descripción (explicar en lenguaje natural y humanizado todo el PL/SQL, incluyendo los nombres exactos de los parámetros tal como aparecen en el código, entre comillas o destacados, y sin interpretarlos o reemplazarlos), Validaciones (listar las validaciones identificadas separando las de Frontend y Backend), Observaciones adicionales (proponer un código en formato Markdown de código Java para la creación del servicio basado en el análisis del PL/SQL), Código encontrado o sugerido (incluir el mismo PL/SQL enviado como entrada sin modificarlo, en formato Markdown con sintaxis SQL), Input (generar una tabla con columnas: NombreParametro, Mandatoriedad, TipoDato, Ejemplo), Output (generar una tabla con columnas: NombreParametro, Mandatoriedad, TipoDato, Ejemplo), Array (si el output es un array de objetos, generar una tabla con las mismas columnas), Manejo de errores (proponer códigos de error estándar y específicos, generar una tabla con columnas: Codigo de error, Tipo, Descripción, Ejemplo json), json.Input (generar un JSON de ejemplo basado en los parámetros de entrada), json.Output (generar un JSON de ejemplo basado en los parámetros de salida). Todo debe estar en un formato estructurado y claro. Asegúrate de incluir el PL/SQL proporcionado en el campo "Código encontrado o sugerido" exactamente como fue enviado. PL/SQL para analizar:`;

interface PaginaAnalisisIAProps {
  onVolver: () => void;
  onSiguiente: () => void;
}

export default function PaginaAnalisisIA({ onVolver, onSiguiente }: PaginaAnalisisIAProps) {
  const [prompt, setPrompt] = useState(promptPredefinido);
  const [plsql, setPlsql] = useState('');
  const [respuestaIA, setRespuestaIA] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [editandoPrompt, setEditandoPrompt] = useState(false);
  const { toast } = useToast();

  const handleEnviar = async () => {
    setCargando(true);
    try {
      const textoCompleto = `${prompt}\n\nCódigo PL/SQL:\n${plsql}`;
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

      const data = await response.json();
      setRespuestaIA(data.choices[0].message.content);
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
            Análisis con IA
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
            {editandoPrompt ? (
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[200px] bg-white/5 text-white placeholder-white/50 border-white/20"
              />
            ) : (
              <div className="bg-white/5 text-white border border-white/20 rounded-md p-2 min-h-[200px] overflow-auto">
                {prompt}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="plsql" className="text-white">Código PL/SQL</Label>
            <Textarea
              id="plsql"
              placeholder="Ingresa tu código PL/SQL aquí..."
              value={plsql}
              onChange={(e) => setPlsql(e.target.value)}
              className="min-h-[200px] bg-white/5 text-white placeholder-white/50 border-white/20 font-mono"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={onVolver} variant="outline" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <Button 
            onClick={handleEnviar} 
            disabled={!plsql.trim() || cargando} 
            className="bg-white/20 text-white hover:bg-white/30"
          >
            {cargando ? 'Enviando...' : (
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