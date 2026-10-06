<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture rules
- All backend calls go through `src/lib/api/index.ts`; mock data lives only in `src/lib/api/mock.ts` and is used when `VITE_API_BASE_URL` is unset — keeps the FastAPI swap a one-file change.
- App pages live under the pathless `_shell` layout (sidebar); the landing page `/` sits outside it.
- Visual primitives (panels, slots, block buttons, pixel bars) are `@utility` classes in `src/styles.css` plus components in `src/components/bloom/ui.tsx` — never ad-hoc colors.
