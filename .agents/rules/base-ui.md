# Base UI

Decode Base UI production error numbers from the installed package instead of guessing.

Applies to: `src/components/**`, `src/components/ui/**`

A production build replaces every error string with an id, so the console only shows `Base UI error #31`. Recover the real message by grepping the installed package for that id:

```bash
grep -rnoE "formatErrorMessage2?\)?\.default\)\(31\)" node_modules/@base-ui/react/
```

The matching `.mjs` file contains both branches of the ternary, so the development message is right next to the id.

## Menu group parts need a group parent

Applies to: `src/components/**`

`DropdownMenuLabel` and `DropdownMenuGroupLabel` throw `MenuGroupContext is missing` unless they sit inside a `DropdownMenuGroup` or a `DropdownMenuRadioGroup`. A `DropdownMenuRadioGroup` supplies the context only to its own descendants, so wrap the label and separator along with the radio group in a `DropdownMenuGroup`.

`DropdownMenuRadioItem` does not close the menu on selection by default. Pass `closeOnClick` when a radio pick is meant to dismiss the popup.
