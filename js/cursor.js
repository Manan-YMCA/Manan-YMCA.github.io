var cursor_wrapper = document.querySelector(".cursor-wrapper");
var cursor = document.querySelector('.cursor');

document.addEventListener("mousemove", e => {
  cursor_wrapper.setAttribute(
    "style",
    "transform: translate(" + (e.pageX - 22) + "px," + (e.pageY - 15) + "px);"
  );
});

document.addEventListener("click", () => {
  cursor.classList.add("expand");

  setTimeout(() => {
    cursor.classList.remove("expand");
  }, 500);
});
