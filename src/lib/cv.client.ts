/** Helpers CV utilisables côté client (sans fs). */

export function getCvDisplayName(cvUrl: string | null | undefined): string {
  if (!cvUrl) return 'Mon CV'
  const filename = cvUrl.split('?')[0].split('/').pop() || ''
  if (filename.startsWith('default-etudiant-')) {
    const parts = filename.split('-')
    const original = parts.slice(4).join('-')
    return original || 'CV par défaut.pdf'
  }
  return filename.replace(/^[^-]+-\d+-/, '').replace(/_/g, ' ') || 'Mon CV.pdf'
}
