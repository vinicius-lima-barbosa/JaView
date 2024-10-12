export async function FetchMovies(page = 1) {
  const apiKey = "0d881a63de18a3b460f2158c6adf70c7";
  const BASE_URL = "https://api.themoviedb.org/3";

  try {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${apiKey}&language=en-US&page=${page}`
    );

    if (!response.ok) throw new Error("Failed to fetch Movies!");

    const data = await response.json();
    console.log(data);
    return data.results;
  } catch (error) {
    console.log(`Error while fetching movies: ${error}`);
    return [];
  }
}
