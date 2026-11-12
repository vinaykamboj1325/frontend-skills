# Mapping Figma to code

## Layout

| Figma | Code |
|---|---|
| Auto layout, horizontal / vertical | Flex row / column |
| Auto layout with wrap | Flex wrap, or grid when items align in both directions |
| Gap | `gap` (a spacing token) |
| Padding | `padding` (spacing tokens) |
| Fill container | `flex: 1` on the main axis, `align-self: stretch` or `width: 100%` on the cross axis |
| Hug contents | No fixed size; let content size it |
| Fixed width or height | Fixed size only for icons, avatars and media; for text containers prefer `max-width` |
| Min / max width | `min-width` / `max-width` |
| Absolute position inside a frame | `position: absolute` in a `position: relative` parent; use only for overlays and badges |
| Space between | `justify-content: space-between` |
| Constraints (left and right, scale) | Usually a sign the frame is not using auto layout; rebuild the intent with flex or grid instead of copying coordinates |

Never copy `x` and `y` coordinates of auto-layout children. They are results of the layout, and copying them breaks the page at any other width.

## Components and variants

| Figma | Code |
|---|---|
| Component set | One component |
| Variant property (Size, Type) | A prop with a union type |
| Boolean property | A boolean prop |
| Instance swap property | A prop that takes a component or element (an icon slot) |
| Text property | A string prop or children |
| State variant (Hover, Focus, Pressed, Disabled) | CSS states and the `disabled` attribute, not a prop, unless the project already exposes them |
| Nested instance | The matching child component, with its own props |

If the code component already exists and its props differ from the Figma properties, use the code component's API and note the difference. The codebase wins over the design file for naming.

## Text

- Map each text style to the project's typography token or component.
- A fixed-width text layer with truncation means `text-overflow: ellipsis` or line clamping; check the design for which.
- Text that looks like a heading gets a heading element at the right level for the page outline, whatever its visual size.

## Colour, effects, radius

- Variables map to tokens by name. If the names differ between Figma and code, match by resolved value and record the pair in the conventions file under Figma.
- Check both modes when the file has light and dark variable modes.
- Shadows and blurs map to shadow tokens. A one-off shadow is a question for the user.

## Images and icons

- Icons: use the project's icon set if the icon exists there; otherwise export as SVG and add it the way the project adds icons.
- Images: export at the size used, plus a 2x version when the project uses responsive images. Always set width and height to avoid layout shift, and write real alternative text or mark decorative images as such.

## Things the design does not say

Decide these from the project's patterns and report them:

- focus styles
- behaviour between the designed breakpoints
- long content, missing content, very large numbers
- loading and error states when no frame exists
