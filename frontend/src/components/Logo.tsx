import logo from "../assets//bsu-logo.png";
export function Logo(props: { className?: string; size?: number }) {
  const size = props.size ?? 40;
  return (
    <img
      src={logo}
      alt="Beni-Suef University Logo"
      width={size}
      height={size}
      className={props.className}
      style={{ width: size, height: size }}
    />
  );
}

