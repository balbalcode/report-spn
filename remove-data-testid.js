const fs = require("fs");

const removeBindedDataTestId = (filePath) => {
  const fileContent = fs.readFileSync(filePath, "utf8");
  const updatedContent = fileContent.replace(/\sdata-testid="[^"]*"/g, "");
  fs.writeFileSync(filePath, updatedContent);
};

const removeDataTestId = (filePath) => {
  const fileContent = fs.readFileSync(filePath, "utf8");
  const updatedContent = fileContent.replace(/\s:data-testid="[^"]*"/g, "");
  fs.writeFileSync(filePath, updatedContent);
};

const traverseDirectory = (directoryPath) => {
  fs.readdirSync(directoryPath).forEach((file) => {
    const filePath = directoryPath + file;
    const isDirectory = fs.statSync(filePath).isDirectory();

    if (isDirectory) {
      traverseDirectory(filePath + "/");
    } else if (file.endsWith(".vue")) {
      removeBindedDataTestId(filePath);
      removeDataTestId(filePath);
    }
  });
};

// Provide the path to your components directory
const componentsDirectory = "components/";

// Call the function to remove data-testid attributes from all component files
traverseDirectory(componentsDirectory);
