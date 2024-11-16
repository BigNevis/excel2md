'use client'

import { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'

import { Button } from "../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Checkbox } from "../components/ui/checkbox"
import { ArrowLeft } from 'lucide-react'

interface SeleccionItemsProps {
  file: File | null;
  onPrevious: () => void;
}

export default function SeleccionItems({ file, onPrevious }: SeleccionItemsProps) {
  const [sheetNames, setSheetNames] = useState<string[]>([])
  const [selectedSheets, setSelectedSheets] = useState<string[]>([])

  const columnNames = [
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
  ]

  const orderedFields = [
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
    "Input",
    "Output",
    "Array",
    "Error/Recovery Handling",
    "json.Input",
    "json.Output",
  ]

  useEffect(() => {
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          const data = new Uint8Array(event.target.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: 'array' })
          setSheetNames(workbook.SheetNames) // Obtenemos los nombres de las hojas
        }
      }
      reader.readAsArrayBuffer(file)
    }
  }, [file])

  const handleSheetToggle = (sheetName: string) => {
    setSelectedSheets((prev) =>
      prev.includes(sheetName)
        ? prev.filter((name) => name !== sheetName)
        : [...prev, sheetName]
    )
  }

  const handleGenerateMarkdown = () => {
    if (!file || selectedSheets.length === 0) {
      alert('Por favor selecciona al menos una hoja')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target && event.target.result) {
        const data = new Uint8Array(event.target.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })

        const formattedData: Record<string, Record<string, any>> = {}

        selectedSheets.forEach((sheetName) => {
          const sheet = workbook.Sheets[sheetName]
          const jsonData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, range: 2 })

          formattedData[sheetName] = jsonData.reduce((sheetAcc: Record<string, any>, row, index) => {
            const rowKey = `Fila${index + 3}`
            sheetAcc[rowKey] = row.reduce((rowAcc: Record<string, any>, cell, colIndex) => {
              const columnName = columnNames[colIndex] || `Columna${colIndex + 1}`
              rowAcc[columnName] = cell || ''
              return rowAcc
            }, {})
            return sheetAcc
          }, {})
        })

        // Generar archivos Markdown por cada fila
        Object.entries(formattedData).forEach(([sheetName, rows]) => {
          Object.entries(rows).forEach(([rowKey, rowValues]) => {
            let markdownContent = `# ${sheetName} - ${rowKey}\n\n`

            orderedFields.forEach((field) => {
              if (field === "Input" || field === "Output" || field === "Array" || field === "Error/Recovery Handling") {
                const relevantKeys = Object.keys(rowValues).filter((key) => key.startsWith(field))
                if (relevantKeys.length > 0) {
                  const rows = relevantKeys.reduce((acc, key) => {
                    const colValues = String(rowValues[key] || '').split('\r\n')
                    colValues.forEach((val: string, idx: number) => {
                      acc[idx] = acc[idx] || []
                      acc[idx].push(val.trim())
                    })
                    return acc
                  }, [] as string[][])

                  const headers = relevantKeys.map((key) => `| ${key} `).join('') + '|'
                  const separator = relevantKeys.map(() => '| --- ').join('') + '|'
                  const body = rows.length
                    ? rows.map((row) => row.map((cell) => `| ${cell || ''} `).join('') + '|').join('\n')
                    : '| Información no proporcionada |'.repeat(relevantKeys.length) + '|'

                  markdownContent += `### ${field}\n\n`
                  markdownContent += `${headers}\n${separator}\n${body}\n\n`
                } else {
                  markdownContent += `### ${field}\n\n| Información no proporcionada |\n| --- |\n\n`
                }
              } else if (rowValues[field]) {
                if (field === "Codigo encontrado o sugerido") {
                  markdownContent += `### ${field}\n\`\`\`sql\n${rowValues[field]}\n\`\`\`\n\n`
                } else if (field.startsWith("json.")) {
                  markdownContent += `### ${field}\n\`\`\`json\n${rowValues[field]}\n\`\`\`\n\n`
                } else {
                  markdownContent += `### ${field}\n${rowValues[field]}\n\n`
                }
              } else {
                markdownContent += `### ${field}\nInformación no proporcionada\n\n`
              }
            })

            // Crear el nombre del archivo
            const filaExcel = rowValues["Fila"] || "SinFila"
            const nombreServicio = rowValues["Nombre de servicio"] || "SinServicio"
            const endPoint = rowValues["EndPoint"] || "SinEndPoint"
            const fileName = `${sheetName} - ${filaExcel} - ${nombreServicio} - ${endPoint}.md`

            // Crear un archivo por fila
            const blob = new Blob([markdownContent], { type: 'text/markdown' })
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = fileName
            link.click()
          })
        })
      }
    }
    reader.readAsArrayBuffer(file)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <Card className="w-full max-w-3xl bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Generar Markdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sheetNames.map((sheetName, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={sheetName}
                  checked={selectedSheets.includes(sheetName)}
                  onCheckedChange={() => handleSheetToggle(sheetName)}
                  className="border-zinc-600 text-zinc-300"
                />
                <label
                  htmlFor={sheetName}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-300"
                >
                  {sheetName}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            onClick={onPrevious}
            className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          <Button
            onClick={handleGenerateMarkdown}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            Procesar y Generar Markdown
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
