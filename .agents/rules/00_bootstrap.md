---
trigger: always_on
---

# 🤖 00 Bootstrap: Orquestador de Carga Inicial

Este documento define la jerarquía de lectura obligatoria para cualquier Agente AI que interactúe con el repositorio Coopetraes.

## 🚀 Protocolo de Arranque (Boot)

Para asegurar la coherencia y eficiencia, el Agente debe cargar el contexto en el siguiente orden estricto de precedencia:

1.  **Reglas Globales (Base):** `c:\Users\Home\.gemini\GEMINI.md` (Comportamiento y TypeScript).
2.  **Reglas Técnicas (Linter/MD):** `c:\web\agent\rules\01_master_rules.md`.
3.  **Reglas de Dominio (Coopetraes):** `c:\web\agent\rules\02_coopetraes_rules.md` (Next.js 19, PUC).
4.  **Cerebro del Proyecto (Contexto):** `c:\web\agent\memory\master_context.md`.

---

## 🏗️ Lineamientos de Flujo

*   **Sin Teoría:** Ignorar explicaciones redundantes; solo aplicar comandos y correcciones técnicas.
*   **Single Source of Truth:** La arquitectura se basa en Next.js 19 con App Router y RSC.
*   **Persistencia Obligatoria:** Toda sesión debe concluir actualizando `c:\web\.agent_status.md` con el formato definido en la Regla 02.
