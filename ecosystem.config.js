module.exports = {
  apps: [
    {
      name: "assertionHub",
      script: "sh",
      args: "-c \"xvfb-run --server-args='-screen 0 1024x768x24' node server.js\"",
      // Include other necessary configurations like env variables
    },
  ],
};
