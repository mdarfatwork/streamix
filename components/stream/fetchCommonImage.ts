import axios from "axios";

export const fetchCommonImage = async (content: string, Id: number | string, targetAspectRatio: number) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/${content}/${Id}/images`, {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_MOVIE_API_Read_Access_Token}`,
            },
        });

        // console.log(response);

        const backdrops = response.data.backdrops || [];
        const posters = response.data.posters || [];
        
        const images = [...backdrops, ...posters];
        // console.log(images)

        if (images.length === 0) {
            console.error("No images found");
            return null;
        }

        const closestImage = images.reduce((closest: any, current: any) => {
            const currentDiff = Math.abs(current.aspect_ratio - targetAspectRatio);
            const closestDiff = Math.abs(closest.aspect_ratio - targetAspectRatio);
            return currentDiff < closestDiff ? current : closest;
        });

        // console.log(closestImage.file_path)

        return closestImage.file_path;

    } catch (error: any) {
        console.error(`Error while fetching Common Image: ${error.message}`);
        return null;
    }
}