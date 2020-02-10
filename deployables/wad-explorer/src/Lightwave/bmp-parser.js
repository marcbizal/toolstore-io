import { Parser } from "binary-parser";

const bmpFileHeader = new Parser()
  .endianess("little")
  .string("type", {
    length: 2,
    assert: "BM"
  })
  .uint32("size")
  .uint16("reserved1")
  .uint16("reserved2")
  .uint32("offBits");

const bmpInfoHeader = new Parser()
  .endianess("little")
  .uint32("size")
  .int32("width")
  .int32("height")
  .uint16("planes")
  .uint16("bitCount", {
    assert: 8
  })
  .uint32("compression")
  .uint32("sizeImage")
  .int32("xPelsPerMeter")
  .int32("yPelsPerMeter")
  .uint32("clrUsed")
  .uint32("clrImportant");

const bmpFile = new Parser()
  .nest("fileHeader", {
    type: bmpFileHeader
  })
  .nest("infoHeader", {
    type: bmpInfoHeader
  })
  .array("colors", {
    type: "uint8",
    length: function() {
      return this.infoHeader.clrUsed * 4;
    }
  })
  .array("data", {
    type: "uint8",
    length: function() {
      return this.infoHeader.width * this.infoHeader.height;
    }
  });

export default bmpFile;
