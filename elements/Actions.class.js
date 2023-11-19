export default class Instruction {
  constructor(page, instructions) {
    this.page = page;
    this.instructions = instructions;
  }

  performAction = async (actionInput, selectorInput) => {
    switch (actionInput) {
      case "click":
        await selectorInput.waitFor();
        await selectorInput.click();
    }
  };
}
