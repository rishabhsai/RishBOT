import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScreenAnalysis } from "@/components/screen-analysis"
import { ProblemSolver } from "@/components/problem-solver"
import { EssayWriter } from "@/components/essay-writer"

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Local AI Assistant</h1>
      <Tabs defaultValue="screen" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="screen">Screen Analysis</TabsTrigger>
          <TabsTrigger value="solve">Problem Solver</TabsTrigger>
          <TabsTrigger value="write">Essay Writer</TabsTrigger>
        </TabsList>
        <TabsContent value="screen">
          <ScreenAnalysis />
        </TabsContent>
        <TabsContent value="solve">
          <ProblemSolver />
        </TabsContent>
        <TabsContent value="write">
          <EssayWriter />
        </TabsContent>
      </Tabs>
    </main>
  )
}
