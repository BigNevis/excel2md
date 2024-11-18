'use client'

import React, { useState } from "react";
import PantallaInicio from "../components/PantallaInicio";
import CargaArchivos from "./Excel2md/carga-archivos";
import PaginaEnConstruccion from "../components/PaginaEnConstruccion";
import PaginaAnalisisIA from "./analisisplsql/pagina-analisis-ia";
import ProjectTimelineView from "./roadmap/project-timeline-view";
import AIAnalysisView from "../components/ai-analysis-view";

export default function App() {
  const [pantallaActual, setPantallaActual] = useState<"inicio" | "carga" | "construccion" | "analisis" | "timeline" | "ai-analysis">("inicio");
  const [aiAnalysisData, setAIAnalysisData] = useState<any>(null);

  const navegarAPantalla = (pantalla: "inicio" | "carga" | "construccion" | "analisis" | "timeline" | "ai-analysis") => {
    setPantallaActual(pantalla);
  };

  const handleAIAnalysis = (data: any) => {
    setAIAnalysisData(data);
    navegarAPantalla("ai-analysis");
  };

  const handleSendToAI = async (prompt: string) => {
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar datos a la IA');
      }

      const result = await response.json();
      console.log("Respuesta de la IA:", result);
      // Aquí puedes manejar la respuesta de la IA, por ejemplo, mostrándola en un nuevo componente
    } catch (error) {
      console.error("Error al enviar datos a la IA:", error);
      // Aquí puedes manejar el error, por ejemplo, mostrando un mensaje al usuario
    }
  };

  return (
    <>
      {pantallaActual === "inicio" && (
        <PantallaInicio
          onTransformarClick={() => navegarAPantalla("carga")}
          onAnalizarClick={() => navegarAPantalla("analisis")}
          onTimelineClick={() => navegarAPantalla("timeline")}
        />
      )}
      {pantallaActual === "carga" && (
        <CargaArchivos
          onVolverInicio={() => navegarAPantalla("inicio")}
          onSiguiente={() => navegarAPantalla("construccion")}
        />
      )}
      {pantallaActual === "construccion" && (
        <PaginaEnConstruccion
          onVolverInicio={() => navegarAPantalla("inicio")}
        />
      )}
      {pantallaActual === "analisis" && (
        <PaginaAnalisisIA
          onVolver={() => navegarAPantalla("inicio")}
          onSiguiente={() => navegarAPantalla("construccion")}
        />
      )}
      {pantallaActual === "timeline" && (
        <ProjectTimelineView
          onVolverInicio={() => navegarAPantalla("inicio")}
          onAIAnalysis={handleAIAnalysis}
        />
      )}
      {pantallaActual === "ai-analysis" && (
        <AIAnalysisView
          data={aiAnalysisData}
          onVolverTimeline={() => navegarAPantalla("timeline")}
          onSendToAI={handleSendToAI}
        />
      )}
    </>
  );
}