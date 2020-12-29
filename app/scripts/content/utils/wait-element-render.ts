const WAIT_ELEMENT_RENDER_INTERVAL = 50;

export function waitElementRender(elementSelector: string, waitTimeout: number): Promise<void> {
  return new Promise((resolve, reject): void => {
    const loopStartTime = Date.now();

    const checkElementLoop = (): void => {
      // Found element
      if (document.querySelectorAll(elementSelector).length > 0) {
        resolve();
        return;
      }

      // Timeout
      if (Date.now() - loopStartTime > waitTimeout) {
        reject();
        return;
      }

      window.setTimeout(checkElementLoop, WAIT_ELEMENT_RENDER_INTERVAL);
    };

    checkElementLoop();
  });
}
