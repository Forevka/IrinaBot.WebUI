import DataBuffer from '@/utilities/DataBuffer';

export interface IMapUploadContextHelper {
    parseMapPartOK(data: DataBuffer): number;
    createContextRequest(MapSize: number, MapName: string): {};
    createMapPart(mapPart: Blob): {};
    createMapSave(): {};
}