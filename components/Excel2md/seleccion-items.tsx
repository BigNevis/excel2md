'use client';

import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Button } from "../ui/Button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/Card";
import { Checkbox } from "../ui/checkbox";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import VistaListaArchivos from './VistaListaArchivos';
import { ArrowLeft, FileSpreadsheet } from 'lucide-react';

interface SeleccionItemsProps {
  file: File | null;
  onPrevious: () => void;
}

interface Archivo {
  id: string;
  nombre: string;
  tipo: string;
  tamaño: string;
  contenido: string;
  objeto: any;
}

const encabezados = [
  "Fila",
  "Nombre de servicio",
  "EndPoint",
  "Tipo",
  "Pantalla",
  "Nombre",
  "Consideraciones de seguridad",
  "Momento de ejecución",
  "Descripción",
  "Observaciones adicionales",
  "Codigo encontrado o sugerido",
  "Input.Parámetro",
  "Input.Tipo",
  "Input.Mandatorio",
  "Input.Descripción",
  "Input.Ejemplos",
  "Input.Owner",
  "Input.Tabla",
  "Input.Columna",
  "Output.Parámetro",
  "Output.Tipo",
  "Output.Mandatorio",
  "Output.Descripción",
  "Output.Ejemplos",
  "Output.Owner",
  "Output.Tabla",
  "Output.Columna",
  "Array.Nombre",
  "Array.Tipo",
  "Array.Mandatorio",
  "Array.Descripción",
  "Array.Ejemplo",
  "Array.Owner",
  "Array.Tabla",
  "Array.Columna",
  "Error/Recovery Handling.Return/Error Code",
  "Error/Recovery Handling.Message",
  "Error/Recovery Handling.Description",
  "json.Input",
  "json.Output",
];

export default function SeleccionItems({ file, onPrevious }: SeleccionItemsProps) {
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [selectedSheets, setSelectedSheets] = useState<string[]>([]);
  const [archivosGenerados, setArchivosGenerados] = useState<Archivo[]>([]);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          const data = new Uint8Array(event.target.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          setSheetNames(workbook.SheetNames);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }, [file]);

  const generarTabla = (headers: string[], valores: string[][]): string => {
    if (valores.length === 0) {
      return "| Sin datos |\n|-----------|\n";
    }

    let tabla = `| ${headers.join(' | ')} |\n`;
    tabla += `| ${headers.map(() => '---').join(' | ')} |\n`;

    valores.forEach((fila) => {
      tabla += `| ${fila.map(v => v || 'Sin contenido').join(' | ')} |\n`;
    });

    return tabla;
  };

  const handleGenerateMarkdown = () => {
    if (!file || selectedSheets.length === 0) {
      alert('Por favor selecciona al menos una hoja');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && event.target.result) {
        const data = new Uint8Array(event.target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        const archivos: Archivo[] = [];

        selectedSheets.forEach((sheetName) => {
          const sheet = workbook.Sheets[sheetName];
          const rows: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

          const dataRows = rows.slice(2); // Leer desde fila 3

          dataRows.forEach((row, index) => {
            let contenidoMd = "";

            // Agregar información general
            encabezados.slice(0, 10).forEach((header, colIndex) => {
              const value = row[colIndex] || 'Sin contenido';
              contenidoMd += `### ${header}\n${value}\n\n`;
            });

            // Código encontrado o sugerido
            const sqlCode = row[10] || 'Sin contenido';
            contenidoMd += `### Codigo encontrado o sugerido\n\`\`\`sql\n${sqlCode}\n\`\`\`\n\n`;

            // Generar tablas para Input, Output, y Array
            ["Input", "Output", "Array"].forEach((section) => {
              const sectionHeaders = encabezados.filter(h => h.startsWith(section));
              const valoresGrupo = sectionHeaders.map((header) => {
                const colIndex = encabezados.indexOf(header);
                const cellValue = row[colIndex];
                return typeof cellValue === "string"
                  ? cellValue.split('\r\n')
                  : ['Sin contenido'];
              });

              // Construir filas para la tabla
              const filas = [];
              for (let i = 0; i < valoresGrupo[0]?.length || 0; i++) {
                const fila = valoresGrupo.map(v => v[i] || 'Sin contenido');
                filas.push(fila);
              }

              contenidoMd += `### ${section}\n`;
              contenidoMd += generarTabla(
                sectionHeaders.map(h => h.split(".")[1]),
                filas
              );
              contenidoMd += "\n";
            });

            // JSON Input y Output
            ["json.Input", "json.Output"].forEach((jsonKey) => {
              const jsonData = row[encabezados.indexOf(jsonKey)] || "{}";
              contenidoMd += `### ${jsonKey}\n\`\`\`json\n${jsonData}\n\`\`\`\n\n`;
            });

            const nombreServicio = row[1] || 'SinNombreServicio';
            const endPoint = row[2] || 'SinEndPoint';
            const fila = `Fila${index + 3}`; // Fila empieza desde 3
            const paquete = sheetName;

            archivos.push({
              id: `${paquete}-${fila}-${nombreServicio}-${endPoint}`,
              nombre: `${paquete}-${fila}-${nombreServicio}-${endPoint}.md`,
              tipo: 'Markdown',
              tamaño: `${contenidoMd.length / 1024} KB`,
              contenido: contenidoMd,
              objeto: contenidoMd,
            });
          });
        });

        setArchivosGenerados(archivos);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSheetToggle = (sheetName: string) => {
    setSelectedSheets((prev) =>
      prev.includes(sheetName) ? prev.filter((name) => name !== sheetName) : [...prev, sheetName]
    );
  };

  const handleVolverSeleccion = () => {
    setArchivosGenerados([]);
  };

  if (archivosGenerados.length > 0) {
    return <VistaListaArchivos archivos={archivosGenerados} onVolverSeleccion={handleVolverSeleccion} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 p-4">
      <Card className="w-full max-w-4xl bg-white/10 backdrop-blur-md border-none shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl md:text-4xl font-bold text-center text-white mb-8">
            Seleccionar Hojas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] w-full rounded-md border border-white/20 p-4">
            <div className="space-y-4">
              {sheetNames.map((sheetName, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Checkbox
                    id={sheetName}
                    checked={selectedSheets.includes(sheetName)}
                    onCheckedChange={() => handleSheetToggle(sheetName)}
                    className="border-white/50 data-[state=checked]:bg-white data-[state=checked]:text-purple-600"
                  />
                  <label htmlFor={sheetName} className="text-sm font-medium text-white cursor-pointer">
                    <FileSpreadsheet className="w-4 h-4 inline-block mr-2" />
                    {sheetName}
                  </label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex justify-between mt-6">
          <Button
            onClick={onPrevious}
            variant="outline"
            className="bg-white/20 text-white border-white/30 hover:bg-white/30"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          <Button
            onClick={handleGenerateMarkdown}
            className="bg-white/20 text-white hover:bg-white/30 disabled:bg-white/10 disabled:text-white/50"
            disabled={selectedSheets.length === 0}
          >
            Generar Archivos
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}