import React, { useState, useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import "pdfjs-dist/legacy/build/pdf.worker"; // Load the worker

// Set worker source manually
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/legacy/build/pdf.worker.min.js",
  import.meta.url
).toString();

const Resume = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const renderTaskRef = useRef(null); // Store the active render task

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument("/resume.pdf");
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
        renderPage(pdf, pageNum);
      } catch (error) {
        console.error("Error loading PDF:", error);
      }
    };

    loadPdf();
  }, []);

  const renderPage = async (pdf, num) => {
    if (!pdf) return;

    const page = await pdf.getPage(num);
    const containerWidth = containerRef.current?.clientWidth || 600; // Default width
    const viewport = page.getViewport({ scale: containerWidth / page.getViewport({ scale: 1 }).width });

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Clear previous render
    if (renderTaskRef.current) {
      renderTaskRef.current.cancel();
    }
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Set new dimensions
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Render the page
    const renderContext = { canvasContext: context, viewport: viewport };
    const renderTask = page.render(renderContext);

    // Store the render task reference
    renderTaskRef.current = renderTask;

    try {
      await renderTask.promise;
    } catch (error) {
      if (error.name !== "RenderingCancelledException") {
        console.error("Render error:", error);
      }
    }
  };

  return (
    <section id="resume" className="min-h-screen flex flex-col items-center justify-center bg-primary p-6">
      <h1 className="text-4xl font-bold text-white mb-4">My Resume</h1>

      {isMobile ? (
        <div className="flex flex-col items-center text-center">
          <p className="text-white text-lg mb-4">Tap below to view or download:</p>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
          >
            Open Resume
          </a>
        </div>
      ) : (
        <div ref={containerRef} className="relative w-full max-w-4xl flex justify-center items-center bg-white p-4 rounded-lg shadow-lg">
          <canvas ref={canvasRef} className="rounded-md" />
        </div>
      )}

      <a
        href="/resume.pdf"
        download="Matthew_Ngoy_Resume.pdf"
        className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
      >
        Download Resume
      </a>
    </section>
  );
};

export default Resume;
