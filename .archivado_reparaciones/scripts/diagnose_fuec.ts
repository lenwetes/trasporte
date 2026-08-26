
import { prisma } from "../src/lib/prisma";
import { FuecGenerator } from "../src/lib/pdf/fuec-generator-v2";

async function main() {
  const fuecId = process.argv[2];
  if (!fuecId) {
    console.error("Missing FUEC ID");
    process.exit(1);
  }

  console.log(`Diagnosing FUEC ${fuecId}...`);
  try {
    const buffer = await FuecGenerator.generateBuffer(fuecId);
    console.log("Success! Generated buffer of size:", buffer.length);
  } catch (error) {
    console.error("FAILED with error:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
