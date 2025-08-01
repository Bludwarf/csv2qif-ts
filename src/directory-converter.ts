import {FileConverter} from "./file-converter";
import fs from "fs";
import path from "path";

export class DirectoryConverter extends FileConverter {
  convert(
    inputDirectory?: string,
    outputDirectory?: string
  ): void {
    if (!outputDirectory) {
      if (inputDirectory) {
        outputDirectory = inputDirectory;
      } else {
        inputDirectory = './input';
        outputDirectory = './output';
      }
    }
    if (!inputDirectory) {
      throw new Error('Please specify inputDirectory');
    }

    const fileConverter = new FileConverter(this.rowConverter);
    const inputFileNames = fs.readdirSync(inputDirectory);
    for (const inputFileName of inputFileNames) {
      const inputFile = path.join(inputDirectory, inputFileName);
      if (fs.lstatSync(inputFile).isDirectory()) {
        console.log(`Directory ${inputFile} ignored.`);
        continue;
      }

      const inputFileExt = path.extname(inputFileName);
      if (inputFileExt.toLocaleLowerCase() !== '.csv') {
        console.log(`File ${inputFile} ignored.`);
        continue;
      }

      const outputFile = this.getOutputFile(inputFileName, inputFileExt, outputDirectory);
      console.log(`Converting ${inputFile} to ${outputFile}...`)
      fileConverter.convert(inputFile, outputFile);
    }
  }

  private getOutputFile(inputFileName: string, inputFileExt: string, outputDirectory: string) {
    const outputFileName = inputFileName.slice(0, -inputFileExt.length) + '.qif';
    return path.join(outputDirectory, outputFileName);
  }
}
