export function waitElementRender(
  elementSelector: string,
  waitRenderInterval: number,
  waitTimeout: number,
): Promise<void> {
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

      window.setTimeout(checkElementLoop, waitRenderInterval);
    };

    checkElementLoop();
  });
}
