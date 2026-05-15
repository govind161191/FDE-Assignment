// FastAPI detail can be a string (e.g. "Not found") or a Pydantic validation
// error array [{type, loc, msg, input, ctx}]. Always return a plain string.
export function getApiError(e, fallback = "Operation failed") {
  const detail = e?.response?.data?.detail;
  if (!detail) return e?.message || fallback;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((d) => d.msg).join("; ");
  return fallback;
}
