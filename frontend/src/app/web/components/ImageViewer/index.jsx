import React from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import config from "config";

export default function SingleImageViewer({ url, ...props }) {
	return (
		<ImageGallery
			items={[
				{
					original: config.getImageHost(url),
					thumbnail: config.getImageHost(url),
				},
			]}
			infinite={false}
			showNav={false}
			showThumbnails={false}
			showPlayButton={false}
			{...props}
		/>
	);
}
