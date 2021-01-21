export function render(tag, attributes = {}) {
  // create the component under test
  const component = document.createElement(tag);

  // set component attributes
  Object.keys(attributes).forEach((attrKey) => component.setAttribute(attrKey, attributes[attrKey]));

  // add the component to the dom
  document.appendChild(component);

  return new Promise((resolve) => {
    function checkRender() {
      const element = document.querySelector(tag);
      if (element) {
        resolve(element);
      } else {
        setTimeout(checkRender, 0);
      }
    }

    checkRender();
  });
}
