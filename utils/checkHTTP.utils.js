const isGARequest = (url) => {
  return (
    (url.includes("collect?") && url.includes("region")) ||
    url.includes("analytics")
  );
};

const getInstructions = (data) => {};

module.exports = { isGARequest, getInstructions };
