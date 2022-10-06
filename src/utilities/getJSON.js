export const getJSON = function (
	url,
	controller,
	errorMsg = 'Something went wrong'
) {
	return fetch(url).then((response) => {
		if (!response.ok) {
			throw new Error(`${errorMsg} ${response.status}`);
		}

		return response.json();
	});
};
