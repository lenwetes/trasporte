
import { getCalendarEvents } from "../src/actions/calendar";

async function main() {
  console.log("Testing getCalendarEvents...");
  try {
    // Note: this might fail because of lack of auth session if I'm running from CLI,
    // but at least I can see if the error is still the same (42P01) or something else.
    const result = await getCalendarEvents(0);
    console.log("Result:", result);
  } catch (error) {
    console.error("Caught error:", error);
  }
}

main();
