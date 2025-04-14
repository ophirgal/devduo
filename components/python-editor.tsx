import React, { useCallback, useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { EditorView } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { python } from "@codemirror/lang-python";

export interface PythonEditorRef {
    runCode: () => void;
}

interface PyodideInterface {
    runPythonAsync: (code: string) => Promise<any>;
    loadPackage: (pkg: string) => Promise<void>;
}

interface PythonEditorProps {
    initialCode?: string;
}

const PythonEditor = forwardRef<PythonEditorRef, PythonEditorProps>(
    ({ initialCode }, ref) => {
 // function PythonEditor({initialCode}:{ initialCode?: string }) {
    const editorRef = useRef<HTMLDivElement | null>(null);
    const viewRef = useRef<EditorView | null>(null);
    const [pyodide, setPyodide] = useState<PyodideInterface | null>(null);
    const [output, setOutput] = useState<string>("");

    const runCode = useCallback(async () => {
        if (!pyodide) {
            setOutput("Loading Python interpreter...\n");
            return;
        }

        try {
            const code = viewRef.current?.state.doc.toString();
            await pyodide.runPythonAsync(code || "");
        } catch (err) {
            setOutput((err as Error).toString());
        }
    }, [pyodide]);

    // Expose methods to the parent component
    useImperativeHandle(ref, () => ({
        runCode: runCode
    }), [runCode]);

    // Load Python interpreter
    useEffect(() => {
        const load = async () => {
            // @ts-ignore
            const pyodide = await (window as any).loadPyodide({
                indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/",
            });

            // Redirect stdout to our custom console
            pyodide.globals.set("sys", pyodide.pyimport("sys"));

            class StdoutWriter {
                write(s: string) {
                    setOutput((prev) => prev + s);
                }
                flush() {} // Optional, no-op
            }

            pyodide.globals.get("sys").stdout = pyodide.toPy(new StdoutWriter());
            pyodide.globals.get("sys").stderr = pyodide.toPy(new StdoutWriter());

            setPyodide(pyodide);
        };

        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js";
        script.onload = load;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script); // Cleanup on unmount
        };
    }, []);

    // Initialize code editor with boilerplate code
    useEffect(() => {
        if (!editorRef.current || viewRef.current) return;

        const startCode = initialCode || `print("Hello World!")`;

        const state = EditorState.create({
            doc: startCode,
            extensions: [basicSetup, python()],
        });

        viewRef.current = new EditorView({
            state,
            parent: editorRef.current,
        });
    }, [editorRef, viewRef]);

    return (
        <div>
            <div ref={editorRef} className="border rounded mb-4 focus:outline-none">
            </div>
            {/*<button
                onClick={runCode}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Run Code
            </button>*/}
            <div className="mt-4 p-2 bg-gray-100 border rounded">
                <h2 className="font-semibold">Output:</h2>
                <pre>{output}</pre>
            </div>
        </div>
    );
});

PythonEditor.displayName = 'PythonEditor';

export default PythonEditor;