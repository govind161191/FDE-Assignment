import axios from "axios";

export async function getEtlSummary() {
  const { data } = await axios.get("/etl/summary");
  return data;
}

export function downloadExport(entity) {
  // Trigger a browser download by navigating to the export URL.
  window.open(`/etl/export/${entity}`, "_blank");
}
