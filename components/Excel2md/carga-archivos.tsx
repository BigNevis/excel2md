'use client';

import { useState, ChangeEvent } from 'react';
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Upload, File, ArrowRight, Home } from 'lucide-react';
import SeleccionItems from './seleccion-items';

interface CargaArchivosProps {
  onVolverInicio: () => void;
  onSiguiente: () => void;
}

export default function CargaArchivos({ onVolverInicio, onSiguiente }: CargaArchivosProps) {
  const [file, setFile] = useState<File | null>(null);
  const [showSeleccion, setShowSeleccion] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      setShowSeleccion(true);
    }
  };

  const handleVolverACarga = () => {
    setShowSeleccion(false);
  };

  if (showSeleccion) {
    return <SeleccionItems file={file} onPrevious={handleVolverACarga} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 p-4">
      <Card className="w-full max-w-4xl bg-white/10 backdrop-blur-md border-none shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl md:text-4xl font-bold text-center text-white mb-8">
            Carga de Archivos
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6 mb-8">
              <div className="space-y-2">
                <Label htmlFor="file" className="text-xl font-semibold text-white">Selecciona un archivo</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('file')?.click()}
                    className="w-full bg-white/20 border-white/30 text-white hover:bg-white/30 transition-colors"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Seleccionar archivo
                  </Button>
                </div>
              </div>
              {file && (
                <div className="flex items-center space-x-2 p-4 bg-white/20 rounded-md">
                  <File className="w-5 h-5 text-white" />
                  <span className="text-sm font-medium text-white">{file.name}</span>
                </div>
              )}
            </div>
          </form>
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={onVolverInicio}
              className="bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              <Home className="mr-2 h-4 w-4" />
              Volver al Inicio
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-white/20 text-white hover:bg-white/30"
              disabled={!file}
            >
              Siguiente
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}