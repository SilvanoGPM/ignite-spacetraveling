import { useEffect, useRef } from 'react';

export function Comments() {
  const commentsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (commentsRef.current?.children.length) {
      return;
    }

    const scriptEl = document.createElement('script');

    scriptEl.setAttribute('src', 'https://utteranc.es/client.js');
    scriptEl.setAttribute('crossorigin', 'anonymous');
    scriptEl.setAttribute('async', 'true');
    scriptEl.setAttribute('repo', 'SilvanoGPM/ignite-spacetraveling');
    scriptEl.setAttribute('label', 'spacetraveling-comments');
    scriptEl.setAttribute('issue-term', 'title');
    scriptEl.setAttribute('theme', 'github-dark');

    commentsRef.current?.appendChild(scriptEl);
  }, []);

  return <div ref={commentsRef} />;
}
