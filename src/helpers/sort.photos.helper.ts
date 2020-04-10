// eslint-disable-next-line import/prefer-default-export
export function sortPhotosByDate(usersPhotos: { Items: { UploadTime: number; }[]; }) {
    return usersPhotos.Items.sort(function(
        a: { UploadTime: number },
        b: { UploadTime: number }
    ) {
        return b.UploadTime - a.UploadTime;
    });
}
