export default function Link({ href, children, onClick, ...props }) {
  const handleClick = (event) => {
    if (href?.startsWith("/")) {
      event.preventDefault();
      window.history.pushState({}, "", href);
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
    onClick?.(event);
  };

  return <a href={href} onClick={handleClick} {...props}>{children}</a>;
}
