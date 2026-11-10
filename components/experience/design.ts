export type Asset={id:string;name:string;kind:'livery'|'sticker';image?:string;pattern?:string;published:boolean;vehicle:string;category?:string;description?:string;base?:string;accent?:string};
export type Sticker={id:string;name:string;image?:string;text?:string;x:number;y:number;size:number;rotation:number;side:string;panel?:string;point?:[number,number,number];normal?:[number,number,number];surfaceMesh?:string};
export type Design={pattern:string;image?:string;accent:string;scale:number;opacity:number;panel:string;stickers:Sticker[]};
