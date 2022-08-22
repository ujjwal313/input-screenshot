const puppeteer = require("puppeteer");

export const screenshotWeb = async (url) => {
  const autoScroll = async (page) => {
    await page.evaluate(async () => {
      await new Promise((resolve, reject) => {
        let totalHeight = 0;
        let distance = 100;
        let timer = setInterval(() => {
          let scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight - window.innerHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });
  };

  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--window-size=1920,1080",
    ],
    timeout: 100000,
  });

  const page = await browser.newPage();

  const session = await page.target().createCDPSession();
  const { windowId } = await session.send("Browser.getWindowForTarget");
  await session.send("Browser.setWindowBounds", {
    windowId,
    bounds: { windowState: "minimized" },
  });

  await page.setUserAgent(
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36"
  );

  await page.goto(url, {
    waitUntil: "networkidle2",
    // timeout: 0,
  });

  await page.setViewport({
    width: 1920,
    height: 1080,
  });

  await autoScroll(page);

  const screenshot = await page.screenshot({
    //   path: "fullpage.png",
    fullPage: true,
  });

  console.log(typeof screenshot);
  browser.close();
};
