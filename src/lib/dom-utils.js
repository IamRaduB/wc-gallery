/**
 * Clears the contents of a DOM element
 * @param { Element } container
 */
export function clearContainer(container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}
