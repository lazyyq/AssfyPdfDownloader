// Content script runs on web pages
console.log(
  "%c Chrome Extension: Content script loaded ",
  "background: #222; color: #bada55"
);

// Add loading indicator styles
const style = document.createElement("style");
style.textContent = `
  .pdf-loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    z-index: 9999;
  }
  .pdf-loader-progress {
    margin-top: 10px;
    font-size: 14px;
  }
`;
document.head.appendChild(style);

// Inject code into the webpage's context
function injectScript(func) {
  const script = document.createElement("script");
  script.textContent = `(${func.toString()})();`;
  document.documentElement.appendChild(script);
  script.remove();
}

// Function to add the download button
function addDownloadButton() {
  console.log("Attempting to add download buttons...");
  const btnGroups = document.querySelectorAll(
    "nav.navbar-static-top > div.container-fluid > div.btn-toolbar > div.btn-group"
  );
  if (!btnGroups || btnGroups.length === 0) {
    console.log("Button groups not found, retrying in 1 second...");
    setTimeout(addDownloadButton, 1000);
    return;
  }

  // Add button to each group
  btnGroups.forEach((group) => {
    // Check if button already exists in this group
    if (group.querySelector('button[command="downloadAsPdf"]')) {
      console.log("Download button already exists in group");
      return;
    }

    console.log("Adding download button to group...");
    const downloadButton = document.createElement("button");
    downloadButton.innerHTML = `
      <!--svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="-64 -64 640 640" class="icon svg-icon off replaced-svg"><path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 242.7-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7 288 32zM64 352c-35.3 0-64 28.7-64 64l0 32c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-32c0-35.3-28.7-64-64-64l-101.5 0-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352 64 352zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/></svg-->
      <!--svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="-64 -64 640 640" class="icon svg-icon on replaced-svg"><path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 242.7-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7 288 32zM64 352c-35.3 0-64 28.7-64 64l0 32c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-32c0-35.3-28.7-64-64-64l-101.5 0-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352 64 352zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/></svg-->
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="-64 -64 640 640" class="icon svg-icon off replaced-svg"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 144-208 0c-35.3 0-64 28.7-64 64l0 144-48 0c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128zM176 352l32 0c30.9 0 56 25.1 56 56s-25.1 56-56 56l-16 0 0 32c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-48 0-80c0-8.8 7.2-16 16-16zm32 80c13.3 0 24-10.7 24-24s-10.7-24-24-24l-16 0 0 48 16 0zm96-80l32 0c26.5 0 48 21.5 48 48l0 64c0 26.5-21.5 48-48 48l-32 0c-8.8 0-16-7.2-16-16l0-128c0-8.8 7.2-16 16-16zm32 128c8.8 0 16-7.2 16-16l0-64c0-8.8-7.2-16-16-16l-16 0 0 96 16 0zm80-112c0-8.8 7.2-16 16-16l48 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 32 32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 48c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-64 0-64z"/></svg>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="-64 -64 640 640" class="icon svg-icon on replaced-svg"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 144-208 0c-35.3 0-64 28.7-64 64l0 144-48 0c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128zM176 352l32 0c30.9 0 56 25.1 56 56s-25.1 56-56 56l-16 0 0 32c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-48 0-80c0-8.8 7.2-16 16-16zm32 80c13.3 0 24-10.7 24-24s-10.7-24-24-24l-16 0 0 48 16 0zm96-80l32 0c26.5 0 48 21.5 48 48l0 64c0 26.5-21.5 48-48 48l-32 0c-8.8 0-16-7.2-16-16l0-128c0-8.8 7.2-16 16-16zm32 128c8.8 0 16-7.2 16-16l0-64c0-8.8-7.2-16-16-16l-16 0 0 96 16 0zm80-112c0-8.8 7.2-16 16-16l48 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 32 32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 48c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-64 0-64z"/></svg>
      <div class="label label-default">Download as PDF</div>
    `;
    downloadButton.className = "btn";
    downloadButton.title = "DownloadAsPdf";
    downloadButton.setAttribute("command", "downloadAsPdf");
    downloadButton.addEventListener("click", handleDownload);
    group.appendChild(downloadButton);
    console.log("Download button added successfully to group");
  });
}

// Start trying to add the button immediately
console.log("Content script loaded, starting button addition...");
addDownloadButton();

// Also listen for DOMContentLoaded in case the page isn't ready yet
document.addEventListener("DOMContentLoaded", addDownloadButton);

// Add a fallback using MutationObserver in case the button group loads dynamically
const observer = new MutationObserver((mutations, obs) => {
  const btnGroups = document.querySelectorAll(
    "nav.navbar-static-top > div.container-fluid > div.btn-toolbar > div.btn-group"
  );
  if (btnGroups && btnGroups.length > 0) {
    addDownloadButton();
    obs.disconnect(); // Stop observing once button is added
  } else {
    console.log("Button groups not found");
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// The function that will run in webpage context
async function handleDownload() {
  const loader = showLoader("Preparing to capture slides...");
  try {
    // Remember current page number
    const currentPageLabel = document.querySelector("span.label-page");
    const originalPage = currentPageLabel
      ? parseInt(currentPageLabel.textContent.split("/")[0].trim())
      : 1;

    // Go to first page
    const firstPageBtn = document.querySelector(
      "div.btn-toolbar > div.btn-group > button[command=firstPage]"
    );
    firstPageBtn.click();

    let currentPage = 1;
    const images = [];

    while (true) {
      updateLoader(loader, `Processing page ${currentPage}...`);

      // Wait for image to load
      const image = await waitForImage(currentPage);
      if (!image) break;

      // Convert image to base64
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0);
      images.push(canvas.toDataURL("image/jpeg"));

      // Check if next page exists and is not disabled
      const nextButton = document.querySelector(
        "div.btn-toolbar > div.btn-group > button[command=nextPage]"
      );
      if (!nextButton || nextButton.disabled) break;

      // Random delay before going to next page
      await randomDelay();

      // Go to next page
      currentPage++;
      nextButton.click();
    }

    // Create and download PDF
    if (images.length > 0) {
      updateLoader(loader, "Creating PDF file...");
      const pdf = await createPDF(images);
      downloadPDF(pdf);

      // Return to original page
      updateLoader(loader, "Returning to original page...");
      const pageInput = document.querySelector("input.input-page");
      if (pageInput) {
        pageInput.click(); // Focus the input first
        pageInput.value = originalPage;
        pageInput.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "Enter",
            code: "Enter",
            which: 13,
            keyCode: 13,
          })
        );
      }

      removeLoader(loader);
    } else {
      throw new Error("No images were captured");
    }
  } catch (error) {
    console.error("PDF creation failed:", error);
    removeLoader(loader);
    alert(`Failed to create PDF: ${error.message}`);
  }
}

function showLoader(message) {
  const loader = document.createElement("div");
  loader.className = "pdf-loader";
  loader.innerHTML = `
    <h2>Creating PDF</h2>
    <div class="pdf-loader-progress">${message}</div>
  `;
  document.body.appendChild(loader);
  return loader;
}

function updateLoader(loader, message) {
  const progress = loader.querySelector(".pdf-loader-progress");
  if (progress) {
    progress.textContent = message;
  }
}

function removeLoader(loader) {
  if (loader && loader.parentNode) {
    loader.parentNode.removeChild(loader);
  }
}

function randomDelay() {
  const delay = 50 + Math.random() * 30;
  return new Promise((resolve) => setTimeout(resolve, delay));
}

function waitForImage(pageNum) {
  return new Promise((resolve) => {
    const checkImage = () => {
      const container = document.querySelector(
        `div.book-container > div.book > div.page-wrapper[page="${pageNum}"]`
      );
      if (!container) {
        resolve(null);
        return;
      }

      const img = container.querySelector("img.background");
      if (img && img.complete) {
        resolve(img);
      } else {
        setTimeout(checkImage, 100);
      }
    };
    checkImage();
  });
}

async function createPDF(images) {
  return new Promise((resolve, reject) => {
    try {
      // Create a temporary image to get dimensions
      const tempImage = new Image();
      tempImage.onload = () => {
        try {
          // Create PDF document with the first image's dimensions
          const doc = new PDFDocument({
            autoFirstPage: false,
            size: [tempImage.width, tempImage.height],
          });

          // Collect PDF data chunks
          const chunks = [];
          doc.on("data", chunks.push.bind(chunks));

          doc.on("end", () => {
            // Combine chunks into a single Blob
            const pdfBlob = new Blob(chunks, { type: "application/pdf" });
            resolve(pdfBlob);
          });

          // Add each image as a new page
          for (let i = 0; i < images.length; i++) {
            doc.addPage({
              size: [tempImage.width, tempImage.height],
            });
            doc.image(images[i], 0, 0, {
              width: tempImage.width,
              height: tempImage.height,
            });
          }

          // Finalize the PDF
          doc.end();
        } catch (error) {
          reject(error);
        }
      };

      tempImage.onerror = () => {
        reject(new Error("Failed to load image for PDF creation"));
      };

      // Load the first image to get dimensions
      tempImage.src = images[0];
    } catch (error) {
      reject(error);
    }
  });
}

function downloadPDF(pdfBlob) {
  const url = URL.createObjectURL(pdfBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `slides_${new Date().toISOString().split("T")[0]}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}
