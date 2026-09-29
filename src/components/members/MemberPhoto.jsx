import { useState } from 'react'
import './MemberPhoto.css'

function MemberPhoto({ src, alt = '', className = '', loading = 'lazy', ambient = false }) {
  const [failedSrc, setFailedSrc] = useState(null)
  const hasValidPhoto = Boolean(src) && failedSrc !== src

  return (
    <div className={`member-photo-placeholder ${className}`.trim()}>
      {hasValidPhoto && (
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
      )}
    </div>
  )
}

export default MemberPhoto
