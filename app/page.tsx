"use client"

import { useState, useEffect, useRef } from "react"
import {
  Copy,
  Maximize2,
  Video,
  VideoOff,
  X,
  Code,
  Play,
  FileText,
  Sun,
  Moon,
  Users,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

import PythonEditor,  { PythonEditorRef } from "@/components/python-editor";


export default function CodingInterviewApp() {
  const [isProblemPanelOpen, setIsProblemPanelOpen] = useState(true)
  const [isInterviewerVisible, setIsInterviewerVisible] = useState(true)
  const [isIntervieweeVisible, setIsIntervieweeVisible] = useState(true)
  const [sessionLink, setSessionLink] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("python")
  const [connectedUsers, setConnectedUsers] = useState(2) // Default to 2 users (interviewer and interviewee)
  const [isSessionLinkExpanded, setIsSessionLinkExpanded] = useState(false)
  const { toast } = useToast()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const pythonEditorRef = useRef<PythonEditorRef>(null);

  // Generate a random session ID on page load
  useEffect(() => {
    const sessionId = Math.random().toString(36).substring(2, 10)
    const link = `${window.location.origin}?session=${sessionId}`
    setSessionLink(link)
  }, [])

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  const copySessionLink = () => {
    navigator.clipboard.writeText(sessionLink)
    toast({
      title: "Link copied",
      description: "Session link copied to clipboard",
      duration: 3000,
    })
  }

  return (
    <section className="flex min-h-screen flex-col bg-background dark:bg-gray-900">
      {/* Header with session link */}
      <header className="border-b dark:border-gray-700 bg-card dark:bg-gray-800 px-4 py-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <h1 className="text-xl font-bold dark:text-white">CodeInterview</h1>

          <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
            <div className="flex items-center mr-2">
              <Users className="h-4 w-4 mr-1 text-muted-foreground dark:text-gray-400" />
              <Badge variant="outline" className="dark:text-gray-200 dark:border-gray-700">
                {connectedUsers}
              </Badge>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="mr-2 dark:border-gray-700 dark:text-gray-200"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <div className="hidden sm:flex h-9 items-center rounded-md border dark:border-gray-700 bg-muted dark:bg-gray-800 px-3 text-sm flex-1 sm:flex-initial max-w-[200px] md:max-w-[500px]">
              <span className="text-muted-foreground dark:text-gray-400">Session:</span>
              <span className="ml-2 select-all truncate dark:text-gray-200">{sessionLink}</span>
            </div>

            <div className="sm:hidden flex items-center w-full">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSessionLinkExpanded(!isSessionLinkExpanded)}
                className="dark:text-gray-300"
              >
                {isSessionLinkExpanded ? "Hide Session Link" : "Show Session Link"}
                {isSessionLinkExpanded ? (
                  <ChevronUp className="ml-1 h-4 w-4" />
                ) : (
                  <ChevronDown className="ml-1 h-4 w-4" />
                )}
              </Button>
            </div>

            {isSessionLinkExpanded && (
              <div className="sm:hidden w-full p-2 bg-muted dark:bg-gray-800 rounded-md border dark:border-gray-700 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground dark:text-gray-400">Session Link:</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copySessionLink}
                    className="dark:border-gray-700 dark:text-gray-200"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-1 break-all select-all dark:text-gray-200">{sessionLink}</div>
              </div>
            )}

            <Button
              size="sm"
              variant="outline"
              onClick={copySessionLink}
              className="hidden sm:flex dark:border-gray-700 dark:text-gray-200"
            >
              <Copy className="h-4 w-4" />
              <span className="hidden md:inline">Copy</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-col overflow-auto lg:flex-row lg:overflow-hidden">
        {/* Problem description panel - Vertical accordion on mobile, side panel on desktop */}
        <div className={`flex flex-1 flex-col border-b lg:border-b-0 lg:border-r  ${isProblemPanelOpen ? "" : "lg:hidden"} lg:max-w-[600px] dark:border-gray-700`}>
          <button
            className="flex items-center justify-between bg-muted dark:bg-gray-800 px-4 py-2 lg:hidden"
            onClick={() => setIsProblemPanelOpen(!isProblemPanelOpen)}
          >
            <h2 className="font-semibold dark:text-white">Problem Description</h2>
            {isProblemPanelOpen ? (
              <ChevronUp className="h-4 w-4 dark:text-gray-300" />
            ) : (
              <ChevronDown className="h-4 w-4 dark:text-gray-300" />
            )}
          </button>

          <div className="hidden lg:flex items-center justify-between border-b bg-muted dark:bg-gray-800 dark:border-gray-700 px-4 py-2">
            <h2 className="font-semibold dark:text-white">Problem Description</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsProblemPanelOpen(false)}
              className="dark:text-gray-300"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {isProblemPanelOpen && (
            <div className="overflow-y-auto p-4 max-h-[300px] lg:max-h-none lg:flex-1 dark:bg-gray-900">
              <h3 className="text-lg font-bold dark:text-white">Two Sum</h3>
              <p className="mt-2 text-muted-foreground dark:text-gray-300">
                Given an array of integers nums and an integer target, return indices of the two numbers such that they
                add up to target.
              </p>
              <p className="mt-4 text-muted-foreground dark:text-gray-300">
                You may assume that each input would have exactly one solution, and you may not use the same element
                twice.
              </p>
              <h4 className="mt-4 font-semibold dark:text-white">Example 1:</h4>
              <pre className="mt-2 rounded-md bg-muted dark:bg-gray-800 p-2 text-sm dark:text-gray-200">
                <code>
                  Input: nums = [2,7,11,15], target = 9{"\n"}
                  Output: [0,1]{"\n"}
                  Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
                </code>
              </pre>
              <h4 className="mt-4 font-semibold dark:text-white">Example 2:</h4>
              <pre className="mt-2 rounded-md bg-muted dark:bg-gray-800 p-2 text-sm dark:text-gray-200">
                <code>
                  Input: nums = [3,2,4], target = 6{"\n"}
                  Output: [1,2]
                </code>
              </pre>
              <h4 className="mt-4 font-semibold dark:text-white">Constraints:</h4>
              <ul className="mt-2 list-inside list-disc text-muted-foreground dark:text-gray-300">
                <li>2 ≤ nums.length ≤ 10^4</li>
                <li>-10^9 ≤ nums[i] ≤ 10^9</li>
                <li>-10^9 ≤ target ≤ 10^9</li>
                <li>Only one valid answer exists.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Middle section with code editor and output */}
        <div className="flex flex-1 flex-col lg:min-w-[600px]">
          {/* Code editor toolbar */}
          <div className="flex items-center justify-between border-b bg-muted dark:bg-gray-800 dark:border-gray-700 px-4 py-2">
            <div className="flex items-center gap-2">
              {!isProblemPanelOpen && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsProblemPanelOpen(true)}
                  className="dark:text-gray-300 hidden md:block"
                >
                  <FileText className="h-4 w-4" />
                </Button>
              )}
              <select
                className="h-8 rounded-md border border-input bg-background dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 px-3 py-1 text-sm"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="dark:border-gray-700 dark:text-gray-200">
                <Code className="h-4 w-4" />
                <span className="hidden sm:inline">Format</span>
              </Button>
              <Button onClick={() => pythonEditorRef.current?.runCode()} size="sm" className="bg-green-500 text-white">
                <Play className="h-4 w-4" />
                <span className="hidden sm:inline">Run</span>
              </Button>
            </div>
          </div>

          {/* Code editor and output tabs */}
          <Tabs defaultValue="editor" className="flex-1">
            <TabsList className="mx-4 mt-2 dark:bg-gray-800">
              <TabsTrigger
                value="editor"
                className="dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-200 dark:text-gray-400"
              >
                Code Editor
              </TabsTrigger>
              <TabsTrigger
                value="output"
                className="dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-200 dark:text-gray-400"
              >
                Output
              </TabsTrigger>
            </TabsList>
            <TabsContent value="editor" className="flex-1 p-0 data-[state=active]:flex lg:h-full">
              <div className="flex-1 overflow-auto bg-muted/30 dark:bg-gray-800 p-4 font-mono text-sm min-h-[300px] dark:text-gray-200">
                {selectedLanguage === "javascript" && (
                  <pre className="text-sm">
                    {/*<code>*/}
                    {/*</code>*/}
                  </pre>
                )}
                {selectedLanguage === "python" && (
                  <pre className="text-sm">
                    <PythonEditor
                        ref={pythonEditorRef}
                        initialCode={
                      `from typing import List

def twoSum(nums: List[int], target: int) -> List[int]:
    # Write your solution here
    pass

print(twoSum(nums=[2,7,11,15], target=9))`
                    }
                    />
                  </pre>
                )}
              </div>
            </TabsContent>
            <TabsContent value="output" className="flex-1 p-0 data-[state=active]:flex lg:h-full">
              <div className="flex-1 overflow-auto bg-black p-4 font-mono text-sm text-green-400 min-h-[300px]">
                <p>// Output will appear here after running your code</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right panel with video feeds */}
        <div className="flex flex-1 flex-col lg:border-l lg:border-t-0 dark:border-gray-700 lg:min-w-[250px] max-w-[400px]">
          <div className="flex items-center justify-between border-b bg-muted dark:bg-gray-800 dark:border-gray-700 px-4 py-2">
            <h2 className="font-semibold dark:text-white">Video</h2>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsInterviewerVisible(!isInterviewerVisible)}
                className="h-7 w-7 dark:text-gray-300"
              >
                {isInterviewerVisible ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-2 overflow-hidden p-2">
            {isInterviewerVisible && (
              <div className="relative aspect-square w-full overflow-hidden rounded-md bg-muted dark:bg-gray-800">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-muted-foreground dark:text-gray-400">Interviewer</span>
                </div>
                <div className="absolute bottom-2 right-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full bg-background/80 dark:bg-gray-700/80 backdrop-blur-sm"
                  >
                    <Maximize2 className="h-3 w-3 dark:text-gray-300" />
                  </Button>
                </div>
              </div>
            )}
            {isIntervieweeVisible && (
              <div className="relative aspect-square w-full overflow-hidden rounded-md bg-muted dark:bg-gray-800">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-muted-foreground dark:text-gray-400">You</span>
                </div>
                <div className="absolute bottom-2 right-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full bg-background/80 dark:bg-gray-700/80 backdrop-blur-sm"
                  >
                    <Maximize2 className="h-3 w-3 dark:text-gray-300" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </section>
  )
}

