export const getFullWebsite = (url) => {
	if (!url) return "/";
	else if (url.startsWith("http")) return url;
	else return `http://${url}`;
};

export const isVendorIdValid = (vendorId) =>{
	return !!vendorId;
}

export const isProductIdValid = productId => {
	return !!productId;

}