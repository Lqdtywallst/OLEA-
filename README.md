# Olea — Gestión de Alquileres Turísticos en Colombia

Landing page de alta conversión para Olea, empresa de gestión integral de
alquileres turísticos (Airbnb, Booking, Vrbo y más) enfocada en el mercado
colombiano.

## Características

- Página única autocontenida (`index.html`) con HTML, CSS y JavaScript inline.
- Sin dependencias externas salvo Google Fonts (`Fraunces` e `Inter`).
- Totalmente responsive (mobile-first).
- Calculadora de ingresos basada en datos reales de mercado 2025-2026
  (Airbtics, AirDNA, Fedelonjas/Camacol y TheLatinvestor): tarifa media por
  noche × ocupación × 30,4 noches, ajustada por tipo, m², estrato, piso, zona y
  extras, y neta tras comisión de gestión del 15%.
- Secciones: hero, plataformas, servicios reforzados con IA, calculadora,
  estadísticas, proceso, testimonios, FAQ, contacto y footer.

## Uso

Abre `index.html` directamente en el navegador, o sirve la carpeta con un
servidor estático:

```bash
python3 -m http.server 8080
# luego visita http://127.0.0.1:8080/index.html
```

## Personalización rápida

- **Colores:** variables CSS en `:root` (paleta oliva, terracota, crema, dorado).
- **Marca:** texto `OLEA` en el header y footer.
- **Contacto / redes:** enlaces de WhatsApp (`https://wa.me/XXXXXXXXXX`),
  Instagram y LinkedIn.
- **Calculadora:** factores en los objetos `cityData`, `typeFactors`,
  `estratoFactors`, `floorFactors` y `zoneFactors` dentro del `<script>`.
