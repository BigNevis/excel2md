import React from "react";
import { Card, CardContent } from "./ui/Card";
import { Wrench } from "lucide-react";

export default function PaginaEnConstruccion() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-600 to-gray-900 p-4">
      <Card className="w-full max-w-3xl bg-white/10 backdrop-blur-md border-none shadow-2xl">
        <CardContent className="p-8 text-center">
          <Wrench className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Página en Construcción
          </h1>
          <p className="text-lg md:text-xl text-white/80 mt-4">
            Estamos trabajando en esta funcionalidad. ¡Pronto estará disponible!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
