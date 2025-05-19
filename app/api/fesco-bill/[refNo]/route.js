import puppeteer from "puppeteer";

export async function GET(request, { params }) {
  const refNo = params.refNo;

  if (!refNo) {
    return new Response("Reference number is required", { status: 400 });
  }

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto("https://bill.pitc.com.pk/fescobill/", {
      waitUntil: "networkidle2",
    });
    await page.type("#searchTextBox", refNo);
    await page.click('[name="btnSearch"]');
    await page.waitForNavigation({ waitUntil: "networkidle2" });

    const html = await page.content();
    await browser.close();

    return new Response(html, {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      "<h3>Error fetching bill. Try again or check logs.</h3>",
      { status: 500, headers: { "Content-Type": "text/html" } }
    );
  }
}
