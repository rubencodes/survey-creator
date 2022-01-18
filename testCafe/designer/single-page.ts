import { ClientFunction, Selector } from "testcafe";
import { addQuestionByAddQuestionButton, urlSingle, selectedObjectTextSelector } from "../helper";
const title = "Single Page mode";

fixture`${title}`.page`${urlSingle}`.beforeEach(
  async (t) => {
    await t.maximizeWindow();
  }
);

const settingsButtonSelector = Selector(".sv-action-bar-item[title=\"Settings\"]");

test("Single Page mode", async t => {
  await t
    .expect(Selector(".svc-page__add-new-question > span").withText("Add Question").visible).ok()
    .click(Selector(".svc-page__add-new-question > span").withText("Add Question"))
    .expect(Selector("span").withText("question1").visible).ok()
    .click(settingsButtonSelector)
    .click(Selector(".svc-tab-designer .svc-question__content"), { offsetX: 5, offsetY: 50 })
    .expect(Selector(selectedObjectTextSelector).innerText).eql("question1")
    .click(Selector("span[aria-placeholder='Page 1']"))
    .expect(Selector(selectedObjectTextSelector).innerText).eql("Survey");
});