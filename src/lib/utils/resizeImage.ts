/**
 * Loads a File/Blob into an HTMLImageElement.
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/**
 * Resizes an image file to fit within maxSize (longest side) and converts to JPEG.
 * Handles HEIC and all browser-supported formats via Canvas API.
 */
export async function resizeImage(
  file: File,
  maxSize = 1200,
  quality = 0.85
): Promise<Blob> {
  const url = URL.createObjectURL(file)

  try {
    const img = await loadImage(url)
    const { width, height } = img

    let targetW = width
    let targetH = height

    if (width > maxSize || height > maxSize) {
      if (width >= height) {
        targetW = maxSize
        targetH = Math.round((height / width) * maxSize)
      } else {
        targetH = maxSize
        targetW = Math.round((width / height) * maxSize)
      }
    }

    const canvas = document.createElement('canvas')
    canvas.width = targetW
    canvas.height = targetH
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0, targetW, targetH)

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('Canvas toBlob failed'))),
        'image/jpeg',
        quality
      )
    })
  } finally {
    URL.revokeObjectURL(url)
  }
}
