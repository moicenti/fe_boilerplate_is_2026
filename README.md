This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## H1 · Cuotas y pagos

### Estado de cuenta (FE-1.1)

Ruta `/estado-de-cuenta` (`app/(dashboard)/estado-de-cuenta/page.tsx`). Consume
`GET /unidades/{unidadId}/estado-de-cuenta`; el residente ve solo su unidad (sale de la sesión) y el
administrador elige cualquiera con el selector de unidad (`?unidad=<uuid>`).

| Componente | Archivo | Qué muestra |
|---|---|---|
| `ResumenSaldo` | `app/components/pagos/ResumenSaldo.tsx` | Saldo pendiente total (de la API), importe vencido y próximo vencimiento |
| `TablaCuotas` | `app/components/pagos/TablaCuotas.tsx` | Cuotas por pagar o todas (`?ver=todas`), con su estado en texto y color |
| `HistorialPagos` | `app/components/pagos/HistorialPagos.tsx` | Lo aplicado a cada cuota por cada pago, filtrable por año (`?anio=`) |

- Los saldos no se recalculan en el cliente: se muestran los de la API. "Vencida" se deriva de la
  definición común (PENDIENTE o PARCIAL con vencimiento anterior a hoy, en hora del condominio).
- Estados: carga (`loading.tsx`), error con botón **Reintentar** (`ErrorCarga`) y vacío.

### Flujo de pago (FE-1.2)

Ruta `/pagos` (`app/(dashboard)/pagos/page.tsx` + `app/components/pagos/FlujoPago.tsx`), en tres
pasos sin recargar la página: **seleccionar cuotas → revisar y confirmar → comprobante**.

1. Se preseleccionan las cuotas vencidas (o las de `?cuotas=1,2`). El total es la suma de los saldos
   elegidos; se puede escribir un monto menor para un pago parcial (se aplica primero a la que vence antes).
2. Al confirmar se llama a la Server Action `pagarCuotas` (`app/actions/pagos.ts`), que toma la unidad
   de la sesión y hace `POST /pagos`. El botón se deshabilita mientras se envía y un guardia evita el
   doble clic; cada revisión genera una `referencia` única, así un reenvío responde 409 en lugar de cobrar dos veces.
3. Con éxito se muestra el comprobante y el estado de cuenta se revalida en el mismo viaje.

Medio de pago: dos tarjetas guardadas de demostración o **otra tarjeta de un solo uso** (número,
nombre, vencimiento MM/AA y CVV; validada en `lib/tarjeta.ts`, componente `MedioDePago`). La pasarela
simulada del backend tarda 5 s, aprueba siempre la tarjeta que termina en **2026** y rechaza siempre la que
termina en **2000**; la interfaz no lo anuncia. El número completo, el vencimiento y el CVV nunca salen
del navegador: solo se envían los últimos 4 dígitos, y la tarjeta de un solo uso se borra tras pagar.

### Moneda

Todos los importes (H1 y reglas de cuota de H3) usan la moneda de `NEXT_PUBLIC_MONEDA` (código ISO
4217; por defecto `USD`), definida en `lib/moneda.ts` junto con `formatMonto` y `SIMBOLO_MONEDA`. Next la
incrusta al compilar: tras cambiarla, reinicia `npm run dev` o vuelve a hacer `npm run build`.

| Error de la API | Qué ve el residente |
|---|---|
| 402 `PAGO_RECHAZADO` | Tarjeta rechazada, sin cobro; sigue en la revisión para elegir otra tarjeta |
| 409 `CUOTA_YA_PAGADA` | La cuota ya está pagada o la referencia se repitió; vuelve a la selección con las cuotas actualizadas |
| 422 `MONTO_EXCEDE_DEUDA` | El monto supera lo adeudado, sin cobro (también se valida antes de enviar) |
| 404 `CUOTA_INEXISTENTE` | La cuota ya no existe; vuelve a la selección actualizada |
| 403 / 401 | No puede pagar esa unidad / la sesión venció y se redirige al login |

En todos los errores se conserva la selección para reintentar.
