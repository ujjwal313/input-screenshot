const express = require("express");
const app = express();
const cors = require("cors");
const puppeteer = require("puppeteer");

const PORT = 3500;

const autoScroll = async (page) => {
  await page.evaluate(async () => {
    await new Promise
    ((resolve, reject) => {
      let totalHeight = 0;
      let distance = 100;
      let timer = setInterval(() => {
        let scrollHeight = document.body.scrollHeight;
        // sleep(2000);
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 1000);
    });
  });
};


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
app.get("/screenshot", cors(), async (req, res) => {
  console.log("api calld");
  try {
    const browser = await puppeteer.launch({
    headless: false
    });

    const page = await browser.newPage();

    // const session = await page.target().createCDPSession();
    // const { windowId } = await session.send("Browser.getWindowForTarget");
    // await session.send("Browser.setWindowBounds", {
    //   windowId,
    //   bounds: { windowState: "minimized" },
    // });

    await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 0 });

    await page.goto(decodeURIComponent(req.query.url), {
      waitUntil: "networkidle0",
      timeout: 0,
    });
    // await page.waitForNavigation();

    await autoScroll(page);

    const screenshot = await page.screenshot({
        path: "fullpage.png",
      fullPage: true,
    });

    browser.close();

    res.set({
      "Content-Type": "image/jpeg",
      "Content-Length": screenshot.length,
    });

    res.status(200).send(screenshot);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false });
  }
});

app.listen(PORT, () => {
  console.log("server running on 3500");
});
