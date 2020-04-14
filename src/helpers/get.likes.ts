// eslint-disable-next-line import/prefer-default-export
export function getLikes(arrayOfObjects: any): any {
    const arrayOfLikes = [];

    // eslint-disable-next-line no-plusplus
    for (let i = 0, l = arrayOfObjects.length; i < l; i++) {
        arrayOfLikes.push(arrayOfObjects[i].likes);
    }

    return arrayOfLikes;
}
