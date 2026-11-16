/**
 * Secure Backend Resume Service (Goal 5)
 * All storage keys and API secrets are securely retained on the backend microservice.
 * Frontend clients retrieve the file directly via backend streaming endpoint.
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://go-seek-backend.onrender.com';

export function getResumeDownloadUrl() {
  return `${BACKEND_URL}/api/resume/download`;
}

export async function fetchResumeBlob() {
  const url = getResumeDownloadUrl();
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch resume from backend: ${response.status} ${response.statusText}`);
  }

  return response.blob();
}

export async function triggerResumeDownload(defaultFilename = 'Srikanth_Yepalagunta_Resume.pdf') {
  try {
    const url = getResumeDownloadUrl();
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch resume from backend: ${response.status} ${response.statusText}`);
    }

    let filename = defaultFilename;
    const disposition = response.headers.get('content-disposition');
    if (disposition && disposition.includes('filename=')) {
      const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (match && match[1]) {
        filename = match[1].replace(/['"]/g, '').trim();
      }
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.warn('Direct stream fallback for resume:', err);
    window.open(getResumeDownloadUrl(), '_blank');
  }
}
