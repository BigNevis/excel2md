'use client';

import { useState, ChangeEvent } from 'react';
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Upload, File, ArrowRight } from 'lucide-react';
import ExcelJS from 'exceljs';

export default function Component() {
  const [file, setFile] = useState<File | null>(null);
  const [sheetNames, setSheetNames] = useState<string[]>([]);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // Leer el archivo Excel usando exceljs
      const workbook = new ExcelJS.Workbook();
      const arrayBuffer = await selectedFile.arrayBuffer();
      await workbook.xlsx.load(arrayBuffer);

      // Obtener los nombres de las hojas
      const sheets = workbook.worksheets.map(sheet => sheet.name);
      setSheetNames(sheets);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Archivo a enviar:', file);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Carga de Archivos</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file">Selecciona un archivo</Label>
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
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Seleccionar archivo
                  </Button>
                </div>
              </div>
              {file && (
                <div className="flex items-center space-x-2 p-2 bg-gray-100 rounded">
                  <File className="w-4 h-4" />
                  <span className="text-sm font-medium">{file.name}</span>
                </div>
              )}
              {sheetNames.length > 0 && (
                <div className="space-y-2">
                  <Label>Hojas disponibles</Label>
                  <ul className="list-disc list-inside text-sm">
                    {sheetNames.map((name, index) => (
                      <li key={index}>{name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={!file}
            onClick={handleSubmit}
          >
            Siguiente
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
