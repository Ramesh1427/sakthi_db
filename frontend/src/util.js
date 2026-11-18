export const ytId = url => ((url || '').match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/) || [])[1]
export const fmt = d => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
