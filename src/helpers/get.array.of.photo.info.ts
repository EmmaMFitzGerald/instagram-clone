// eslint-disable-next-line import/prefer-default-export
export function getArrayOfPhotos(arrayOfObjects: string | any[]): any {
    console.log("arrayofobjects", arrayOfObjects);
    const arrayOfPhotos = [];

    // eslint-disable-next-line no-plusplus
    for (let i = 0, l = arrayOfObjects.length; i < l; i++) {
        arrayOfPhotos.push(arrayOfObjects[i].Items[0]);
    }

    console.log("arrayofPhotos", arrayOfPhotos);

    return arrayOfPhotos;
}
