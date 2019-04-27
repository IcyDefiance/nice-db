export interface IIconDefinition {
	dims: [number, number];
	els: ISvgEl[];
}

export type ISvgEl = ISvgElPath;

export interface ISvgElPath {
	type: SvgElType.Path;
	d: string;
}

export enum SvgElType {
	Path,
}
