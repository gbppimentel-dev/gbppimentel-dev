/* CHANGE VERSION: PAGE-LOADER-R3 | Synchronized shape and color echoes */
const loaderShape = "M10,20 C10,17.24 11.12,14.74 12.93,12.93 L12.93,12.93 C14.74,11.12 17.24,10 20,10 L80,10 C82.76,10 85.26,11.12 87.07,12.93 L87.07,12.93 C88.88,14.74 90,17.24 90,20 L90,80 C90,82.76 88.88,85.26 87.07,87.07 L87.07,87.07 C85.26,88.88 82.76,90 80,90 L20,90 C17.24,90 14.74,88.88 12.93,87.07 L12.93,87.07 C11.12,85.26 10,82.76 10,80Z M68,50 C68,45.02 65.98,40.52 62.72,37.27 L62.72,37.27 C59.47,34.01 54.97,32 50,32 L50,32 C45.02,32 40.52,34.01 37.27,37.27 L37.27,37.27 C34.01,40.52 32,45.02 32,50 L32,50 C32,54.97 34.01,59.47 37.27,62.72 L37.27,62.72 C40.52,65.98 45.02,68 50,68 L50,68 C54.97,68 59.47,65.98 62.72,62.72 L62.72,62.72 C65.98,59.47 68,54.97 68,50Z";

export default function PageLoader({ visible }) {
  return (
    <div
      className={`page-loader${visible ? " is-visible" : ""}`}
      role={visible ? "status" : undefined}
      aria-hidden={!visible}
      aria-live="polite"
      aria-label={visible ? "Loading page" : undefined}
    >
      <div className="page-loader__content">
        <div className="loader" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <path d={loaderShape} />
            <path d={loaderShape} />
            <path d={loaderShape} />
            <path d={loaderShape} />
          </svg>
        </div>
      </div>
    </div>
  );
}
