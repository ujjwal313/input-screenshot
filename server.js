const express = require("express");
const app = express();
const cors = require("cors");
const puppeteer = require("puppeteer");

const PORT = 3500;

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

app.get("/screenshot", cors(), async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--window-size=1536,972",
      ],
      timeout: 100000,
    });

    const page = await browser.newPage();

    // const session = await page.target().createCDPSession();
    // const { windowId } = await session.send("Browser.getWindowForTarget");
    // await session.send("Browser.setWindowBounds", {
    //   windowId,
    //   bounds: { windowState: "minimized" },
    // });

    await page.setUserAgent(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36"
    );

    await page.goto(decodeURIComponent(req.query.url), {
      waitUntil: "networkidle2",
      timeout: 0,
    });
    await page.waitForNavigation();

    await page.setViewport({
      width: 1536,
      height: 972,
    });

    await autoScroll(page);

    const screenshot = await page.screenshot({
      //   path: "fullpage.png",
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
