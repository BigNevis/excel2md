import React from "react";
import { Button } from "./ui/Button";
import { Card, CardContent } from "./ui/Card";
import { ArrowRight, FileSpreadsheet, Brain } from "lucide-react";

interface PantallaInicioProps {
  onTransformarClick: () => void;
  onAnalizarClick: () => void;
}

export default function PantallaInicio({ onTransformarClick, onAnalizarClick }: PantallaInicioProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 p-4">
      <Card className="w-full max-w-4xl bg-white/10 backdrop-blur-md border-none shadow-2xl">
        <CardContent className="p-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-white mb-6">
            Bienvenido a Excel2md
          </h1>
          <p className="text-lg md:text-xl text-center text-white/80 mb-8">
            Selecciona la acción que deseas realizar:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={onTransformarClick}
              className="group relative overflow-hidden rounded-lg p-0.5 transition-all duration-300 hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 transition-transform group-hover:scale-[1.02]" />
              <div className="relative flex bg-black/5 backdrop-blur-sm p-6">
                <FileSpreadsheet className="h-8 w-8 flex-shrink-0 text-white" />
                <div className="ml-4 flex-1 overflow-hidden">
                  <h2 className="text-xl font-semibold text-white mb-1 truncate">
                    Transformar archivos Excel
                  </h2>
                  <p className="text-sm text-white/90 line-clamp-2">
                    Convierte tus hojas de cálculo en documentos markdown
                  </p>
                </div>
                <ArrowRight className="ml-4 h-6 w-6 flex-shrink-0 text-white opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>

            <button
              onClick={onAnalizarClick}
              className="group relative overflow-hidden rounded-lg p-0.5 transition-all duration-300 hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-yellow-500 transition-transform group-hover:scale-[1.02]" />
              <div className="relative flex bg-black/5 backdrop-blur-sm p-6">
                <Brain className="h-8 w-8 flex-shrink-0 text-white" />
                <div className="ml-4 flex-1 overflow-hidden">
                  <h2 className="text-xl font-semibold text-white mb-1 truncate">
                    Analizar PL con IA
                  </h2>
                  <p className="text-sm text-white/90 line-clamp-2">
                    Utiliza inteligencia artificial para analizar tus datos
                  </p>
                </div>
                <ArrowRight className="ml-4 h-6 w-6 flex-shrink-0 text-white opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
