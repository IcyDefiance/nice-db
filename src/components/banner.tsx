import { CssBaseline, Divider, Grid, Paper } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import * as React from "react";

export interface BannerProps {
	children?: React.ReactNode;
}

export function Banner({ children }: BannerProps) {
	return (
		<>
			<Paper elevation={0}>
				<Box pt={2} pr={1} pb={1} pl={2}>
					{children}
				</Box>
			</Paper>
			<Divider />
		</>
	);
}

export interface BannerActionsProps {
	children?: React.ReactNode;
}

export function BannerActions({ children }: BannerActionsProps) {
	return (
		<Grid container justify="flex-end" spacing={1}>
			{children}
		</Grid>
	);
}
