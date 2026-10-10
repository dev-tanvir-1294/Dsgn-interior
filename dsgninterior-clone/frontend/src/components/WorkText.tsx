'use client';

import { useState } from 'react';

type WorkTextProps = {
  intro: string;
  body: string;
};

/** The project description with the "Read more" expand/collapse. */
export function WorkText({ intro, body }: WorkTextProps) {
  const [expanded, setExpanded] = useState(false);
  const hasBody = Boolean(body && body.trim());
  const className = `work-text${hasBody ? '' : ' no-readmore'}${expanded ? ' expanded' : ''}`;

  return (
    <div className={className}>
      <p className="presentation split" dangerouslySetInnerHTML={{ __html: intro }} />
      {hasBody && (
        <>
          <button
            className="readmore-toggle ns"
            aria-expanded={expanded}
            aria-controls="readmore"
            onClick={() => setExpanded((v) => !v)}
          >
            Read more
          </button>
          <div className="readmore" id="readmore">
            <div className="readmore-content" dangerouslySetInnerHTML={{ __html: body }} />
          </div>
        </>
      )}
    </div>
  );
}
