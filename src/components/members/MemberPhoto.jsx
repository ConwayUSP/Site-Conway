import { useState } from 'react'
import './MemberPhoto.css'

const supportedAccents = new Set(['gray', 'red', 'yellow', 'blue', 'violet'])

function MemberPhoto({ src, alt = '', className = '', loading = 'lazy', ambient = false, accent = 'violet' }) {
  const [failedSrc, setFailedSrc] = useState(null)
  const hasValidPhoto = Boolean(src) && failedSrc !== src
  const safeAccent = supportedAccents.has(accent) ? accent : 'violet'

  return (
    <div
      className={`member-photo-placeholder ${hasValidPhoto ? 'has-photo' : 'has-silhouette'} ${className}`.trim()}
      style={{ '--member-photo-accent': `var(--brand-${safeAccent})` }}
    >
      {hasValidPhoto ? (
        <>
          {ambient && (
            <img
              className="member-photo-backdrop"
              src={src}
              alt=""
              aria-hidden="true"
            />
          )}
          <img
            className="member-photo-foreground"
            src={src}
            alt={alt}
            loading={loading}
            onError={() => setFailedSrc(src)}
          />
        </>
      ) : (
        <div className="member-photo-silhouette" aria-hidden="true" />
      )}
    </div>
  )
}

export default MemberPhoto
