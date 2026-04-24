import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import './App.css'

import {
  applyStep,
  createStep,
  deserializePipelineSteps,
  getOperationDefinitions,
  getOperationsByCategory,
  type CvMat,
  type PipelineStep,
  type StepParams,
  type OperationDefinition,
  serializePipelineSteps,
} from './operations'

type SavedPipeline = {
  id: number
  name: string
  pipeline: Array<{ type: PipelineStep['type']; params: StepParams }>
  createdAt: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5080'

function loadOpenCv(): Promise<void> {
  if (window.cv) {
    return Promise.resolve()
  }

  return new Promise((resolve, reject) => {
    const existing = document.getElementById('opencv-script') as HTMLScriptElement | null
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(new Error('OpenCV.js yuklenemedi.')), { once: true })
      return
    }

    const script = document.createElement('script')
    script.id = 'opencv-script'
    script.async = true
    script.src = 'https://docs.opencv.org/4.10.0/opencv.js'
    script.onload = () => {
      if (!window.cv) {
        reject(new Error('OpenCV nesnesi olusmadi.'))
        return
      }

      window.cv.onRuntimeInitialized = () => resolve()
    }
    script.onerror = () => reject(new Error('OpenCV script indirilemedi.'))
    document.body.appendChild(script)
  })
}

function App() {
  const [cvReady, setCvReady] = useState(false)
  const [steps, setSteps] = useState<PipelineStep[]>([])
  const [errorText, setErrorText] = useState<string>('')
  const [pipelineName, setPipelineName] = useState('MVP Pipeline')
  const [savedPipelines, setSavedPipelines] = useState<SavedPipeline[]>([])
  const [busy, setBusy] = useState(false)
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({})
  const [hasImage, setHasImage] = useState(false)
  const [imageName, setImageName] = useState('output.png')

  const originalCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const outputCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const operationGroups = useMemo(() => getOperationsByCategory(), [])
  const operationDefinitions = useMemo(() => getOperationDefinitions(), [])

  useEffect(() => {
    void loadOpenCv()
      .then(() => setCvReady(true))
      .catch((error: Error) => setErrorText(error.message))
  }, [])

  const canProcess = cvReady && hasImage

  useEffect(() => {
    if (!canProcess) {
      return
    }

    executePipeline()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps, cvReady])

  async function fetchPipelines() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/pipelines`)
      if (!response.ok) {
        throw new Error('Pipeline listesi alinamadi.')
      }

      const data = (await response.json()) as SavedPipeline[]
      setSavedPipelines(data)
    } catch (error) {
      setErrorText((error as Error).message)
    }
  }

  useEffect(() => {
    void fetchPipelines()
  }, [])

  function addStep(operationId: PipelineStep['type']) {
    setSteps((prev) => [...prev, createStep(operationId)])
  }

  function removeStep(id: string) {
    setSteps((prev) => prev.filter((step) => step.id !== id))
  }

  function drawImageToCanvases(image: HTMLImageElement) {
    const originalCanvas = originalCanvasRef.current
    const outputCanvas = outputCanvasRef.current

    if (!originalCanvas || !outputCanvas) {
      return
    }

    originalCanvas.width = image.width
    originalCanvas.height = image.height
    outputCanvas.width = image.width
    outputCanvas.height = image.height

    const originalCtx = originalCanvas.getContext('2d')
    const outputCtx = outputCanvas.getContext('2d')
    if (!originalCtx || !outputCtx) {
      return
    }

    originalCtx.drawImage(image, 0, 0)
    outputCtx.drawImage(image, 0, 0)
  }

  function onUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const image = new Image()
      image.onload = () => {
        drawImageToCanvases(image)
        setHasImage(true)
        setImageName(file.name.replace(/\.[^.]+$/, '') || 'output')
        setErrorText('')
        if (cvReady) {
          executePipeline()
        }
      }
      image.src = String(reader.result)
    }
    reader.readAsDataURL(file)
  }

  function executePipeline() {
    const cv = window.cv
    const originalCanvas = originalCanvasRef.current
    const outputCanvas = outputCanvasRef.current

    if (!cv || !originalCanvas || !outputCanvas) {
      return
    }

    setStepErrors({})
    setErrorText('')

    let current: CvMat | null = null
    try {
      current = cv.imread(originalCanvas)

      for (const step of steps) {
        try {
          const next = applyStep(cv, current, step)
          current.delete()
          current = next
        } catch (error) {
          const message = (error as Error).message || 'Islem adiminda hata olustu.'
          setStepErrors((prev) => ({ ...prev, [step.id]: message }))
          throw error
        }
      }

      cv.imshow(outputCanvas, current)
    } catch (error) {
      setErrorText((error as Error).message || 'Pipeline calistirilamadi.')
      if (current) {
        cv.imshow(outputCanvas, current)
      }
    } finally {
      if (current) {
        current.delete()
      }
    }
  }

  async function savePipeline() {
    if (!pipelineName.trim()) {
      setErrorText('Pipeline ismi zorunludur.')
      return
    }

    setBusy(true)
    setErrorText('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/pipelines`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: pipelineName,
          pipeline: serializePipelineSteps(steps),
        }),
      })

      if (!response.ok) {
        throw new Error('Pipeline kaydedilemedi.')
      }

      await fetchPipelines()
    } catch (error) {
      setErrorText((error as Error).message)
    } finally {
      setBusy(false)
    }
  }

  function loadPipeline(pipeline: SavedPipeline) {
    setPipelineName(pipeline.name)
    setSteps(deserializePipelineSteps(pipeline.pipeline))
  }

  async function deletePipeline(id: number) {
    setBusy(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/pipelines/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Pipeline silinemedi.')
      }
      await fetchPipelines()
    } catch (error) {
      setErrorText((error as Error).message)
    } finally {
      setBusy(false)
    }
  }

  function downloadOutput() {
    const canvas = outputCanvasRef.current
    if (!canvas || !hasImage) {
      return
    }

    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = `${imageName}-processed.png`
    link.click()
  }

  function updateStepParam(stepId: string, key: string, value: unknown) {
    setSteps((prev) =>
      prev.map((step) => (step.id === stepId ? { ...step, params: { ...step.params, [key]: value } } : step)),
    )
  }

  function renderControl(definition: OperationDefinition, step: PipelineStep, key: string) {
    const control = definition.controls.find((entry) => entry.key === key)
    if (!control) {
      return null
    }

    const value = step.params[key] ?? control.defaultValue

    if (control.kind === 'select') {
      return (
        <label key={control.key} className="control">
          <span>{control.label}</span>
          <select
            value={String(value)}
            onChange={(event) => updateStepParam(step.id, control.key, normalizeControlValue(control, event.target.value))}
          >
            {control.options?.map((option) => (
              <option key={`${control.key}-${String(option.value)}`} value={String(option.value)}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      )
    }

    if (control.kind === 'boolean') {
      return (
        <label key={control.key} className="control checkbox-control">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(event) => updateStepParam(step.id, control.key, event.target.checked)}
          />
          <span>{control.label}</span>
        </label>
      )
    }

    if (control.kind === 'textarea') {
      return (
        <label key={control.key} className="control">
          <span>{control.label}</span>
          <textarea
            rows={control.rows ?? 3}
            value={String(value)}
            placeholder={control.placeholder}
            onChange={(event) => updateStepParam(step.id, control.key, event.target.value)}
          />
        </label>
      )
    }

    if (control.kind === 'color') {
      return (
        <label key={control.key} className="control color-control">
          <span>{control.label}</span>
          <input
            type="color"
            value={String(value)}
            onChange={(event) => updateStepParam(step.id, control.key, event.target.value)}
          />
        </label>
      )
    }

    if (control.kind === 'text') {
      return (
        <label key={control.key} className="control">
          <span>{control.label}</span>
          <input
            type="text"
            value={String(value)}
            placeholder={control.placeholder}
            onChange={(event) => updateStepParam(step.id, control.key, event.target.value)}
          />
        </label>
      )
    }

    return (
      <label key={control.key} className="control">
        <span>{control.label}</span>
        <input
          type="number"
          min={control.min}
          max={control.max}
          step={control.step ?? 1}
          value={String(value)}
          onChange={(event) => updateStepParam(step.id, control.key, normalizeControlValue(control, event.target.value))}
        />
      </label>
    )
  }

  function normalizeControlValue(control: { kind: string; options?: Array<{ value: string | number | boolean }>; defaultValue: unknown }, rawValue: string | boolean) {
    if (control.kind === 'number') {
      return Number(rawValue)
    }

    if (control.kind === 'select') {
      const match = control.options?.find((option) => String(option.value) === String(rawValue))
      return match?.value ?? rawValue
    }

    return rawValue
  }

  return (
    <main className="app-shell">
      <header className="title-row">
        <div>
          <p className="eyebrow">Computer Vision Pipeline Builder</p>
          <h1>No-code image processing playground</h1>
          <p className="muted">
            Upload ettiginiz goruntuye adim adim filtre uygulayin ve sonucu anlik olarak gorun.
          </p>
        </div>
        <div className="status-box">
          <p>OpenCV: {cvReady ? 'hazir' : 'yukleniyor...'}</p>
          <p>Image: {hasImage ? 'hazir' : 'bekleniyor'}</p>
        </div>
      </header>

      <section className="layout-grid">
        <aside className="card operations">
          <h2>1) Image Upload</h2>
          <input type="file" accept="image/*" onChange={onUpload} />
          <button onClick={downloadOutput} disabled={!hasImage}>
            Download Output
          </button>

          <h2>2) Operations</h2>
          <div className="operation-groups">
            {Object.entries(operationGroups).map(([category, definitions]) => (
              <section key={category} className="operation-group">
                <h3>{category}</h3>
                <div className="button-grid">
                  {definitions.map((definition) => (
                    <button key={definition.id} onClick={() => addStep(definition.id)}>
                      + {definition.label}
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <h2>3) Save Pipeline</h2>
          <label className="field">
            <span>Name</span>
            <input
              value={pipelineName}
              onChange={(event) => setPipelineName(event.target.value)}
              placeholder="Ornek: Kenar Tespiti"
            />
          </label>
          <button onClick={savePipeline} disabled={busy}>
            {busy ? 'Kaydediliyor...' : 'Save'}
          </button>

          {errorText && <p className="error">{errorText}</p>}
        </aside>

        <section className="card preview">
          <h2>Pipeline Bar</h2>
          <div className="pipeline-bar">
            {steps.length === 0 && <span className="muted">Henüz adım eklenmedi.</span>}
            {steps.map((step, index) => (
              <article key={step.id} className={`step-pill ${stepErrors[step.id] ? 'step-pill-error' : ''}`}>
                <div className="step-header">
                  <strong>{operationDefinitions.find((definition) => definition.id === step.type)?.label ?? step.type}</strong>
                  <button className="danger slim" onClick={() => removeStep(step.id)}>
                    Sil
                  </button>
                </div>
                <div className="step-controls">
                  {getDefinition(step.type).controls.map((control) => renderControl(getDefinition(step.type), step, control.key))}
                </div>
                {index < steps.length - 1 && <span className="arrow">→</span>}
                {stepErrors[step.id] && <p className="error">{stepErrors[step.id]}</p>}
              </article>
            ))}
          </div>

          <h2>Canvas Preview</h2>
          <div className="canvas-wrap">
            <canvas ref={outputCanvasRef} />
          </div>
          <canvas ref={originalCanvasRef} className="hidden-canvas" />
        </section>

        <aside className="card saved-list">
          <h2>Saved Pipelines</h2>
          {savedPipelines.length === 0 && <p className="muted">Kayitli pipeline bulunamadi.</p>}
          {savedPipelines.map((pipeline) => (
            <article key={pipeline.id} className="saved-item">
              <div>
                <h3>{pipeline.name}</h3>
                <p>{new Date(pipeline.createdAt).toLocaleString()}</p>
                <p>{pipeline.pipeline.map((step) => getDefinition(step.type).label).join(' → ') || 'Bos pipeline'}</p>
              </div>
              <div className="saved-actions">
                <button onClick={() => loadPipeline(pipeline)}>Yukle</button>
                <button className="danger" onClick={() => void deletePipeline(pipeline.id)}>
                  Sil
                </button>
              </div>
            </article>
          ))}
        </aside>
      </section>
    </main>
  )
}

function getDefinition(stepType: PipelineStep['type']) {
  return getOperationDefinitions().find((definition) => definition.id === stepType) ?? getOperationDefinitions()[0]
}

export default App
