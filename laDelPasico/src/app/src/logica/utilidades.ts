export function generarIdempotencyKeyImpresion() : string {
  return `app-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
