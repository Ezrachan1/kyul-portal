// Uploads a File via base64 JSON to /api/upload and returns the served URL.
export function useUpload() {
  function toDataUrl(file) {
    return new Promise((resolve, reject) => {
      const fr = new FileReader()
      fr.onload = () => resolve(fr.result)
      fr.onerror = () => reject(new Error('Could not read the file.'))
      fr.readAsDataURL(file)
    })
  }

  async function upload(file) {
    if (file.size > 25 * 1024 * 1024) throw new Error('File too large (max 25MB).')
    const dataUrl = await toDataUrl(file)
    const res = await $fetch('/api/upload', {
      method: 'POST',
      body: { name: file.name, type: file.type, dataUrl },
    })
    return res.url
  }

  return { upload }
}
