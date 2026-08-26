import { format } from "date-fns";
import { es } from "date-fns/locale";

try {
  console.log("Testing format(undefined):");
  // @ts-ignore
  format(undefined, "dd", { locale: es });
} catch (e: any) {
  console.error("format(undefined) failed with:", e.message);
}

try {
  console.log("Testing format(null):");
  // @ts-ignore
  format(null, "dd", { locale: es });
} catch (e: any) {
  console.error("format(null) failed with:", e.message);
}
