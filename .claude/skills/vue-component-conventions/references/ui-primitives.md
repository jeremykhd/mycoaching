# UI Primitives

Located in `src/shared/ui/`. Always use these instead of building from scratch.

## UiCard

```vue
<UiCard>
  <UiCardTitle>Title</UiCardTitle>
  <UiCardContent>
    <UiCardText>Some text</UiCardText>
    <UiCardNumber>42</UiCardNumber>
  </UiCardContent>
</UiCard>
```

Sub-components: `UiCard`, `UiCardTitle`, `UiCardIcon`, `UiCardText`, `UiCardNumber`, `UiCardContent`

## UiModal

```vue
<UiModal :is-open="isOpen" @close="isOpen = false">
  <UiModalHeader>Modal Title</UiModalHeader>
  <UiModalBody>
    <!-- content -->
  </UiModalBody>
  <UiModalFooter>
    <button @click="isOpen = false">Cancel</button>
    <button @click="handleSave">Save</button>
  </UiModalFooter>
</UiModal>
```

## UiInputText / UiInputNumber

```vue
<UiInputText
  v-model="form.firstname"
  label="First name"
  placeholder="Enter first name"
/>

<UiInputNumber
  v-model="form.weight"
  label="Weight (kg)"
/>
```

## UiSelect

```vue
<UiSelect
  v-model="form.type"
  :options="exerciseTypes"
  label="Exercise type"
/>
```
