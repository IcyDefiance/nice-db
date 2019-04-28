import * as React from "react";

export const AButton = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(
	(props, ref) => {
		return <a href="javascript:void(0)" role="button" {...props} ref={ref} />;
	},
);
