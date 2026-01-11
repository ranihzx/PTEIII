//Menu lateral (desktop)
const navs = document.querySelectorAll('.nav h2');

//Menu superior (mobile)
const navsMobile = document.querySelectorAll('.nav-mobile h2');

const navsContent = document.querySelectorAll('.nav-content > div');

//PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

//Carrossel PDF
function renderCarousel(carousel) {
    if (carousel.dataset.loaded === "true") return;

    const pdfUrl = carousel.dataset.pdf;
    const canvas = carousel.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    const prevBtn = carousel.querySelector(".prev");
    const nextBtn = carousel.querySelector(".next");
    const pageInfo = carousel.querySelector(".page-info");

    let pdfDoc = null;
    let pageNum = 1;

    function renderPage(num) {
        pdfDoc.getPage(num).then(page => {
            const scale = 1.4;
            const viewport = page.getViewport({ scale });

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            page.render({
                canvasContext: ctx,
                viewport: viewport
            });

            pageInfo.textContent = `Slide ${pageNum} de ${pdfDoc.numPages}`;
            prevBtn.disabled = pageNum === 1;
            nextBtn.disabled = pageNum === pdfDoc.numPages;
        });
    }

    pdfjsLib.getDocument(pdfUrl).promise.then(pdf => {
        pdfDoc = pdf;
        renderPage(pageNum);
        carousel.dataset.loaded = "true";
    });

    prevBtn.onclick = () => {
        if (pageNum > 1) {
            pageNum--;
            renderPage(pageNum);
        }
    };

    nextBtn.onclick = () => {
        if (pageNum < pdfDoc.numPages) {
            pageNum++;
            renderPage(pageNum);
        }
    };
}

//Menu e renderização de PDFs (desktop)
navs.forEach((nav, index) => {
    nav.addEventListener('click', () => {

        navsContent.forEach(content => content.classList.remove("active"));
        navs.forEach(nav => nav.classList.remove("active"));

        navs[index].classList.add("active");
        navsContent[index].classList.add("active");

        navsContent[index]
            .querySelectorAll(".pdf-carousel")
            .forEach(renderCarousel);
    });
});

//Menu e renderização de PDFs (mobile)
navsMobile.forEach((nav, index) => {
    nav.addEventListener('click', () => {

        navsContent.forEach(content => content.classList.remove("active"));
        navsMobile.forEach(nav => nav.classList.remove("active"));

        navsMobile[index].classList.add("active");
        navsContent[index].classList.add("active");

        navsContent[index]
            .querySelectorAll(".pdf-carousel")
            .forEach(renderCarousel);
    });
});

//Primeira aba carregada
document.addEventListener("DOMContentLoaded", () => {
    document
        .querySelectorAll(".nav-content .active .pdf-carousel")
        .forEach(renderCarousel);
});
