export function isAlreadyRunningExtension(identifier: string): boolean {
  const meta: HTMLMetaElement | null = document.querySelector(`meta[name="${identifier}"]`);

  if (meta) {
    return true;
  }

  // Insert meta to head
  const metaElement: HTMLMetaElement = document.createElement('meta');
  metaElement.name = identifier;
  metaElement.content = 'true';
  document.head.appendChild(metaElement);

  return false;
}
