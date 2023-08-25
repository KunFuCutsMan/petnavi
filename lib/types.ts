export type NaviName = `${string}.EXE`

export type NaviFileName = `${string}DotEXE.json`

export type CoreType = "NEUTRAL"
    | "FIRE"
    | "WOOD"
    | "WOOD"
    | "AQUA"
    | "ELEC"
    | "SWORD"
    | "WIND"
    | "TARGET"
    | "BREAK"

export interface NaviFile {
    name: NaviName,
    level: number,
    core: CoreType,
    maxHP: number,
    HP: number,
    maxCP: number,
    CP: number,
    attacksCP: string[],
    willBeDeleted: boolean,
    dir: string,
    zenny: number,
    chipLibrary: string[],
}

export function isNaviFile( obj: any ): obj is NaviFile {
    return 'name' in obj
        && 'level' in obj
        && 'core' in obj
        && 'maxHP' in obj
        && 'HP' in obj
        && 'maxCP' in obj
        && 'CP' in obj
        && 'attacksCP' in obj
        && 'willBeDeleted' in obj
        && 'dir' in obj
        && 'zenny' in obj
        && 'chipLibrary' in obj
}