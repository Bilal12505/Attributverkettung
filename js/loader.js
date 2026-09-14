export class Loader {
  async showLoader() {
    const loader = document.querySelector('.loader');
    loader.style.display = 'flex';
    loader.scrollIntoView();
  }

  async hideLoader() {
    const loader = document.querySelector('.loader');
    const logoBS = document.querySelector('.logo-bs-loading');
    logoBS.src = './img/check.gif';
    logoBS.style.width = '20vw';
    logoBS.style.height = 'auto';
    setTimeout(() => {
      loader.style.display = 'none';
      logoBS.src = './img/logoBSSP.gif';
      logoBS.style.height = '80px';
      logoBS.style.width = 'auto';
    }, 1800);
  }
}
