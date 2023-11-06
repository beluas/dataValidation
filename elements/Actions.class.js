export default class Action {
  constructor(page) {
    this.page = page;
  }

  performAction = async (actionInput, selectorInput) => {
    switch (actionInput) {
      case "click":
        await selectorInput.waitFor();
        await selectorInput.click();
    }
  };
}
