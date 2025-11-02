"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

import { Plus } from "lucide-react"
import { Tabs } from "./ui/tabs"
import { TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs"

interface ProblemInputDialogProps {
  onSubmit?: (data: { title: string; description: string; code?: string }) => void
}

export function ProblemInputDialog({ onSubmit }: ProblemInputDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [code, setCode] = useState("")

  const handleSubmit = () => {
    if (title.trim() && description.trim()) {
      onSubmit?.({ title, description, code: code.trim() || undefined })
      setTitle("")
      setDescription("")
      setCode("")
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <Plus className="w-5 h-5" />
          New Problem
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Start a New Problem</DialogTitle>
          <DialogDescription>
            Share your programming problem or assignment. You can also paste your current code attempt.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="problem" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="problem">Problem Statement</TabsTrigger>
            <TabsTrigger value="code">Your Code (Optional)</TabsTrigger>
          </TabsList>

          <TabsContent value="problem" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="title">Problem Title</Label>
              <Input
                id="title"
                placeholder="e.g., Two Sum Problem, Fibonacci Sequence"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Problem Description</Label>
              <Textarea
                id="description"
                placeholder="Paste your assignment or describe the problem you're trying to solve..."
                className="min-h-[200px] font-mono text-sm"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <p className="text-xs text-muted">Include any constraints, examples, or requirements</p>
            </div>
          </TabsContent>

          <TabsContent value="code" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="code">Your Current Code</Label>
              <Textarea
                id="code"
                placeholder="// Paste your code here (optional)&#10;function solve() {&#10;  // Your attempt...&#10;}"
                className="min-h-[300px] font-mono text-sm"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <p className="text-xs text-muted">Share what you've tried so far, even if it's incomplete</p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!title.trim() || !description.trim()}>
            Start Learning
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
