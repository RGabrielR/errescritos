import { Post } from '../../interface/post'

interface UpdateBlurProps {
  Post: Post;
  setBlurValue: (value: number) => void;
}

export const updateBlur: React.FC<UpdateBlurProps> = ({ Post, setBlurValue }) =>
{

    if (Post?.image) {
      const img = new Image();
      img.src = Post.image;
      img.onload = () => {
        const imgWidth = img.naturalWidth;
        const imgHeight = img.naturalHeight;
        const winWidth = window.innerWidth;
        const winHeight = window.innerHeight;

        // Calculate the proportion of the image size relative to the viewport
        const widthRatio = imgWidth / winWidth;
        const heightRatio = imgHeight / winHeight;

        // Example logic: reduce blur as image size increases
        const maxBlur = 10; // Max blur when the image is very small
        const minBlur = 0; // No blur when the image is full screen or larger

        const blurIntensity = Math.max(minBlur, maxBlur * Math.max(1 - widthRatio, 1 - heightRatio));
        setBlurValue(blurIntensity);
      };
  } 
  return null;
  };