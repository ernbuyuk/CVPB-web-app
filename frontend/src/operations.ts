export type OperationId =
  | 'cvtColor'
  | 'resize'
  | 'flip'
  | 'rotate'
  | 'gaussianBlur'
  | 'medianBlur'
  | 'bilateralFilter'
  | 'filter2D'
  | 'canny'
  | 'findContours'
  | 'drawContours'
  | 'threshold'
  | 'adaptiveThreshold'
  | 'erode'
  | 'dilate'
  | 'morphologyEx'
  | 'line'
  | 'circle'
  | 'rectangle'
  | 'putText'
  | 'warpAffine'
  | 'warpPerspective'
  | 'crop'
  | 'bitwiseAnd'
  | 'bitwiseOr'

export type StepParams = Record<string, unknown>

export type PipelineStep = {
  id: string
  type: OperationId
  params: StepParams
}

export type ControlKind = 'number' | 'select' | 'text' | 'textarea' | 'boolean' | 'color'

export type ControlOption = {
  label: string
  value: string | number | boolean
}

export type ControlDefinition = {
  key: string
  label: string
  kind: ControlKind
  defaultValue: unknown
  options?: ControlOption[]
  min?: number
  max?: number
  step?: number
  rows?: number
  placeholder?: string
}

export type OperationDefinition = {
  id: OperationId
  label: string
  category: string
  description: string
  controls: ControlDefinition[]
  apply: (cv: CvNamespace, source: CvMat, params: StepParams) => CvMat
}

declare global {
  interface Window {
    cv?: CvNamespace
  }
}

export type CvMat = {
  delete: () => void
  clone: () => CvMat
  channels: () => number
  rows: number
  cols: number
  roi: (rect: unknown) => CvMat
}

export type CvNamespace = {
  imread: (canvas: HTMLCanvasElement) => CvMat
  imshow: (canvas: HTMLCanvasElement, mat: CvMat) => void
  Mat: new (...args: any[]) => CvMat
  MatVector: new (...args: any[]) => { size(): number; get(index: number): CvMat; delete(): void }
  Point: new (x: number, y: number) => unknown
  Scalar: new (...values: number[]) => unknown
  Size: new (width: number, height: number) => unknown
  Rect: new (x: number, y: number, width: number, height: number) => unknown
  rotate: (src: CvMat, dst: CvMat, code: number) => void
  resize: (src: CvMat, dst: CvMat, dsize: unknown, fx: number, fy: number, interpolation: number) => void
  flip: (src: CvMat, dst: CvMat, flipCode: number) => void
  cvtColor: (src: CvMat, dst: CvMat, code: number) => void
  GaussianBlur: (src: CvMat, dst: CvMat, ksize: unknown, sigmaX: number, sigmaY?: number, borderType?: number) => void
  medianBlur: (src: CvMat, dst: CvMat, ksize: number) => void
  bilateralFilter: (
    src: CvMat,
    dst: CvMat,
    d: number,
    sigmaColor: number,
    sigmaSpace: number,
    borderType?: number,
  ) => void
  filter2D: (src: CvMat, dst: CvMat, ddepth: number, kernel: CvMat, anchor?: unknown, delta?: number, borderType?: number) => void
  Canny: (src: CvMat, dst: CvMat, threshold1: number, threshold2: number, apertureSize?: number, l2gradient?: boolean) => void
  threshold: (src: CvMat, dst: CvMat, thresh: number, maxVal: number, type: number) => number
  adaptiveThreshold: (
    src: CvMat,
    dst: CvMat,
    maxVal: number,
    adaptiveMethod: number,
    thresholdType: number,
    blockSize: number,
    C: number,
  ) => void
  getStructuringElement: (shape: number, ksize: unknown) => CvMat
  erode: (src: CvMat, dst: CvMat, kernel: CvMat, anchor?: unknown, iterations?: number, borderType?: number) => void
  dilate: (src: CvMat, dst: CvMat, kernel: CvMat, anchor?: unknown, iterations?: number, borderType?: number) => void
  morphologyEx: (
    src: CvMat,
    dst: CvMat,
    op: number,
    kernel: CvMat,
    anchor?: unknown,
    iterations?: number,
    borderType?: number,
  ) => void
  findContours: (image: CvMat, contours: { size(): number; get(index: number): CvMat; delete(): void }, hierarchy: CvMat, mode: number, method: number) => void
  drawContours: (image: CvMat, contours: unknown, contourIdx: number, color: unknown, thickness: number, lineType?: number, hierarchy?: CvMat, maxLevel?: number) => void
  line: (image: CvMat, pt1: unknown, pt2: unknown, color: unknown, thickness?: number, lineType?: number, shift?: number) => void
  circle: (image: CvMat, center: unknown, radius: number, color: unknown, thickness?: number, lineType?: number, shift?: number) => void
  rectangle: (image: CvMat, rec: unknown, color: unknown, thickness?: number, lineType?: number, shift?: number) => void
  putText: (
    image: CvMat,
    text: string,
    org: unknown,
    fontFace: number,
    fontScale: number,
    color: unknown,
    thickness?: number,
    lineType?: number,
    bottomLeftOrigin?: boolean,
  ) => void
  getRotationMatrix2D: (center: unknown, angle: number, scale: number) => CvMat
  warpAffine: (
    src: CvMat,
    dst: CvMat,
    m: CvMat,
    dsize: unknown,
    flags?: number,
    borderMode?: number,
    borderValue?: unknown,
  ) => void
  getPerspectiveTransform: (src: CvMat, dst: CvMat) => CvMat
  warpPerspective: (
    src: CvMat,
    dst: CvMat,
    m: CvMat,
    dsize: unknown,
    flags?: number,
    borderMode?: number,
    borderValue?: unknown,
  ) => void
  bitwise_and: (src1: CvMat, src2: CvMat, dst: CvMat, mask?: CvMat) => void
  bitwise_or: (src1: CvMat, src2: CvMat, dst: CvMat, mask?: CvMat) => void
  matFromArray: (rows: number, cols: number, type: number, array: number[]) => CvMat
  COLOR_RGBA2GRAY: number
  COLOR_RGBA2RGB: number
  COLOR_RGBA2HSV: number
  COLOR_RGBA2Lab: number
  COLOR_GRAY2RGBA: number
  COLOR_GRAY2RGB: number
  COLOR_BGR2RGBA: number
  COLOR_RGB2RGBA: number
  COLOR_HSV2RGBA: number
  COLOR_Lab2RGBA: number
  ROTATE_90_CLOCKWISE: number
  ROTATE_90_COUNTERCLOCKWISE: number
  ROTATE_180: number
  INTER_NEAREST: number
  INTER_LINEAR: number
  INTER_AREA: number
  BORDER_DEFAULT: number
  BORDER_CONSTANT: number
  THRESH_BINARY: number
  THRESH_BINARY_INV: number
  THRESH_TRUNC: number
  THRESH_TOZERO: number
  THRESH_TOZERO_INV: number
  ADAPTIVE_THRESH_MEAN_C: number
  ADAPTIVE_THRESH_GAUSSIAN_C: number
  MORPH_ERODE: number
  MORPH_DILATE: number
  MORPH_OPEN: number
  MORPH_CLOSE: number
  MORPH_GRADIENT: number
  MORPH_TOPHAT: number
  MORPH_BLACKHAT: number
  MORPH_RECT: number
  MORPH_CROSS: number
  MORPH_ELLIPSE: number
  RETR_EXTERNAL: number
  RETR_LIST: number
  RETR_TREE: number
  CHAIN_APPROX_SIMPLE: number
  CHAIN_APPROX_NONE: number
  CV_32F: number
  CV_32FC2: number
  CV_8UC1: number
  CV_8UC3: number
  CV_8UC4: number
  FONT_HERSHEY_SIMPLEX: number
  onRuntimeInitialized?: () => void
}

const operationDefinitions: OperationDefinition[] = [
  {
    id: 'cvtColor',
    label: 'CVT Color',
    category: 'Temel Görüntü Dönüşümleri',
    description: 'Renk uzayını dönüştürür. Default grayscale gelir ama seçilebilir.',
    controls: [
      {
        key: 'mode',
        label: 'Mode',
        kind: 'select',
        defaultValue: 'gray',
        options: [
          { label: 'Grayscale', value: 'gray' },
          { label: 'RGB', value: 'rgb' },
          { label: 'HSV', value: 'hsv' },
          { label: 'Lab', value: 'lab' },
        ],
      },
    ],
    apply: (cv, source, params) => {
      const mode = String(params.mode ?? 'gray')
      const dst = new cv.Mat()

      if (mode === 'gray') {
        if (source.channels() === 1) {
          return source.clone()
        }

        cv.cvtColor(source, dst, resolveColorCode(cv, ['COLOR_RGBA2GRAY', 'COLOR_BGR2GRAY', 'COLOR_RGB2GRAY']))
        return dst
      }

      const normalizedSource = source.channels() === 1 ? grayToColor(cv, source) : source.clone()

      if (mode === 'rgb') {
        cv.cvtColor(normalizedSource, dst, resolveColorCode(cv, ['COLOR_RGBA2RGB', 'COLOR_BGRA2RGB', 'COLOR_BGR2RGB']))
        normalizedSource.delete()
        return dst
      }

      if (mode === 'hsv') {
        cv.cvtColor(normalizedSource, dst, resolveColorCode(cv, ['COLOR_RGBA2HSV', 'COLOR_BGR2HSV']))
        normalizedSource.delete()
        return dst
      }

      cv.cvtColor(normalizedSource, dst, resolveColorCode(cv, ['COLOR_RGBA2Lab', 'COLOR_RGBA2LAB', 'COLOR_BGR2Lab', 'COLOR_BGR2LAB']))
      normalizedSource.delete()
      return dst
    },
  },
  {
    id: 'resize',
    label: 'Resize',
    category: 'Temel Görüntü Dönüşümleri',
    description: 'Görüntü boyutunu ölçekler.',
    controls: [
      { key: 'scaleX', label: 'Scale X', kind: 'number', defaultValue: 1, min: 0.1, max: 10, step: 0.1 },
      { key: 'scaleY', label: 'Scale Y', kind: 'number', defaultValue: 1, min: 0.1, max: 10, step: 0.1 },
      {
        key: 'interpolation',
        label: 'Interpolation',
        kind: 'select',
        defaultValue: 'linear',
        options: [
          { label: 'Linear', value: 'linear' },
          { label: 'Nearest', value: 'nearest' },
          { label: 'Area', value: 'area' },
        ],
      },
    ],
    apply: (cv, source, params) => {
      const scaleX = Number(params.scaleX ?? 1)
      const scaleY = Number(params.scaleY ?? 1)
      const interpolation = String(params.interpolation ?? 'linear')
      const dst = new cv.Mat()
      const interp = interpolation === 'nearest' ? cv.INTER_NEAREST : interpolation === 'area' ? cv.INTER_AREA : cv.INTER_LINEAR
      cv.resize(source, dst, new cv.Size(0, 0), scaleX, scaleY, interp)
      return dst
    },
  },
  {
    id: 'flip',
    label: 'Flip',
    category: 'Temel Görüntü Dönüşümleri',
    description: 'Aynalama yapar.',
    controls: [
      {
        key: 'flipCode',
        label: 'Flip Code',
        kind: 'select',
        defaultValue: 1,
        options: [
          { label: 'Horizontal', value: 1 },
          { label: 'Vertical', value: 0 },
          { label: 'Both', value: -1 },
        ],
      },
    ],
    apply: (cv, source, params) => {
      const dst = new cv.Mat()
      cv.flip(source, dst, Number(params.flipCode ?? 1))
      return dst
    },
  },
  {
    id: 'rotate',
    label: 'Rotate',
    category: 'Temel Görüntü Dönüşümleri',
    description: '90/180 derece döndürür.',
    controls: [
      {
        key: 'rotation',
        label: 'Rotation',
        kind: 'select',
        defaultValue: 'cw',
        options: [
          { label: '90 CW', value: 'cw' },
          { label: '90 CCW', value: 'ccw' },
          { label: '180', value: '180' },
        ],
      },
    ],
    apply: (cv, source, params) => {
      const rotation = String(params.rotation ?? 'cw')
      const dst = new cv.Mat()
      const code =
        rotation === 'ccw' ? cv.ROTATE_90_COUNTERCLOCKWISE : rotation === '180' ? cv.ROTATE_180 : cv.ROTATE_90_CLOCKWISE
      cv.rotate(source, dst, code)
      return dst
    },
  },
  {
    id: 'gaussianBlur',
    label: 'Gaussian Blur',
    category: 'Filtreler',
    description: 'Klasik yumuşatma filtresi.',
    controls: [
      { key: 'ksize', label: 'Kernel Size', kind: 'number', defaultValue: 5, min: 1, max: 31, step: 2 },
      { key: 'sigmaX', label: 'Sigma X', kind: 'number', defaultValue: 0, min: 0, max: 100, step: 0.1 },
    ],
    apply: (cv, source, params) => {
      const dst = new cv.Mat()
      const raw = Math.max(1, Number(params.ksize ?? 5))
      const ksize = raw % 2 === 0 ? raw + 1 : raw
      cv.GaussianBlur(source, dst, new cv.Size(ksize, ksize), Number(params.sigmaX ?? 0), 0, cv.BORDER_DEFAULT)
      return dst
    },
  },
  {
    id: 'medianBlur',
    label: 'Median Blur',
    category: 'Filtreler',
    description: 'Gürültü azaltma için median filtresi.',
    controls: [{ key: 'ksize', label: 'Kernel Size', kind: 'number', defaultValue: 5, min: 3, max: 31, step: 2 }],
    apply: (cv, source, params) => {
      const dst = new cv.Mat()
      const raw = Math.max(3, Number(params.ksize ?? 5))
      const ksize = raw % 2 === 0 ? raw + 1 : raw
      cv.medianBlur(source, dst, ksize)
      return dst
    },
  },
  {
    id: 'bilateralFilter',
    label: 'Bilateral Filter',
    category: 'Filtreler',
    description: 'Kenarları koruyarak blur uygular.',
    controls: [
      { key: 'd', label: 'Diameter', kind: 'number', defaultValue: 9, min: 1, max: 31, step: 1 },
      { key: 'sigmaColor', label: 'Sigma Color', kind: 'number', defaultValue: 75, min: 1, max: 500, step: 1 },
      { key: 'sigmaSpace', label: 'Sigma Space', kind: 'number', defaultValue: 75, min: 1, max: 500, step: 1 },
    ],
    apply: (cv, source, params) => {
      const dst = new cv.Mat()
      cv.bilateralFilter(
        source,
        dst,
        Number(params.d ?? 9),
        Number(params.sigmaColor ?? 75),
        Number(params.sigmaSpace ?? 75),
        cv.BORDER_DEFAULT,
      )
      return dst
    },
  },
  {
    id: 'filter2D',
    label: 'Filter2D',
    category: 'Filtreler',
    description: 'Özel kernel uygular.',
    controls: [
      {
        key: 'kernel',
        label: 'Kernel',
        kind: 'textarea',
        defaultValue: '0,-1,0\n-1,5,-1\n0,-1,0',
        rows: 4,
        placeholder: '0,-1,0\n-1,5,-1\n0,-1,0',
      },
    ],
    apply: (cv, source, params) => {
      const dst = new cv.Mat()
      const kernelValues = parseKernel(String(params.kernel ?? '0,-1,0\n-1,5,-1\n0,-1,0'))
      const kernel = cv.matFromArray(3, 3, cv.CV_32F, kernelValues)
      cv.filter2D(source, dst, -1, kernel, new cv.Point(-1, -1), 0, cv.BORDER_DEFAULT)
      kernel.delete()
      return dst
    },
  },
  {
    id: 'canny',
    label: 'Canny',
    category: 'Kenar / Kontur',
    description: 'Kenar tespiti.',
    controls: [
      { key: 'threshold1', label: 'Threshold 1', kind: 'number', defaultValue: 100, min: 0, max: 500, step: 1 },
      { key: 'threshold2', label: 'Threshold 2', kind: 'number', defaultValue: 200, min: 0, max: 500, step: 1 },
      { key: 'apertureSize', label: 'Aperture Size', kind: 'number', defaultValue: 3, min: 3, max: 7, step: 2 },
      { key: 'l2gradient', label: 'L2 Gradient', kind: 'boolean', defaultValue: false },
    ],
    apply: (cv, source, params) => {
      const gray = ensureGray(cv, source)
      const dst = new cv.Mat()
      cv.Canny(
        gray,
        dst,
        Number(params.threshold1 ?? 100),
        Number(params.threshold2 ?? 200),
        Number(params.apertureSize ?? 3),
        Boolean(params.l2gradient ?? false),
      )
      gray.delete()
      return dst
    },
  },
  {
    id: 'findContours',
    label: 'Find Contours',
    category: 'Kenar / Kontur',
    description: 'Nesne sınırlarını bulur ve çizer.',
    controls: [
      { key: 'threshold', label: 'Binary Threshold', kind: 'number', defaultValue: 127, min: 0, max: 255, step: 1 },
      {
        key: 'mode',
        label: 'Retrieval',
        kind: 'select',
        defaultValue: 'external',
        options: [
          { label: 'External', value: 'external' },
          { label: 'List', value: 'list' },
          { label: 'Tree', value: 'tree' },
        ],
      },
      {
        key: 'method',
        label: 'Approximation',
        kind: 'select',
        defaultValue: 'simple',
        options: [
          { label: 'Simple', value: 'simple' },
          { label: 'None', value: 'none' },
        ],
      },
      { key: 'color', label: 'Color', kind: 'color', defaultValue: '#00d47e' },
      { key: 'thickness', label: 'Thickness', kind: 'number', defaultValue: 2, min: 1, max: 20, step: 1 },
    ],
    apply: (cv, source, params) => {
      const gray = ensureGray(cv, source)
      const binary = new cv.Mat()
      cv.threshold(gray, binary, Number(params.threshold ?? 127), 255, cv.THRESH_BINARY)
      const contours = new cv.MatVector()
      const hierarchy = new cv.Mat()
      cv.findContours(
        binary,
        contours,
        hierarchy,
        retrievalMode(cv, String(params.mode ?? 'external')),
        approximationMode(cv, String(params.method ?? 'simple')),
      )
      const output = ensureColor(cv, source)
      cv.drawContours(output, contours, -1, colorToScalar(cv, String(params.color ?? '#00d47e')), Number(params.thickness ?? 2))
      gray.delete()
      binary.delete()
      hierarchy.delete()
      contours.delete()
      return output
    },
  },
  {
    id: 'drawContours',
    label: 'Draw Contours',
    category: 'Kenar / Kontur',
    description: 'Bulunan konturları mevcut görüntü üzerine çizer.',
    controls: [
      { key: 'threshold', label: 'Binary Threshold', kind: 'number', defaultValue: 127, min: 0, max: 255, step: 1 },
      { key: 'color', label: 'Color', kind: 'color', defaultValue: '#ff6b6b' },
      { key: 'thickness', label: 'Thickness', kind: 'number', defaultValue: 2, min: 1, max: 20, step: 1 },
    ],
    apply: (cv, source, params) => {
      const gray = ensureGray(cv, source)
      const binary = new cv.Mat()
      cv.threshold(gray, binary, Number(params.threshold ?? 127), 255, cv.THRESH_BINARY)
      const contours = new cv.MatVector()
      const hierarchy = new cv.Mat()
      cv.findContours(binary, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
      const output = ensureColor(cv, source)
      cv.drawContours(output, contours, -1, colorToScalar(cv, String(params.color ?? '#ff6b6b')), Number(params.thickness ?? 2))
      gray.delete()
      binary.delete()
      hierarchy.delete()
      contours.delete()
      return output
    },
  },
  {
    id: 'threshold',
    label: 'Threshold',
    category: 'Eşikleme',
    description: 'Binary veya inverse threshold uygular.',
    controls: [
      { key: 'threshold', label: 'Threshold', kind: 'number', defaultValue: 127, min: 0, max: 255, step: 1 },
      { key: 'maxValue', label: 'Max Value', kind: 'number', defaultValue: 255, min: 0, max: 255, step: 1 },
      {
        key: 'type',
        label: 'Type',
        kind: 'select',
        defaultValue: 'binary',
        options: [
          { label: 'Binary', value: 'binary' },
          { label: 'Binary Inv', value: 'binary_inv' },
          { label: 'Trunc', value: 'trunc' },
          { label: 'To Zero', value: 'tozero' },
          { label: 'To Zero Inv', value: 'tozero_inv' },
        ],
      },
    ],
    apply: (cv, source, params) => {
      const gray = ensureGray(cv, source)
      const dst = new cv.Mat()
      cv.threshold(
        gray,
        dst,
        Number(params.threshold ?? 127),
        Number(params.maxValue ?? 255),
        thresholdType(cv, String(params.type ?? 'binary')),
      )
      gray.delete()
      return dst
    },
  },
  {
    id: 'adaptiveThreshold',
    label: 'Adaptive Threshold',
    category: 'Eşikleme',
    description: 'Adaptif threshold uygular.',
    controls: [
      { key: 'maxValue', label: 'Max Value', kind: 'number', defaultValue: 255, min: 0, max: 255, step: 1 },
      { key: 'blockSize', label: 'Block Size', kind: 'number', defaultValue: 11, min: 3, max: 51, step: 2 },
      { key: 'C', label: 'C', kind: 'number', defaultValue: 2, min: -50, max: 50, step: 1 },
      {
        key: 'adaptiveMethod',
        label: 'Adaptive Method',
        kind: 'select',
        defaultValue: 'gaussian',
        options: [
          { label: 'Mean', value: 'mean' },
          { label: 'Gaussian', value: 'gaussian' },
        ],
      },
      {
        key: 'type',
        label: 'Type',
        kind: 'select',
        defaultValue: 'binary',
        options: [
          { label: 'Binary', value: 'binary' },
          { label: 'Binary Inv', value: 'binary_inv' },
        ],
      },
    ],
    apply: (cv, source, params) => {
      const gray = ensureGray(cv, source)
      const dst = new cv.Mat()
      let blockSize = Math.max(3, Number(params.blockSize ?? 11))
      if (blockSize % 2 === 0) {
        blockSize += 1
      }
      cv.adaptiveThreshold(
        gray,
        dst,
        Number(params.maxValue ?? 255),
        adaptiveMethod(cv, String(params.adaptiveMethod ?? 'gaussian')),
        thresholdType(cv, String(params.type ?? 'binary')),
        blockSize,
        Number(params.C ?? 2),
      )
      gray.delete()
      return dst
    },
  },
  {
    id: 'erode',
    label: 'Erode',
    category: 'Morfolojik İşlemler',
    description: 'Aşındırma uygular.',
    controls: [
      { key: 'kernelSize', label: 'Kernel Size', kind: 'number', defaultValue: 3, min: 1, max: 31, step: 2 },
      { key: 'iterations', label: 'Iterations', kind: 'number', defaultValue: 1, min: 1, max: 20, step: 1 },
      {
        key: 'shape',
        label: 'Shape',
        kind: 'select',
        defaultValue: 'rect',
        options: [
          { label: 'Rect', value: 'rect' },
          { label: 'Cross', value: 'cross' },
          { label: 'Ellipse', value: 'ellipse' },
        ],
      },
    ],
    apply: (cv, source, params) => {
      const gray = ensureGray(cv, source)
      const dst = new cv.Mat()
      const kernel = cv.getStructuringElement(
        morphShape(cv, String(params.shape ?? 'rect')),
        new cv.Size(oddKernel(Number(params.kernelSize ?? 3)), oddKernel(Number(params.kernelSize ?? 3))),
      )
      cv.erode(gray, dst, kernel, new cv.Point(-1, -1), Number(params.iterations ?? 1), cv.BORDER_CONSTANT)
      gray.delete()
      kernel.delete()
      return dst
    },
  },
  {
    id: 'dilate',
    label: 'Dilate',
    category: 'Morfolojik İşlemler',
    description: 'Genişletme uygular.',
    controls: [
      { key: 'kernelSize', label: 'Kernel Size', kind: 'number', defaultValue: 3, min: 1, max: 31, step: 2 },
      { key: 'iterations', label: 'Iterations', kind: 'number', defaultValue: 1, min: 1, max: 20, step: 1 },
      {
        key: 'shape',
        label: 'Shape',
        kind: 'select',
        defaultValue: 'rect',
        options: [
          { label: 'Rect', value: 'rect' },
          { label: 'Cross', value: 'cross' },
          { label: 'Ellipse', value: 'ellipse' },
        ],
      },
    ],
    apply: (cv, source, params) => {
      const gray = ensureGray(cv, source)
      const dst = new cv.Mat()
      const kernel = cv.getStructuringElement(
        morphShape(cv, String(params.shape ?? 'rect')),
        new cv.Size(oddKernel(Number(params.kernelSize ?? 3)), oddKernel(Number(params.kernelSize ?? 3))),
      )
      cv.dilate(gray, dst, kernel, new cv.Point(-1, -1), Number(params.iterations ?? 1), cv.BORDER_CONSTANT)
      gray.delete()
      kernel.delete()
      return dst
    },
  },
  {
    id: 'morphologyEx',
    label: 'MorphologyEx',
    category: 'Morfolojik İşlemler',
    description: 'Açma, kapama, gradient ve türevleri.',
    controls: [
      { key: 'kernelSize', label: 'Kernel Size', kind: 'number', defaultValue: 3, min: 1, max: 31, step: 2 },
      { key: 'iterations', label: 'Iterations', kind: 'number', defaultValue: 1, min: 1, max: 20, step: 1 },
      {
        key: 'operation',
        label: 'Operation',
        kind: 'select',
        defaultValue: 'open',
        options: [
          { label: 'Open', value: 'open' },
          { label: 'Close', value: 'close' },
          { label: 'Gradient', value: 'gradient' },
          { label: 'Top Hat', value: 'tophat' },
          { label: 'Black Hat', value: 'blackhat' },
        ],
      },
    ],
    apply: (cv, source, params) => {
      const gray = ensureGray(cv, source)
      const dst = new cv.Mat()
      const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(oddKernel(Number(params.kernelSize ?? 3)), oddKernel(Number(params.kernelSize ?? 3))))
      cv.morphologyEx(
        gray,
        dst,
        morphologyOp(cv, String(params.operation ?? 'open')),
        kernel,
        new cv.Point(-1, -1),
        Number(params.iterations ?? 1),
        cv.BORDER_CONSTANT,
      )
      gray.delete()
      kernel.delete()
      return dst
    },
  },
  {
    id: 'line',
    label: 'Line',
    category: 'Şekil Çizme',
    description: 'Debug veya anotasyon için çizgi çizer.',
    controls: [
      { key: 'x1', label: 'X1', kind: 'number', defaultValue: 20, min: 0, max: 10000, step: 1 },
      { key: 'y1', label: 'Y1', kind: 'number', defaultValue: 20, min: 0, max: 10000, step: 1 },
      { key: 'x2', label: 'X2', kind: 'number', defaultValue: 250, min: 0, max: 10000, step: 1 },
      { key: 'y2', label: 'Y2', kind: 'number', defaultValue: 250, min: 0, max: 10000, step: 1 },
      { key: 'color', label: 'Color', kind: 'color', defaultValue: '#ffd769' },
      { key: 'thickness', label: 'Thickness', kind: 'number', defaultValue: 3, min: 1, max: 40, step: 1 },
    ],
    apply: (cv, source, params) => {
      const dst = ensureColor(cv, source)
      cv.line(
        dst,
        new cv.Point(Number(params.x1 ?? 20), Number(params.y1 ?? 20)),
        new cv.Point(Number(params.x2 ?? 250), Number(params.y2 ?? 250)),
        colorToScalar(cv, String(params.color ?? '#ffd769')),
        Number(params.thickness ?? 3),
      )
      return dst
    },
  },
  {
    id: 'circle',
    label: 'Circle',
    category: 'Şekil Çizme',
    description: 'Debug veya anotasyon için daire çizer.',
    controls: [
      { key: 'x', label: 'Center X', kind: 'number', defaultValue: 100, min: 0, max: 10000, step: 1 },
      { key: 'y', label: 'Center Y', kind: 'number', defaultValue: 100, min: 0, max: 10000, step: 1 },
      { key: 'radius', label: 'Radius', kind: 'number', defaultValue: 50, min: 1, max: 5000, step: 1 },
      { key: 'color', label: 'Color', kind: 'color', defaultValue: '#00c2ff' },
      { key: 'thickness', label: 'Thickness', kind: 'number', defaultValue: 3, min: -1, max: 40, step: 1 },
    ],
    apply: (cv, source, params) => {
      const dst = ensureColor(cv, source)
      cv.circle(
        dst,
        new cv.Point(Number(params.x ?? 100), Number(params.y ?? 100)),
        Number(params.radius ?? 50),
        colorToScalar(cv, String(params.color ?? '#00c2ff')),
        Number(params.thickness ?? 3),
      )
      return dst
    },
  },
  {
    id: 'rectangle',
    label: 'Rectangle',
    category: 'Şekil Çizme',
    description: 'Debug veya anotasyon için dikdörtgen çizer.',
    controls: [
      { key: 'x', label: 'X', kind: 'number', defaultValue: 50, min: 0, max: 10000, step: 1 },
      { key: 'y', label: 'Y', kind: 'number', defaultValue: 50, min: 0, max: 10000, step: 1 },
      { key: 'width', label: 'Width', kind: 'number', defaultValue: 180, min: 1, max: 10000, step: 1 },
      { key: 'height', label: 'Height', kind: 'number', defaultValue: 140, min: 1, max: 10000, step: 1 },
      { key: 'color', label: 'Color', kind: 'color', defaultValue: '#ff6b6b' },
      { key: 'thickness', label: 'Thickness', kind: 'number', defaultValue: 3, min: -1, max: 40, step: 1 },
    ],
    apply: (cv, source, params) => {
      const dst = ensureColor(cv, source)
      cv.rectangle(
        dst,
        new cv.Rect(Number(params.x ?? 50), Number(params.y ?? 50), Number(params.width ?? 180), Number(params.height ?? 140)),
        colorToScalar(cv, String(params.color ?? '#ff6b6b')),
        Number(params.thickness ?? 3),
      )
      return dst
    },
  },
  {
    id: 'putText',
    label: 'Put Text',
    category: 'Şekil Çizme',
    description: 'Görüntü üzerine yazı basar.',
    controls: [
      { key: 'text', label: 'Text', kind: 'text', defaultValue: 'Debug', placeholder: 'Label' },
      { key: 'x', label: 'X', kind: 'number', defaultValue: 24, min: 0, max: 10000, step: 1 },
      { key: 'y', label: 'Y', kind: 'number', defaultValue: 40, min: 0, max: 10000, step: 1 },
      { key: 'fontScale', label: 'Font Scale', kind: 'number', defaultValue: 1, min: 0.1, max: 8, step: 0.1 },
      { key: 'color', label: 'Color', kind: 'color', defaultValue: '#ffffff' },
      { key: 'thickness', label: 'Thickness', kind: 'number', defaultValue: 2, min: 1, max: 20, step: 1 },
    ],
    apply: (cv, source, params) => {
      const dst = ensureColor(cv, source)
      cv.putText(
        dst,
        String(params.text ?? 'Debug'),
        new cv.Point(Number(params.x ?? 24), Number(params.y ?? 40)),
        cv.FONT_HERSHEY_SIMPLEX,
        Number(params.fontScale ?? 1),
        colorToScalar(cv, String(params.color ?? '#ffffff')),
        Number(params.thickness ?? 2),
      )
      return dst
    },
  },
  {
    id: 'warpAffine',
    label: 'Warp Affine',
    category: 'Geometri / Dönüşüm',
    description: 'Döndürme ve ölçekleme tabanlı affine dönüşüm.',
    controls: [
      { key: 'angle', label: 'Angle', kind: 'number', defaultValue: 0, min: -360, max: 360, step: 1 },
      { key: 'scale', label: 'Scale', kind: 'number', defaultValue: 1, min: 0.1, max: 5, step: 0.1 },
    ],
    apply: (cv, source, params) => {
      const dst = new cv.Mat()
      const center = new cv.Point(source.cols / 2, source.rows / 2)
      const matrix = cv.getRotationMatrix2D(center, Number(params.angle ?? 0), Number(params.scale ?? 1))
      cv.warpAffine(source, dst, matrix, new cv.Size(source.cols, source.rows), cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar(0, 0, 0, 255))
      matrix.delete()
      return dst
    },
  },
  {
    id: 'warpPerspective',
    label: 'Warp Perspective',
    category: 'Geometri / Dönüşüm',
    description: '4 nokta ile perspektif düzeltir.',
    controls: [
      {
        key: 'srcPoints',
        label: 'Src Points',
        kind: 'textarea',
        defaultValue: '[[0,0],[1,0],[1,1],[0,1]]',
        rows: 3,
        placeholder: '[[0,0],[1,0],[1,1],[0,1]]',
      },
      {
        key: 'dstPoints',
        label: 'Dst Points',
        kind: 'textarea',
        defaultValue: '[[0,0],[1,0],[1,1],[0,1]]',
        rows: 3,
        placeholder: '[[0,0],[1,0],[1,1],[0,1]]',
      },
    ],
    apply: (cv, source, params) => {
      const srcPoints = parsePointSet(String(params.srcPoints ?? '[[0,0],[1,0],[1,1],[0,1]]'), source.cols, source.rows)
      const dstPoints = parsePointSet(String(params.dstPoints ?? '[[0,0],[1,0],[1,1],[0,1]]'), source.cols, source.rows)
      const srcMat = cv.matFromArray(4, 1, cv.CV_32FC2, srcPoints)
      const dstMat = cv.matFromArray(4, 1, cv.CV_32FC2, dstPoints)
      const transform = cv.getPerspectiveTransform(srcMat, dstMat)
      const dst = new cv.Mat()
      cv.warpPerspective(source, dst, transform, new cv.Size(source.cols, source.rows), cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar(0, 0, 0, 255))
      srcMat.delete()
      dstMat.delete()
      transform.delete()
      return dst
    },
  },
  {
    id: 'crop',
    label: 'Crop ROI',
    category: 'Maskeleme / ROI',
    description: 'Görüntüden bir alan keser.',
    controls: [
      { key: 'x', label: 'X', kind: 'number', defaultValue: 0.1, min: 0, max: 1, step: 0.01 },
      { key: 'y', label: 'Y', kind: 'number', defaultValue: 0.1, min: 0, max: 1, step: 0.01 },
      { key: 'width', label: 'Width', kind: 'number', defaultValue: 0.8, min: 0.01, max: 1, step: 0.01 },
      { key: 'height', label: 'Height', kind: 'number', defaultValue: 0.8, min: 0.01, max: 1, step: 0.01 },
    ],
    apply: (cv, source, params) => {
      const rect = normalizedRect(source, params)
      const roi = source.roi(new cv.Rect(rect.x, rect.y, rect.width, rect.height))
      const dst = roi.clone()
      roi.delete()
      return dst
    },
  },
  {
    id: 'bitwiseAnd',
    label: 'Bitwise AND',
    category: 'Maskeleme / ROI',
    description: 'ROI mask ile görüntüyü maskeler.',
    controls: [
      { key: 'x', label: 'X', kind: 'number', defaultValue: 0.2, min: 0, max: 1, step: 0.01 },
      { key: 'y', label: 'Y', kind: 'number', defaultValue: 0.2, min: 0, max: 1, step: 0.01 },
      { key: 'width', label: 'Width', kind: 'number', defaultValue: 0.6, min: 0.01, max: 1, step: 0.01 },
      { key: 'height', label: 'Height', kind: 'number', defaultValue: 0.6, min: 0.01, max: 1, step: 0.01 },
    ],
    apply: (cv, source, params) => {
      const rect = normalizedRect(source, params)
      const mask = new cv.Mat(source.rows, source.cols, cv.CV_8UC1, new cv.Scalar(0))
      cv.rectangle(mask, new cv.Rect(rect.x, rect.y, rect.width, rect.height), new cv.Scalar(255), -1)
      const dst = new cv.Mat()
      cv.bitwise_and(source, source, dst, mask)
      mask.delete()
      return dst
    },
  },
  {
    id: 'bitwiseOr',
    label: 'Bitwise OR',
    category: 'Maskeleme / ROI',
    description: 'ROI alanını vurgular.',
    controls: [
      { key: 'x', label: 'X', kind: 'number', defaultValue: 0.2, min: 0, max: 1, step: 0.01 },
      { key: 'y', label: 'Y', kind: 'number', defaultValue: 0.2, min: 0, max: 1, step: 0.01 },
      { key: 'width', label: 'Width', kind: 'number', defaultValue: 0.6, min: 0.01, max: 1, step: 0.01 },
      { key: 'height', label: 'Height', kind: 'number', defaultValue: 0.6, min: 0.01, max: 1, step: 0.01 },
    ],
    apply: (cv, source, params) => {
      const rect = normalizedRect(source, params)
      const overlay = source.clone()
      cv.rectangle(
        overlay,
        new cv.Rect(rect.x, rect.y, rect.width, rect.height),
        new cv.Scalar(255, 255, 255, 255),
        -1,
      )
      const dst = new cv.Mat()
      cv.bitwise_or(source, overlay, dst)
      overlay.delete()
      return dst
    },
  },
]

function ensureGray(cv: CvNamespace, source: CvMat): CvMat {
  if (source.channels() === 1) {
    return source.clone()
  }

  const gray = new cv.Mat()
  cv.cvtColor(source, gray, cv.COLOR_RGBA2GRAY)
  return gray
}

function grayToColor(cv: CvNamespace, source: CvMat): CvMat {
  const dst = new cv.Mat()
  cv.cvtColor(source, dst, resolveColorCode(cv, ['COLOR_GRAY2RGBA', 'COLOR_GRAY2RGB']))
  return dst
}

function resolveColorCode(cv: CvNamespace, candidateNames: string[]): number {
  for (const candidateName of candidateNames) {
    const candidateValue = (cv as Record<string, unknown>)[candidateName]
    if (typeof candidateValue === 'number') {
      return candidateValue
    }
  }

  throw new Error(`OpenCV.js color conversion code not available: ${candidateNames.join(', ')}`)
}

function ensureColor(cv: CvNamespace, source: CvMat): CvMat {
  if (source.channels() === 4) {
    return source.clone()
  }

  const dst = new cv.Mat()
  if (source.channels() === 1) {
    cv.cvtColor(source, dst, cv.COLOR_GRAY2RGBA)
    return dst
  }

  cv.cvtColor(source, dst, cv.COLOR_RGB2RGBA)
  return dst
}

function oddKernel(value: number): number {
  const normalized = Math.max(1, Math.trunc(value))
  return normalized % 2 === 0 ? normalized + 1 : normalized
}

function colorToScalar(cv: CvNamespace, color: string): unknown {
  const hex = color.replace('#', '')
  const normalized = hex.length === 3 ? hex.split('').map((char) => `${char}${char}`).join('') : hex
  const red = Number.parseInt(normalized.slice(0, 2), 16) || 0
  const green = Number.parseInt(normalized.slice(2, 4), 16) || 0
  const blue = Number.parseInt(normalized.slice(4, 6), 16) || 0
  return new cv.Scalar(red, green, blue, 255)
}

function parseKernel(kernelText: string): number[] {
  const rows = kernelText
    .trim()
    .split(/\n+/)
    .map((line) => line.split(',').map((value) => Number.parseFloat(value.trim())))

  const flat = rows.flat().filter((value) => Number.isFinite(value))
  if (flat.length !== 9) {
    return [0, -1, 0, -1, 5, -1, 0, -1, 0]
  }

  return flat
}

function parsePointSet(value: string, width: number, height: number): number[] {
  try {
    const points = JSON.parse(value) as Array<[number, number]>
    if (!Array.isArray(points) || points.length !== 4) {
      return [0, 0, width, 0, width, height, 0, height]
    }

    const normalized = points.flatMap(([x, y]) => {
      const px = x <= 1 ? x * width : x
      const py = y <= 1 ? y * height : y
      return [px, py]
    })

    return normalized.length === 8 ? normalized : [0, 0, width, 0, width, height, 0, height]
  } catch {
    return [0, 0, width, 0, width, height, 0, height]
  }
}

function retrievalMode(cv: CvNamespace, mode: string): number {
  if (mode === 'list') {
    return cv.RETR_LIST
  }

  if (mode === 'tree') {
    return cv.RETR_TREE
  }

  return cv.RETR_EXTERNAL
}

function approximationMode(cv: CvNamespace, mode: string): number {
  if (mode === 'none') {
    return cv.CHAIN_APPROX_NONE
  }

  return cv.CHAIN_APPROX_SIMPLE
}

function thresholdType(cv: CvNamespace, type: string): number {
  switch (type) {
    case 'binary_inv':
      return cv.THRESH_BINARY_INV
    case 'trunc':
      return cv.THRESH_TRUNC
    case 'tozero':
      return cv.THRESH_TOZERO
    case 'tozero_inv':
      return cv.THRESH_TOZERO_INV
    default:
      return cv.THRESH_BINARY
  }
}

function adaptiveMethod(cv: CvNamespace, method: string): number {
  return method === 'mean' ? cv.ADAPTIVE_THRESH_MEAN_C : cv.ADAPTIVE_THRESH_GAUSSIAN_C
}

function morphShape(cv: CvNamespace, shape: string): number {
  switch (shape) {
    case 'cross':
      return cv.MORPH_CROSS
    case 'ellipse':
      return cv.MORPH_ELLIPSE
    default:
      return cv.MORPH_RECT
  }
}

function morphologyOp(cv: CvNamespace, op: string): number {
  switch (op) {
    case 'close':
      return cv.MORPH_CLOSE
    case 'gradient':
      return cv.MORPH_GRADIENT
    case 'tophat':
      return cv.MORPH_TOPHAT
    case 'blackhat':
      return cv.MORPH_BLACKHAT
    default:
      return cv.MORPH_OPEN
  }
}

function normalizedRect(source: CvMat, params: StepParams): { x: number; y: number; width: number; height: number } {
  const rawX = Number(params.x ?? 0)
  const rawY = Number(params.y ?? 0)
  const rawWidth = Number(params.width ?? 1)
  const rawHeight = Number(params.height ?? 1)

  const x = rawX <= 1 ? Math.round(rawX * source.cols) : Math.round(rawX)
  const y = rawY <= 1 ? Math.round(rawY * source.rows) : Math.round(rawY)
  const width = rawWidth <= 1 ? Math.round(rawWidth * source.cols) : Math.round(rawWidth)
  const height = rawHeight <= 1 ? Math.round(rawHeight * source.rows) : Math.round(rawHeight)

  return {
    x: Math.max(0, Math.min(source.cols - 1, x)),
    y: Math.max(0, Math.min(source.rows - 1, y)),
    width: Math.max(1, Math.min(source.cols - x, width)),
    height: Math.max(1, Math.min(source.rows - y, height)),
  }
}

export function getOperationDefinitions(): OperationDefinition[] {
  return operationDefinitions
}

export function getOperationDefinition(operationId: OperationId): OperationDefinition {
  const definition = operationDefinitions.find((entry) => entry.id === operationId)
  if (!definition) {
    throw new Error(`Unknown operation: ${operationId}`)
  }

  return definition
}

export function createStep(operationId: OperationId): PipelineStep {
  const definition = getOperationDefinition(operationId)
  const params: StepParams = {}
  for (const control of definition.controls) {
    params[control.key] = control.defaultValue
  }

  return {
    id: `${Date.now()}-${Math.random()}`,
    type: operationId,
    params,
  }
}

export function createStepFromPayload(operationId: OperationId, params: StepParams): PipelineStep {
  const definition = getOperationDefinition(operationId)
  const nextParams: StepParams = {}
  for (const control of definition.controls) {
    nextParams[control.key] = params[control.key] ?? control.defaultValue
  }

  return {
    id: `${Date.now()}-${Math.random()}`,
    type: operationId,
    params: nextParams,
  }
}

export function cloneStep(step: PipelineStep): PipelineStep {
  return {
    id: `${Date.now()}-${Math.random()}`,
    type: step.type,
    params: { ...step.params },
  }
}

export function applyStep(cv: CvNamespace, source: CvMat, step: PipelineStep): CvMat {
  return getOperationDefinition(step.type).apply(cv, source, step.params)
}

export function serializePipelineSteps(steps: PipelineStep[]): Array<{ type: OperationId; params: StepParams }> {
  return steps.map((step) => ({ type: step.type, params: step.params }))
}

export function deserializePipelineSteps(steps: Array<{ type: OperationId; params?: StepParams }>): PipelineStep[] {
  return steps.map((step) => createStepFromPayload(step.type, step.params ?? {}))
}

export function getOperationCategories(): string[] {
  return Array.from(new Set(operationDefinitions.map((definition) => definition.category)))
}

export function getOperationsByCategory(): Record<string, OperationDefinition[]> {
  return operationDefinitions.reduce<Record<string, OperationDefinition[]>>((groups, definition) => {
    groups[definition.category] = groups[definition.category] ?? []
    groups[definition.category].push(definition)
    return groups
  }, {})
}

export function getOperationLabel(operationId: OperationId): string {
  return getOperationDefinition(operationId).label
}

export function getOperationDescription(operationId: OperationId): string {
  return getOperationDefinition(operationId).description
}

export function getDefaultValue(control: ControlDefinition): unknown {
  return control.defaultValue
}
