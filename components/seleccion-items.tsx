'use client'

import { useState } from 'react'
import { Button } from "../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Checkbox } from "../components/ui/checkbox"
import { ArrowLeft, ArrowRight } from 'lucide-react'

interface Item {
  id: string;
  name: string;
}

interface SeleccionItemsProps {
  onPrevious: () => void;
}

export default function SeleccionItems({ onPrevious }: SeleccionItemsProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const items: Item[] = [
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
    { id: '3', name: 'Item 3' },
    { id: '4', name: 'Item 4' },
    { id: '5', name: 'Item 5' },
  ]

  const handleItemToggle = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const handleNext = () => {
    console.log('Ítems seleccionados:', selectedItems)
    // Aquí puedes agregar la lógica para procesar los ítems seleccionados
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Selección de Ítems</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center space-x-2">
                <Checkbox
                  id={item.id}
                  checked={selectedItems.includes(item.id)}
                  onCheckedChange={() => handleItemToggle(item.id)}
                  className="border-zinc-600 text-zinc-300"
                />
                <label
                  htmlFor={item.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-300"
                >
                  {item.name}
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
            onClick={handleNext}
            disabled={selectedItems.length === 0}
            className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white disabled:bg-zinc-900 disabled:text-zinc-600"
          >
            Siguiente
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}