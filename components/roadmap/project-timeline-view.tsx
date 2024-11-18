'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"
import { Badge } from "../ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { ScrollArea } from "../ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/Select"
import { Input } from "../ui/input"
import { Button } from "../ui/Button"
import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/Dialog"
import { motion, AnimatePresence } from "framer-motion"
import * as XLSX from 'xlsx'
import { ExternalLink, ChevronDown, ChevronRight, Home, FileText } from 'lucide-react'

interface Task {
  Proyecto: string
  TipoMigracion: string
  Prioridad: string
  Epica: string
  Descripcion: string
  Estado: string
  AsignadoA: string
  BloqueadoPor: string
  Motivos: string
  OracleForm: string
  FechaEstimadaDiscovery: string
  FechaFinDiscovery: string
  FechaInicioEstimada: string
  FechaDeInicio: string
  FechaEstimadaEnDEV: string
  FechaImpEnDev: string
  FechaEstimadaEnTEST: string
  FechaImpEnTEST: string
  FechaEstimadaEnUAT: string
  FechaUAT: string
  FechaEstimadaEnPROD: string
  FechaPROD: string
}

interface TeamData {
  name: string
  tasks: Task[]
}

interface GroupedTasks {
  [paquete: string]: Task[]
}

const environments = ['Discovery', 'DEV', 'TEST', 'UAT', 'PROD']

export default function ProjectTimelineView({ onVolverInicio, onAIAnalysis }: { onVolverInicio: () => void, onAIAnalysis: (data: any) => void }) {
  const [teams, setTeams] = useState<TeamData[]>([])
  const [activeTeam, setActiveTeam] = useState<string>('')
  const [activeEnvironment, setActiveEnvironment] = useState<string>('Discovery')
  const [openPaquetes, setOpenPaquetes] = useState<{ [key: string]: boolean }>({})
  const [availableSheets, setAvailableSheets] = useState<string[]>([])
  const [selectedSheets, setSelectedSheets] = useState<string[]>([])
  const [isSheetSelectionOpen, setIsSheetSelectionOpen] = useState(false)
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isExecutiveSummaryOpen, setIsExecutiveSummaryOpen] = useState(false)

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          console.log("Archivo cargado, comenzando a analizar...")
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const wb = XLSX.read(data, { type: 'array' })
          console.log("Libro de trabajo analizado:", wb)
          setWorkbook(wb)
          setAvailableSheets(wb.SheetNames)
          setIsSheetSelectionOpen(true)
          setError(null)
        } catch (err) {
          console.error("Error al analizar el archivo Excel:", err)
          setError("Error al leer el archivo Excel. Por favor, asegúrese de que es un archivo válido.")
        }
      }
      reader.onerror = (err) => {
        console.error("Error al leer el archivo:", err)
        setError("Error al leer el archivo. Por favor, inténtelo de nuevo.")
      }
      reader.readAsArrayBuffer(file)
    }
  }, [])

  const handleSheetSelection = useCallback(() => {
    if (workbook) {
      try {
        console.log("Iniciando selección de hojas...")
        const newTeams: TeamData[] = selectedSheets.map(sheetName => {
          console.log(`Procesando hoja: ${sheetName}`)
          const worksheet = workbook.Sheets[sheetName]
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
          const tasks: Task[] = jsonData.slice(1).map((row: any) => ({
            Proyecto: row[0] || '',
            TipoMigracion: row[1] || '',
            Prioridad: row[2] || '',
            Epica: row[3] || '',
            Descripcion: row[4] || '',
            Estado: row[5] || '',
            AsignadoA: row[6] || '',
            BloqueadoPor: row[7] || '',
            Motivos: row[8] || '',
            OracleForm: row[9] || '',
            FechaEstimadaDiscovery: row[10] || '',
            FechaFinDiscovery: row[11] || '',
            FechaInicioEstimada: row[12] || '',
            FechaDeInicio: row[13] || '',
            FechaEstimadaEnDEV: row[14] || '',
            FechaImpEnDev: row[15] || '',
            FechaEstimadaEnTEST: row[16] || '',
            FechaImpEnTEST: row[17] || '',
            FechaEstimadaEnUAT: row[18] || '',
            FechaUAT: row[19] || '',
            FechaEstimadaEnPROD: row[20] || '',
            FechaPROD: row[21] || ''
          }))
          return { name: sheetName, tasks }
        })
  
        setTeams(newTeams)
        if (newTeams.length > 0) {
          setActiveTeam(newTeams[0].name)
        }
        setError(null)
      } catch (err) {
        console.error("Error al procesar las hojas:", err)
        setError("Error al procesar las hojas seleccionadas. Por favor, inténtelo de nuevo.")
      }
    }
    setIsSheetSelectionOpen(false)
  }, [workbook, selectedSheets])

  const getTasksForEnvironment = useCallback((tasks: Task[], environment: string) => {
    console.log(`Filtrando tareas para el entorno: ${environment}`)
    switch (environment) {
      case 'Discovery':
        return tasks.filter(task => task.FechaFinDiscovery && task.FechaFinDiscovery !== 'NA')
      case 'DEV':
        return tasks.filter(task => task.FechaImpEnDev && task.FechaImpEnDev !== 'NA')
      case 'TEST':
        return tasks.filter(task => task.FechaImpEnTEST && task.FechaImpEnTEST !== 'NA')
      case 'UAT':
        return tasks.filter(task => task.FechaUAT && task.FechaUAT !== 'NA')
      case 'PROD':
        return tasks.filter(task => task.FechaPROD && task.FechaPROD !== 'NA')
      default:
        return tasks
    }
  }, [])

  const getDateFieldForEnvironment = (environment: string): keyof Task => {
    switch (environment) {
      case 'Discovery':
        return 'FechaEstimadaDiscovery'
      case 'DEV':
        return 'FechaEstimadaEnDEV'
      case 'TEST':
        return 'FechaEstimadaEnTEST'
      case 'UAT':
        return 'FechaEstimadaEnUAT'
      case 'PROD':
        return 'FechaEstimadaEnPROD'
      default:
        return 'FechaEstimadaEnUAT'
    }
  }

  const groupTasksByDate = useCallback((tasks: Task[], dateField: keyof Task): GroupedTasks => {
    console.log(`Agrupando tareas por fecha: ${dateField}`)
    const grouped = tasks.reduce((acc, task) => {
      const date = task[dateField] as string
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(task)
      return acc
    }, {} as { [key: string]: Task[] })

    return Object.entries(grouped)
      .sort(([dateA], [dateB]) => {
        const sprintA = parseInt(dateA.split(' ')[1])
        const sprintB = parseInt(dateB.split(' ')[1])
        return sprintA - sprintB
      })
      .reduce((acc, [date, tasks], index) => {
        acc[`Paquete ${index + 1} - ${date}`] = tasks
        return acc
      }, {} as GroupedTasks)
  }, [])

  const groupedTasks = useMemo(() => {
    console.log("Calculando tareas agrupadas")
    const tasks = teams.find(t => t.name === activeTeam)?.tasks || []
    console.log(`Tareas para el equipo ${activeTeam}:`, tasks)
    const filteredTasks = getTasksForEnvironment(tasks, activeEnvironment)
    console.log(`Tareas filtradas para ${activeEnvironment}:`, filteredTasks)
    
    const dateField = getDateFieldForEnvironment(activeEnvironment)
    return groupTasksByDate(filteredTasks, dateField)
  }, [teams, activeTeam, activeEnvironment, getTasksForEnvironment, groupTasksByDate, getDateFieldForEnvironment])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'no iniciado':
        return 'bg-gray-500'
      case 'en progreso':
        return 'bg-blue-500'
      case 'imp. dev':
        return 'bg-cyan-500'
      case 'qa dev':
        return 'bg-teal-500'
      case 'imp test':
        return 'bg-green-500'
      case 'qa test':
        return 'bg-lime-500'
      case 'pendiente uat':
        return 'bg-yellow-500'
      case 'pendiente aprobacion uat':
        return 'bg-amber-500'
      case 'pendiente implementar prod':
        return 'bg-orange-500'
      case 'implementado en prod':
        return 'bg-green-700'
      case 'bloqueado por bug':
        return 'bg-red-500'
      default:
        return 'bg-purple-500'
    }
  }

  const getDateDifference = (estimated: string, actual: string) => {
    if (!estimated || !actual || estimated === 'NA' || actual === 'NA') return 0
    const estimatedSprint = parseInt(estimated.split(' ')[1])
    const actualSprint = parseInt(actual.split(' ')[1])
    return actualSprint - estimatedSprint
  }

  const getEnvironmentDates = (task: Task, env: string) => {
    switch (env) {
      case 'Discovery':
        return {
          estimated: task.FechaEstimadaDiscovery,
          actual: task.FechaFinDiscovery
        }
      case 'DEV':
        return {
          estimated: task.FechaEstimadaEnDEV,
          actual: task.FechaImpEnDev
        }
      case 'TEST':
        return {
          estimated: task.FechaEstimadaEnTEST,
          actual: task.FechaImpEnTEST
        }
      case 'UAT':
        return {
          estimated: task.FechaEstimadaEnUAT,
          actual: task.FechaUAT
        }
      case 'PROD':
        return {
          estimated: task.FechaEstimadaEnPROD,
          actual: task.FechaPROD
        }
      default:
        return { estimated: '', actual: '' }
    }
  }

  const togglePaquete = (paquete: string) => {
    setOpenPaquetes(prev => ({
      ...prev,
      [paquete]: !prev[paquete]
    }))
  }

  const getBadgeVariant = (difference: number) => {
    return difference > 0 ? "destructive" : "secondary"
  }

  const getBadgeStyle = (difference: number) => {
    return difference <= 0 ? { backgroundColor: 'rgb(34 197 94)', color: 'white' } : {}
  }

  const calculateExecutiveSummary = () => {
    const allTasks = teams.flatMap(team => team.tasks)
    const totalTasks = allTasks.length
    const completedTasks = allTasks.filter(task => task.Estado.toLowerCase() === 'implementado en prod').length
    const delayedTasks = allTasks.filter(task => {
      const dates = getEnvironmentDates(task, 'PROD')
      return getDateDifference(dates.estimated, dates.actual) > 0
    }).length

    return {
      totalTasks,
      completedTasks,
      delayedTasks,
      completionRate: totalTasks > 0 ? (completedTasks / totalTasks * 100).toFixed(2) : '0',
      delayRate: totalTasks > 0 ? (delayedTasks / totalTasks * 100).toFixed(2) : '0'
    }
  }

  const executiveSummary = useMemo(calculateExecutiveSummary, [teams])

  const handleAIAnalysis = () => {
    const allTasks = teams.flatMap(team => team.tasks)
    onAIAnalysis(allTasks)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 p-4 md:p-8">
      <Card className="w-full max-w-6xl mx-auto bg-white/10 backdrop-blur-md border-none shadow-2xl">
        <CardHeader>
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={onVolverInicio}
            >
              <Home className="h-6 w-6" />
              <span className="sr-only">Volver al inicio</span>
            </Button>
            <CardTitle className="text-2xl md:text-3xl font-bold text-center text-white">
              Línea de Tiempo del Proyecto
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={handleAIAnalysis}
            >
              <FileText className="h-6 w-6" />
              <span className="sr-only">Análisis IA</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              className="bg-white/5 text-white border-white/20"
            />
          </div>

          {error && (
            <div className="bg-red-500 text-white p-4 rounded-md mb-4">
              {error}
            </div>
          )}

          <Dialog open={isSheetSelectionOpen} onOpenChange={setIsSheetSelectionOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Seleccionar hojas para cargar</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {availableSheets.map((sheet) => (
                  <div key={sheet} className="flex items-center space-x-2">
                    <Checkbox
                      id={sheet}
                      checked={selectedSheets.includes(sheet)}
                      onCheckedChange={(checked) => {
                        setSelectedSheets(prev =>
                          checked
                            ? [...prev, sheet]
                            : prev.filter((s) => s !== sheet)
                        )
                      }}
                    />
                    <Label htmlFor={sheet}>{sheet}</Label>
                  </div>
                ))}
              </div>
              <Button onClick={handleSheetSelection}>Cargar hojas seleccionadas</Button>
            </DialogContent>
          </Dialog>

          {teams.length > 0 && (
            <>
              <div className="mb-6 flex space-x-4">
                <Select value={activeTeam} onValueChange={setActiveTeam}>
                  <SelectTrigger className="bg-white/5 text-white border-white/20">
                    <SelectValue placeholder="Seleccionar equipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map(team => (
                      <SelectItem key={team.name} value={team.name}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Tabs value={activeEnvironment} onValueChange={setActiveEnvironment}>
                <TabsList className="grid w-full grid-cols-5 mb-4">
                  {environments.map((env) => (
                    <TabsTrigger
                      key={env}
                      value={env}
                      className="data-[state=active]:bg-purple-500/50"
                    >
                      {env}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {environments.map((env) => (
                  <TabsContent key={env} value={env}>
                    <ScrollArea className="h-[calc(100vh-400px)] pr-4">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`${activeTeam}-${env}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className="relative"
                        >
                          <div className="absolute left-4 md:left-6 top-0 bottom-0 w-0.5 bg-white/20" />
                          
                          <div className="space-y-8">
                            {Object.entries(groupedTasks).map(([paquete, tasks], paqueteIndex) => (
                              <Collapsible
                                key={paquete}
                                open={openPaquetes[paquete]}
                                onOpenChange={() => togglePaquete(paquete)}
                              >
                                <CollapsibleTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="w-full justify-between text-white hover:bg-white/10"
                                  >
                                    <span className="text-xl font-semibold">{paquete}</span>
                                    {openPaquetes[paquete] ? <ChevronDown className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
                                  </Button>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="mt-4 space-y-4">
                                  {tasks.map((task, taskIndex) => (
                                    <motion.div 
                                      key={task.Epica}
                                      initial={{ opacity: 0, y: 50 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ duration: 0.5, delay: taskIndex * 0.1 }}
                                      className="relative flex gap-4"
                                    >
                                      <div className="relative z-10 flex items-center justify-center w-8 h-8 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 shadow-lg">
                                        <span className="text-lg md:text-xl font-bold text-white">{paqueteIndex + 1}.{taskIndex + 1}</span>
                                      </div>
                                      
                                      <div className="flex-1 pt-1 md:pt-2">
                                        <h3 className="text-lg md:text-xl font-semibold text-white mb-2 flex items-center gap-2">
                                          <Badge 
                                            variant="secondary" 
                                            className={`${getStatusColor(task.Estado)} text-white`}
                                          >
                                            {task.Estado}
                                          </Badge>
                                          {task.Epica}
                                        </h3>
                                        <Card className="bg-white/5 border-none">
                                          <CardContent className="p-4 space-y-4">
                                            <div className="flex items-start gap-2 group">
                                              <Badge variant="outline" className="bg-purple-500/20 text-purple-200 border-purple-400/50">
                                                {task.OracleForm}
                                              </Badge>
                                              <span className="text-white/90 group-hover:text-white transition-colors">
                                                {task.Descripcion}
                                              </span>
                                            </div>
                                            {activeEnvironment !== 'Discovery' && (
                                              <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                  <span className="text-white/70">Asignado (QA):</span>
                                                  <Badge variant="secondary" className="ml-2">{task.AsignadoA || 'No asignado'}</Badge>
                                                </div>
                                                <div>
                                                  <span className="text-white/70">Bloqueado Por:</span>
                                                  {task.BloqueadoPor ? (
                                                    <Button
                                                      variant="link"
                                                      className="text-blue-300 hover:text-blue-100 p-0 h-auto font-normal"
                                                      onClick={() => window.open(task.BloqueadoPor, '_blank')}
                                                    >
                                                      Ver Bloqueo <ExternalLink className="w-4 h-4 ml-1" />
                                                    </Button>
                                                  ) : (
                                                    <Badge variant="secondary" className="ml-2">No bloqueado</Badge>
                                                  )}
                                                </div>
                                              </div>
                                            )}
                                            <div>
                                              <span className="text-white/70">Motivos:</span>
                                              <p className="text-white/90 mt-1">{task.Motivos || 'No especificado'}</p>
                                            </div>
                                            <div className="flex justify-between items-center">
                                              <TooltipProvider>
                                                <Tooltip>
                                                  <TooltipTrigger asChild>
                                                    <div className="flex items-center gap-2">
                                                      <span className="text-white/70">Estimado:</span>
                                                      <Badge variant="secondary">{getEnvironmentDates(task, env).estimated}</Badge>
                                                    </div>
                                                  </TooltipTrigger>
                                                  <TooltipContent side="top">
                                                    <p>Fecha estimada de {env === 'Discovery' ? 'finalización' : 'implementación'}</p>
                                                  </TooltipContent>
                                                </Tooltip>
                                              </TooltipProvider>
                                              <TooltipProvider>
                                                <Tooltip>
                                                  <TooltipTrigger asChild>
                                                    <div className="flex items-center gap-2">
                                                      <span className="text-white/70">{env === 'Discovery' ? 'Finalizado:' : 'Implementado:'}</span>
                                                      <Badge variant="secondary">{getEnvironmentDates(task, env).actual}</Badge>
                                                    </div>
                                                  </TooltipTrigger>
                                                  <TooltipContent side="top">
                                                    <p>Fecha real de {env === 'Discovery' ? 'finalización' : 'implementación'}</p>
                                                  </TooltipContent>
                                                </Tooltip>
                                              </TooltipProvider>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <span className="text-white/70">Diferencia:</span>
                                              <Badge 
                                                variant={getBadgeVariant(getDateDifference(getEnvironmentDates(task, env).estimated, getEnvironmentDates(task, env).actual))}
                                                style={getBadgeStyle(getDateDifference(getEnvironmentDates(task, env).estimated, getEnvironmentDates(task, env).actual))}
                                              >
                                                {getDateDifference(getEnvironmentDates(task, env).estimated, getEnvironmentDates(task, env).actual)} sprint(s)
                                              </Badge>
                                            </div>
                                          </CardContent>
                                        </Card>
                                      </div>
                                    </motion.div>
                                  ))}
                                </CollapsibleContent>
                              </Collapsible>
                            ))}
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </ScrollArea>
                  </TabsContent>
                ))}
              </Tabs>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={isExecutiveSummaryOpen} onOpenChange={setIsExecutiveSummaryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resumen Ejecutivo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p><strong>Total de tareas:</strong> {executiveSummary.totalTasks}</p>
            <p><strong>Tareas completadas:</strong> {executiveSummary.completedTasks}</p>
            <p><strong>Tasa de finalización:</strong> {executiveSummary.completionRate}%</p>
            <p><strong>Tareas retrasadas:</strong> {executiveSummary.delayedTasks}</p>
            <p><strong>Tasa de retraso:</strong> {executiveSummary.delayRate}%</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}