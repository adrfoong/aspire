# Email Input Component

This project uses Downshift to take care of keyboard navigation and accessibility of the combobox. If I were to handroll that myself (which I did partially), I would need to take care of:

- setting up keypress handlers
- managing focus

Some of the work I've done can for this can be seen in `history.tsx`. You can import the component into the main app to see how it works in the current state.

---

## Additional Work

1. The current component doesn't support tabbing between existing tags
2. The component only supports strings, and not more complex objects, which can enable adding a recipient by name as well as email address

## UI/UX Considerations

1. There's quite a bit of space between tags due to the hidden X icon that only shows on hover. I think most tag fields show the X icon by default so it doesn't look like there is so much unnecessary white space. Another option is to only render the X into the DOM on hover, but that causes layout shift.
2. Do the tags with error have the same hover state as the valid tags?
3. Do we allow users to add a recipient by name?
