'use client'

import { useState, useRef, useCallback } from 'react'
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

const ASPECT_OPTIONS = [
  { label: '16:9', value: 16 / 9 },
  { label: '4:3', value: 4 / 3 },
  { label: '1:1', value: 1 },
] as const

interface ImageCropperProps {
  imageSrc: string
  onCropDone: (blob: Blob, aspect: string) => void
  onCancel: () => void
}

function getCroppedBlob(
  image: HTMLImageElement,
  crop: PixelCrop,
  quality = 0.9
): Promise<Blob> {
  const canvas = document.createElement('canvas')
  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height

  canvas.width = Math.round(crop.width * scaleX)
  canvas.height = Math.round(crop.height * scaleY)

  const ctx = canvas.getContext('2d')!
  ctx.drawImage(
    image,
    Math.round(crop.x * scaleX),
    Math.round(crop.y * scaleY),
    canvas.width,
    canvas.height,
    0,
    0,
    canvas.width,
    canvas.height
  )

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Crop failed'))),
      'image/jpeg',
      quality
    )
  })
}

export function ImageCropper({ imageSrc, onCropDone, onCancel }: ImageCropperProps) {
  const [aspectIdx, setAspectIdx] = useState(0)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const imgRef = useRef<HTMLImageElement>(null)

  const aspect = ASPECT_OPTIONS[aspectIdx].value

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget
      const c = centerCrop(
        makeAspectCrop({ unit: '%', width: 90 }, aspect, width, height),
        width,
        height
      )
      setCrop(c)
    },
    [aspect]
  )

  const handleAspectChange = (idx: number) => {
    setAspectIdx(idx)
    if (!imgRef.current) return
    const { width, height } = imgRef.current
    const newAspect = ASPECT_OPTIONS[idx].value
    const c = centerCrop(
      makeAspectCrop({ unit: '%', width: 90 }, newAspect, width, height),
      width,
      height
    )
    setCrop(c)
  }

  const handleConfirm = async () => {
    if (!imgRef.current || !completedCrop) return
    const blob = await getCroppedBlob(imgRef.current, completedCrop)
    onCropDone(blob, ASPECT_OPTIONS[aspectIdx].label)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Aspect ratio buttons */}
      <div className="flex gap-2 rounded-xl bg-surface-container p-1">
        {ASPECT_OPTIONS.map((opt, i) => (
          <button
            key={opt.label}
            type="button"
            onClick={() => handleAspectChange(i)}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
              aspectIdx === i
                ? 'bg-secondary text-secondary-foreground'
                : 'text-muted-foreground'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Crop area */}
      <div className="flex max-h-[50vh] items-center justify-center overflow-hidden rounded-xl">
        <ReactCrop
          crop={crop}
          onChange={(c) => setCrop(c)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={aspect}
          className="max-h-[50vh]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={imageSrc}
            alt="Crop preview"
            onLoad={onImageLoad}
            className="max-h-[50vh] w-auto"
            style={{ maxWidth: '100%' }}
          />
        </ReactCrop>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl border-2 border-border py-3 text-sm font-semibold text-muted-foreground transition-all active:scale-95"
        >
          Abbrechen
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          className="flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all active:scale-95"
        >
          Zuschneiden
        </button>
      </div>
    </div>
  )
}
