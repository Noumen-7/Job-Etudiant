import { copyFile, unlink } from 'fs/promises'
import path from 'path'

export function getCvFilename(cvUrl: string | null | undefined): string | null {
  if (!cvUrl) return null
  const clean = cvUrl.split('?')[0]
  return path.basename(clean)
}

export function buildCvStoragePath(filename: string) {
  return `/uploads/cv/${filename}`
}

export function validateCvFile(file: File) {
  if (!file.name.toLowerCase().endsWith('.pdf')) {
    return 'Le CV doit être au format PDF'
  }
  if (file.type && file.type !== 'application/pdf') {
    return 'Le CV doit être au format PDF'
  }
  if (file.size > 10 * 1024 * 1024) {
    return 'Le CV ne doit pas dépasser 10 Mo'
  }
  return null
}

export async function deleteCvFile(cvUrl: string | null | undefined) {
  const filename = getCvFilename(cvUrl)
  if (!filename) return
  try {
    await unlink(path.join(process.cwd(), 'public', 'uploads', 'cv', filename))
  } catch {
    // fichier déjà absent
  }
}

export function getCvUploadDir() {
  return path.join(process.cwd(), 'public', 'uploads', 'cv')
}

export async function copyCvForCandidature(sourceCvUrl: string, etudiantId: string): Promise<string> {
  const sourceFilename = getCvFilename(sourceCvUrl)
  if (!sourceFilename) throw new Error('CV source invalide')

  const uploadDir = getCvUploadDir()
  const destFilename = `${etudiantId}-${Date.now()}-candidature.pdf`
  await copyFile(
    path.join(uploadDir, sourceFilename),
    path.join(uploadDir, destFilename)
  )
  return buildCvStoragePath(destFilename)
}

export function getCvDisplayName(cvUrl: string | null | undefined): string {
  const filename = getCvFilename(cvUrl)
  if (!filename) return 'Mon CV'
  if (filename.startsWith('default-etudiant-')) return 'CV par défaut.pdf'
  return filename.replace(/^[^-]+-\d+-/, '').replace(/_/g, ' ') || 'Mon CV.pdf'
}
