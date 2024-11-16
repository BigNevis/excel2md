'use client'

import { useState, ChangeEvent } from 'react'
import { Button } from "../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Upload, File, ArrowRight } from 'lucide-react'
import SeleccionItems from './seleccion-items'

export default function CargaArchivos() {
  const [file, setFile] = useState<File | null>(null)
  const [showSeleccion, setShowSeleccion] = useState(false)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Archivo a enviar:', file)
    setShowSeleccion(true)
  }

  const handleVolverACarga = () => {
    setShowSeleccion(false)
  }

  if (showSeleccion) {
    // Pasar el archivo seleccionado al componente SeleccionItems
    return <SeleccionItems file={file} onPrevious={handleVolverACarga} />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Carga de Archivos</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file" className="text-zinc-300">Selecciona un archivo</Label>
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
                    className="w-full bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Seleccionar archivo
                  </Button>
                </div>
              </div>
              {file && (
                <div className="flex items-center space-x-2 p-2 bg-zinc-800 rounded">
                  <File className="w-4 h-4 text-zinc-300" />
                  <span className="text-sm font-medium text-zinc-300">{file.name}</span>
                </div>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white disabled:bg-zinc-900 disabled:text-zinc-600"
            disabled={!file}
            onClick={handleSubmit}
          >
            Siguiente
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
