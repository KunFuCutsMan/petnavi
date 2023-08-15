// Imports and constants
import * as fs from "fs/promises";
import path from "path";
import storage from "node-persist";
import { CoreType, NaviFile, NaviName } from "../types";

// Storage
const STORAGE_SETTINGS: storage.InitOptions = {
	dir: path.resolve(__dirname, '..', 'NaviStorage'),
	stringify: JSON.stringify,
	parse: JSON.parse,
	encoding: 'utf8',
	logging: false,
	expiredInterval: 2 * 60 * 1000,
	forgiveParseErrors: true
}

const HP_MULTIPLIER = 10
const CP_MULTIPLIER = 2

export namespace NFM {

	export async function readJson( fileName: string ): Promise<Object> {
		try {
			const str = await fs.readFile( path.resolve( process.cwd(), fileName ) )
			return JSON.parse( str.toString() )
		}
		catch ( e ) {
			console.error("An error occured whilst reading the file:", e)
			return {}
		}
	}
	
	export async function makeJson( json: Object, fileName: string ): Promise<boolean> {
		try {
			await fs.writeFile(
				path.resolve( process.cwd(), fileName ),
				JSON.stringify( json ), 'utf-8'
			)

			return true
		} catch ( e ) {
			console.error(e)
			return false
		}
	}

	export async function deleteJson( filePath: string ) {
		await fs.unlink( filePath )
	}

	export async function makeNewNavi(name: string, level = 10, core: CoreType ): Promise<boolean> {
		const navi: NaviFile = {
			name: `${name}.EXE`,
			level: level,
			core: core,
			maxHP: level * HP_MULTIPLIER,
			HP: level * HP_MULTIPLIER,
			maxCP: level * CP_MULTIPLIER,
			CP: level * CP_MULTIPLIER,
			attacksCP: [],
			willBeDeleted: false,
			dir: path.join( process.cwd(), `${name}DotEXE.json` ),
			zenny: 0,
			chipLibrary: []
		}

		return await makeJson(navi, navi.dir)
	}

	export async function deleteNaviWithFile( naviName: NaviName ) {
		const navi = await deleteNaviFromStorage( naviName )

		if ( navi )
			await deleteJson( navi.dir )
		else console.warn("Navi was only deleted from storage")
	}

	export async function deleteNaviFromStorage(naviName: NaviName ): Promise<NaviFile | undefined> {
		await storage.init(STORAGE_SETTINGS)

		const res = await storage.removeItem( naviName )
		
		if ( res.removed )
			return JSON.parse( res.file )
		else return undefined
	}

	export async function loadNaviIntoStorage( navi: NaviFile ) {
		await storage.init(STORAGE_SETTINGS)
		await storage.setItem( navi.name, navi )
	}

	export async function saveNaviFromStorage( navi: NaviFile ) {
		await storage.init( STORAGE_SETTINGS )
		await storage.setItem( navi.name, navi )
	}

	export async function updateNaviStatsInStorage( navi: NaviFile ) {
		await storage.init( STORAGE_SETTINGS )
		await storage.updateItem( navi.name, navi )
	}

	export async function getNaviFromStorage( navi: NaviName ): Promise<NaviFile> {
		await storage.init( STORAGE_SETTINGS )
		return await storage.getItem( navi )
	}

	export async function getAllLoadedNavis(): Promise<NaviFile[]> {
		await storage.init( STORAGE_SETTINGS )
		return await storage.valuesWithKeyMatch('.EXE')
	}

}