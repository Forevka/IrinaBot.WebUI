import DataBuffer from '@/utilities/DataBuffer';

export default interface IMapUploadContextHelper {
    parseMapPartOK(data: DataBuffer): number;
    parseMapSaved(data: DataBuffer): string;

    createContextRequest(MapSize: number, MapName: string): Blob;
    createMapPart(mapPart: Blob): Blob;
    createMapSave(): ArrayBuffer;
}