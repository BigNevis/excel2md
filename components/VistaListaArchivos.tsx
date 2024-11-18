'use client';

import React, { useState } from 'react';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { ScrollArea, ScrollBar } from "../components/ui/scroll-area";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Download, Eye, Code, ChevronLeft, ChevronRight, FileSpreadsheet, Archive } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface Archivo {
  id: string;
  nombre: string;
  tipo: string;
  tamaño: string;
  contenido: string;
  objeto?: any;
}

interface VistaListaArchivosProps {
  archivos: Archivo[];
  onVolverSeleccion: () => void;
}

export default function VistaListaArchivos({ archivos, onVolverSeleccion }: VistaListaArchivosProps) {
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<Archivo | null>(null);
  const [objetoSeleccionado, setObjetoSeleccionado] = useState<any | null>(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 7;

  const totalPaginas = Math.ceil(archivos.length / registrosPorPagina);
  const inicioIndice = (paginaActual - 1) * registrosPorPagina;
  const archivosPaginados = archivos.slice(inicioIndice, inicioIndice + registrosPorPagina);

  const manejarDescarga = (archivo: Archivo) => {
    const blob = new Blob([archivo.contenido], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = archivo.nombre;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const manejarDescargaZip = async () => {
    const zip = new JSZip();
    archivos.forEach(archivo => {
      zip.file(archivo.nombre, archivo.contenido);
    });
    const content = await zip.generateAsync({type: "blob"});
    saveAs(content, "archivos_generados.zip");
  };

  const manejarVista = (archivo: Archivo) => {
    setArchivoSeleccionado(archivo);
    setObjetoSeleccionado(null);
  };

  const manejarVerObjeto = (objeto: any) => {
    setObjetoSeleccionado(objeto);
    setArchivoSeleccionado(null);
  };

  const manejarCerrarVista = () => {
    setArchivoSeleccionado(null);
    setObjetoSeleccionado(null);
  };

  const cambiarPagina = (pagina: number) => {
    if (pagina >= 1 && pagina <= totalPaginas) {
      setPaginaActual(pagina);
    }
  };

  const formatearTamaño = (tamaño: string) => {
    const match = tamaño.match(/^([\d.]+)\s*(\w+)$/);
    if (match) {
      const [, numero, unidad] = match;
      return `${parseFloat(numero).toFixed(2)} ${unidad}`;
    }
    return tamaño;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-purple-500 to-indigo-600 p-4">
      <Card className="w-full max-w-4xl bg-white/10 backdrop-blur-md border-none shadow-2xl mb-4">
        <CardHeader>
          <CardTitle className="text-3xl md:text-4xl font-bold text-center text-white mb-8">
            Archivos Generados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <ScrollArea className="h-[400px] overflow-x-auto">
              <div className="w-[700px] min-w-full">
                <Table>
                  <TableHeader className="bg-white/20 sticky top-0 z-10">
                    <TableRow>
                      <TableHead className="text-white font-bold w-[40%]">Nombre del Archivo</TableHead>
                      <TableHead className="text-white font-bold w-[20%]">Tipo</TableHead>
                      <TableHead className="text-white font-bold w-[20%]">Tamaño</TableHead>
                      <TableHead className="text-white font-bold sticky right-0 bg-white/20 w-[120px]">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {archivosPaginados.map((archivo) => (
                      <TableRow key={archivo.id} className="hover:bg-white/5 transition-colors">
                        <TableCell className="text-white truncate max-w-[40%]">{archivo.nombre}</TableCell>
                        <TableCell className="text-white truncate max-w-[20%]">{archivo.tipo}</TableCell>
                        <TableCell className="text-white truncate max-w-[20%]">{formatearTamaño(archivo.tamaño)}</TableCell>
                        <TableCell className="sticky right-0 bg-white/10 w-[120px]">
                          <div className="flex justify-end space-x-1">
                            <Button onClick={() => manejarDescarga(archivo)} size="sm" variant="ghost" className="text-white hover:bg-white/20 p-1">
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button onClick={() => manejarVista(archivo)} size="sm" variant="ghost" className="text-white hover:bg-white/20 p-1">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button onClick={() => manejarVerObjeto(archivo.objeto)} size="sm" variant="ghost" className="text-white hover:bg-white/20 p-1">
                              <Code className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center mt-4 flex-wrap gap-2">
          <Button
            onClick={() => cambiarPagina(paginaActual - 1)}
            disabled={paginaActual === 1}
            variant="outline"
            className="bg-white/20 text-white border-white/30 hover:bg-white/30 disabled:bg-white/10 disabled:text-white/50"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          <span className="text-sm text-white">
            Página {paginaActual} de {totalPaginas}
          </span>
          <Button
            onClick={() => cambiarPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
            variant="outline"
            className="bg-white/20 text-white border-white/30 hover:bg-white/30 disabled:bg-white/10 disabled:text-white/50"
          >
            Siguiente
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
          <Button
            onClick={onVolverSeleccion}
            variant="outline"
            className="bg-white/20 text-white border-white/30 hover:bg-white/30"
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Volver a Selección
          </Button>
          <Button
            onClick={manejarDescargaZip}
            variant="outline"
            className="bg-white/20 text-white border-white/30 hover:bg-white/30"
          >
            <Archive className="w-4 h-4 mr-2" />
            Descargar ZIP
          </Button>
        </CardFooter>
      </Card>

      {(archivoSeleccionado || objetoSeleccionado) && (
        <Card className="w-full max-w-4xl bg-white/10 backdrop-blur-md border-none shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">
              {archivoSeleccionado ? `Vista Previa: ${archivoSeleccionado.nombre}` : 'Vista del Objeto'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] w-full rounded-md border border-white/20 p-4 bg-white/5">
              {archivoSeleccionado ? (
                <ReactMarkdown 
                  className="text-white prose prose-invert max-w-none"
                  remarkPlugins={[remarkGfm]}
                  components={{
                    table: ({node, ...props}) => (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700 my-4" {...props} />
                      </div>
                    ),
                    thead: ({node, ...props}) => <thead className="bg-gray-700" {...props} />,
                    th: ({node, ...props}) => <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" {...props} />,
                    td: ({node, ...props}) => <td className="px-6 py-4 whitespace-nowrap text-sm" {...props} />,
                  }}
                >
                  {archivoSeleccionado.contenido}
                </ReactMarkdown>
              ) : (
                <pre className="text-white whitespace-pre-wrap">
                  {JSON.stringify(objetoSeleccionado, null, 2)}
                </pre>
              )}
            </ScrollArea>
          </CardContent>
          <CardFooter className="justify-end">
            <Button onClick={manejarCerrarVista} variant="outline" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              Cerrar Vista
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}