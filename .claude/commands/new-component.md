Create a new Vue component for this project.

Arguments: $ARGUMENTS
Format: `{ComponentName} in {module|shared|ui}`

Examples:
- `WorkoutCardComponent in workout`
- `UiProgressBar in ui`
- `StatsChartComponent in shared`

Rules:
- Use `<script setup lang="ts">` — no Options API
- Define props with `defineProps<{...}>()`
- Define emits with `defineEmits<{...}>()`
- Use TailwindCSS for all styling — no inline styles
- If placed in `shared/ui/`: follow headless pattern, minimal styling, highly composable
- If placed in a module `components/`: can be more specific to the feature
- If it wraps a `UiModal`, use `UiModalHeader`, `UiModalBody`, `UiModalFooter` sub-components
- Component filename: PascalCase (e.g., `WorkoutCardComponent.vue`)

After creating the file, show an example of how to import and use it.
