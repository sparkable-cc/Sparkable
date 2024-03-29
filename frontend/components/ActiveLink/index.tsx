import { useRouter } from "next/router";
import Link, { LinkProps } from "next/link";
import { PropsWithChildren, useState, useEffect } from "react";

type ActiveLinkProps = LinkProps & {
  className?: string
  activeClassName?: string
}

export const ActiveLink = ({
  children,
  activeClassName,
  className,
  ...props
}: PropsWithChildren<ActiveLinkProps>) => {
  const { asPath, isReady } = useRouter();
  const [ computedClassName, setComputedClassName ] = useState(className);

  useEffect(() => {
    // Check if the router fields are updated client-side
    if (isReady) {
      // Dynamic route will be matched via props.as
      // Static route will be matched via props.href
      const linkPathname = new URL(
        (props.as || props.href) as string,
        location.href // eslint-disable-line 
      ).pathname;

      // Using URL().pathname to get rid of query and hash
      const activePathname = new URL(asPath, location.href).pathname; // eslint-disable-line 

      const newClassName =
        linkPathname === activePathname
          ? `${className} ${activeClassName}`.trim()
          : className;

      if (newClassName !== computedClassName) {
        setComputedClassName(newClassName);
      }
    }
  }, [
    asPath,
    isReady,
    props.as,
    props.href,
    activeClassName,
    className,
    computedClassName,
  ]);

  return (
    <Link
      className={computedClassName}
      {...props}
    >
      {children}
    </Link>
  );
};
